"""Modely chatovací asistentky — zrcadleno v frontend/src/types.ts."""

from datetime import datetime
from typing import Any, Literal, Optional
from uuid import uuid4

from pydantic import BaseModel, Field

from models.booking import utcnow

ChatRole = Literal["user", "assistant"]


class ChatTurn(BaseModel):
    role: ChatRole
    content: str
    created_at: datetime = Field(default_factory=utcnow)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    session_id: Optional[str] = None


class ChatReply(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid4()))
    reply: str
    # id rezervace, pokud ji asistentka během konverzace vytvořila
    booking_id: Optional[str] = None
    # zdroj odpovědi: „agent“ = externí agent zákaznice, „claude“ = vestavěná asistentka
    source: Literal["agent", "claude"] = "claude"
    # kroky, které asistentka udělala (pro jemný indikátor v UI)
    actions: list[str] = []


class ChatHistory(BaseModel):
    session_id: str
    turns: list[ChatTurn] = []


class AgentStatus(BaseModel):
    external_agent: bool
    calendar_connected: bool


def turn_to_doc(turn: ChatTurn) -> dict[str, Any]:
    return turn.model_dump()
