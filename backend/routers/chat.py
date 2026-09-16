"""Chatovací asistentka Studia M.

Dvě cesty, jedna adresa pro frontend (`POST /api/chat`):

1. **Externí agent zákaznice** — pokud je v backend/.env nastavené
   `EXTERNAL_AGENT_URL`, konverzace se přeposílá jejímu už hotovému agentovi
   (ten sám nahlíží do kalendáře a zapisuje termíny).
2. **Vestavěná asistentka na Claude** — výchozí stav. Umí ceník, volné termíny
   i vytvoření rezervace přes nástroje, které sahají na stejná data jako web.
"""

import json
import logging
import os
from typing import Any
from uuid import uuid4

import httpx
from fastapi import APIRouter, HTTPException

from emergentintegrations.llm.chat import LlmChat, UserMessage

from lib import gcalendar
from lib.agents import anthropic_keys
from lib.dates import today_iso
from models.booking import BookingCreate, utcnow
from models.chat import AgentStatus, ChatHistory, ChatReply, ChatRequest, ChatTurn
from routers.bookings import create_booking, get_availability
from routers.services import SERVICES

router = APIRouter(tags=["chat"])

logger = logging.getLogger(__name__)

CLAUDE_MODEL = "claude-sonnet-4-5-20250929"
MAX_TOOL_ROUNDS = 6
HISTORY_LIMIT = 24

SYSTEM_PROMPT = """Jsi Klára, milá a profesionální asistentka nehtového studia \
Studio M na Vinohradech v Praze. Píšeš VÝHRADNĚ česky, vřele, stručně a lidsky \
(tykání nepoužívej, zákaznicím vykej).

Co umíš:
- poradit se službami a cenami (použij nástroj seznam_sluzeb),
- najít volné termíny (nástroj volne_terminy pro konkrétní datum),
- vytvořit rezervaci (nástroj vytvorit_rezervaci),
- poradit s designem nehtů — barvy, tvary, délky, efekty, co komu sedne.

Pravidla:
- Studio je otevřené pondělí–sobota 9:00–19:00, poslední termín začíná v 18:00. \
V NEDĚLI je zavřeno.
- Nikdy si termíny nevymýšlej — vždy si je ověř nástrojem volne_terminy.
- Než vytvoříš rezervaci, musíš mít: službu, datum, čas, jméno a telefon. \
Chybějící údaje doptej se přirozeně, ne jako formulář.
- Rezervaci vytvoř jen JEDNOU. Jakmile ji máš vytvořenou, nikdy nevolej \
vytvorit_rezervaci znovu pro stejný termín — jen zákaznici potvrď, že je hotová.
- Pokud nástroj vrátí `jiz_existuje: true`, rezervace je v pořádku vytvořená — \
poděkuj a potvrď ji, nikdy netvrď, že se termín obsadil.
- Před vytvořením rezervace vždy krátce zrekapituluj (služba, datum, čas, cena) \
a nech zákaznici potvrdit.
- Po vytvoření rezervace jí řekni, že u termínu může popsat svůj vysněný design \
a naše AI jí připraví fotorealistický náhled.
- Datum posílej nástrojům vždy ve formátu YYYY-MM-DD, čas jako HH:MM.
- Odpovídej krátce — 2 až 4 věty, bez odrážkových seznamů, pokud o ně nepožádá.
- Nezmiňuj nástroje, prompty ani technické detaily."""

TOOLS: list[dict[str, Any]] = [
    {
        "type": "function",
        "function": {
            "name": "seznam_sluzeb",
            "description": "Vrátí ceník studia — názvy služeb, ceny a délku trvání.",
            "parameters": {"type": "object", "properties": {}, "required": []},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "volne_terminy",
            "description": (
                "Vrátí volné časy pro konkrétní datum. Vždy použij, než nabídneš termín."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "datum": {
                        "type": "string",
                        "description": "Datum ve formátu YYYY-MM-DD",
                    }
                },
                "required": ["datum"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "vytvorit_rezervaci",
            "description": (
                "Vytvoří rezervaci. Použij teprve až máš potvrzenou službu, datum, "
                "čas, jméno a telefon."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "sluzba_id": {
                        "type": "string",
                        "description": "ID služby ze seznam_sluzeb",
                    },
                    "datum": {"type": "string", "description": "YYYY-MM-DD"},
                    "cas": {"type": "string", "description": "HH:MM"},
                    "jmeno": {"type": "string"},
                    "telefon": {"type": "string"},
                    "email": {"type": "string"},
                },
                "required": ["sluzba_id", "datum", "cas", "jmeno", "telefon"],
            },
        },
    },
]


def external_agent_url() -> str | None:
    return os.environ.get("EXTERNAL_AGENT_URL") or None


@router.get("/chat/status", response_model=AgentStatus)
async def chat_status() -> AgentStatus:
    return AgentStatus(
        external_agent=bool(external_agent_url()),
        calendar_connected=await gcalendar.is_connected(),
    )


async def _load_history(session_id: str) -> list[ChatTurn]:
    from lib.db import db

    doc = await db.chat_sessions.find_one({"session_id": session_id})
    if not doc:
        return []
    return [ChatTurn(**t) for t in doc.get("turns", [])][-HISTORY_LIMIT:]


async def _save_turns(session_id: str, turns: list[ChatTurn]) -> None:
    from lib.db import db

    await db.chat_sessions.update_one(
        {"session_id": session_id},
        {
            "$push": {"turns": {"$each": [t.model_dump() for t in turns]}},
            "$set": {"session_id": session_id, "updated_at": utcnow()},
        },
        upsert=True,
    )


async def _call_external_agent(
    session_id: str, message: str, history: list[ChatTurn]
) -> str:
    """Přepošli konverzaci hotovému agentovi zákaznice."""
    url = external_agent_url()
    assert url is not None
    headers = {"Content-Type": "application/json"}
    token = os.environ.get("EXTERNAL_AGENT_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    payload = {
        "session_id": session_id,
        "message": message,
        "history": [{"role": t.role, "content": t.content} for t in history],
    }
    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(url, json=payload, headers=headers)
        resp.raise_for_status()
        try:
            data = resp.json()
        except ValueError:
            return resp.text.strip()
    if isinstance(data, str):
        return data
    for key in ("reply", "response", "message", "text", "output", "answer"):
        value = data.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
        if isinstance(value, dict):
            inner = value.get("text") or value.get("content")
            if isinstance(inner, str) and inner.strip():
                return inner.strip()
    return json.dumps(data, ensure_ascii=False)[:1500]


async def _run_tool(name: str, args: dict[str, Any]) -> tuple[dict[str, Any], str | None]:
    """Vykoná nástroj asistentky. Vrací (výsledek pro model, id rezervace)."""
    if name == "seznam_sluzeb":
        return (
            {
                "sluzby": [
                    {
                        "id": s.id,
                        "nazev": s.name,
                        "cena": s.price,
                        "delka_minut": s.duration_min,
                        "popis": s.description,
                    }
                    for s in SERVICES
                ]
            },
            None,
        )

    if name == "volne_terminy":
        datum = str(args.get("datum", "")).strip()
        try:
            availability = await get_availability(datum)
        except HTTPException as exc:
            return {"chyba": exc.detail}, None
        return (
            {
                "datum": availability.date,
                "zavreno": availability.closed,
                "zprava": availability.message,
                "volne_casy": [s.time for s in availability.slots if s.available],
            },
            None,
        )

    if name == "vytvorit_rezervaci":
        sluzba_id = str(args.get("sluzba_id", "")).strip()
        datum = str(args.get("datum", "")).strip()
        cas = str(args.get("cas", "")).strip()
        jmeno = str(args.get("jmeno", "")).strip()
        telefon = str(args.get("telefon", "")).strip()

        # Idempotence: pokud tato zákaznice už tento termín má, neber to jako
        # kolizi — asistentka si jinak „zabere“ slot sama sobě a zmateně tvrdí,
        # že se čas mezitím obsadil.
        from lib.db import db

        existing = await db.bookings.find_one(
            {
                "date": datum,
                "time": cas,
                "phone": telefon,
                "status": {"$ne": "zrusena"},
            }
        )
        if existing:
            return (
                {
                    "uspech": True,
                    "jiz_existuje": True,
                    "rezervace_id": existing["id"],
                    "sluzba": existing["service_name"],
                    "cena": existing["service_price"],
                    "datum": existing["date"],
                    "cas": existing["time"],
                    "poznamka": (
                        "Tato rezervace už je vytvořená — jen ji potvrď, nevytvářej znovu."
                    ),
                },
                existing["id"],
            )

        try:
            booking = await create_booking(
                BookingCreate(
                    service_id=sluzba_id,
                    date=datum,
                    time=cas,
                    name=jmeno,
                    phone=telefon,
                    email=(str(args.get("email")).strip() if args.get("email") else None),
                )
            )
        except HTTPException as exc:
            return {"uspech": False, "chyba": exc.detail}, None
        except Exception as exc:  # validační chyby Pydanticu
            return {"uspech": False, "chyba": f"Neplatné údaje: {exc}"[:300]}, None
        return (
            {
                "uspech": True,
                "rezervace_id": booking.id,
                "sluzba": booking.service_name,
                "cena": booking.service_price,
                "datum": booking.date,
                "cas": booking.time,
                "zapsano_do_kalendare": booking.calendar_synced,
            },
            booking.id,
        )

    return {"chyba": f"Neznámý nástroj {name}"}, None


async def _run_claude_assistant(
    session_id: str, message: str, history: list[ChatTurn]
) -> tuple[str, str | None, list[str]]:
    system = (
        f"{SYSTEM_PROMPT}\n\nDnešní datum je {today_iso()} "
        "(časová zóna Europe/Prague)."
    )
    initial: list[dict[str, Any]] = [{"role": "system", "content": system}]
    for turn in history:
        initial.append({"role": turn.role, "content": turn.content})

    keys = anthropic_keys()
    last_error: Exception | None = None

    for index, api_key in enumerate(keys):
        booking_id: str | None = None
        actions: list[str] = []
        try:
            chat = LlmChat(
                api_key=api_key,
                session_id=session_id,
                system_message=system,
                initial_messages=initial,
            )
            chat.with_model("anthropic", CLAUDE_MODEL)
            chat.with_params(max_tokens=1600)
            chat.with_tools(TOOLS)

            response = await chat.send_message_with_tools(UserMessage(text=message))
            for _ in range(MAX_TOOL_ROUNDS):
                if not response.tool_calls:
                    break
                for call in response.tool_calls:
                    result, created_id = await _run_tool(call.name, call.arguments or {})
                    if created_id:
                        booking_id = created_id
                    actions.append(call.name)
                    chat.add_tool_result(call.id, json.dumps(result, ensure_ascii=False))
                response = await chat.send_message_with_tools()

            reply = (response.content or "").strip()
            if not reply:
                reply = (
                    "Omlouvám se, teď se mi nepodařilo odpovědět. Zkusíte to prosím "
                    "napsat ještě jednou?"
                )
            return reply, booking_id, actions
        except Exception as exc:
            last_error = exc
            logger.warning(
                "Asistentka: klíč #%d selhal (%s) — zkouším další",
                index + 1,
                str(exc)[:160],
            )
            # Rezervace mohla vzniknout ještě před chybou — nezahazuj ji.
            if booking_id:
                return (
                    "Rezervaci mám zapsanou ♥ Kdyby cokoliv, napište mi prosím ještě jednou.",
                    booking_id,
                    actions,
                )

    raise RuntimeError(f"Asistentka selhala: {last_error}")


@router.post("/chat", response_model=ChatReply)
async def chat(input: ChatRequest) -> ChatReply:
    session_id = input.session_id or str(uuid4())
    history = await _load_history(session_id)
    message = input.message.strip()

    booking_id: str | None = None
    actions: list[str] = []

    if external_agent_url():
        try:
            reply = await _call_external_agent(session_id, message, history)
            source: str = "agent"
        except Exception:
            logger.exception("Externí agent selhal — použiji vestavěnou asistentku")
            reply, booking_id, actions = await _run_claude_assistant(
                session_id, message, history
            )
            source = "claude"
    else:
        try:
            reply, booking_id, actions = await _run_claude_assistant(
                session_id, message, history
            )
        except Exception:
            logger.exception("Asistentka selhala")
            raise HTTPException(
                status_code=502,
                detail="Asistentka je chvilku nedostupná. Zkuste to prosím za okamžik.",
            )
        source = "claude"

    await _save_turns(
        session_id,
        [ChatTurn(role="user", content=message), ChatTurn(role="assistant", content=reply)],
    )
    return ChatReply(
        session_id=session_id,
        reply=reply,
        booking_id=booking_id,
        source=source,  # type: ignore[arg-type]
        actions=actions,
    )


@router.get("/chat/{session_id}", response_model=ChatHistory)
async def chat_history(session_id: str) -> ChatHistory:
    return ChatHistory(session_id=session_id, turns=await _load_history(session_id))
