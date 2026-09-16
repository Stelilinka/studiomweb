"""AI agenti pipeline Studio M.

Agent 1 — Claude („chytrý“): z popisu zákaznice připraví přesný prompt pro
generování obrázku. Nic negeneruje, jen píše prompt.
Agent 2 — Execution Agent („hloupý“): vezme prompt a zavolá generátor
fotorealistických obrázků. Nic neinterpretuje, jen vykoná.

Klíče (backend/.env): ANTHROPIC_API_KEY a GEMINI_API_KEY zákaznice mají
přednost; EMERGENT_LLM_KEY slouží jako automatická záloha, ať pipeline
nikdy nezastaví výpadek externího engine.
"""

import asyncio
import logging
import os
import uuid

from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.llm.openai.image_generation import OpenAIImageGeneration

logger = logging.getLogger(__name__)

CLAUDE_MODEL = "claude-sonnet-4-5-20250929"
IMAGE_MODEL_OPENAI = "gpt-image-1"
IMAGE_MODEL_NANO_BANANA = "gemini-2.5-flash-image"
IMAGE_MODEL_IMAGEN = "imagen-3.0-generate-002"

CLAUDE_SYSTEM = (
    "Jsi prompt agent beauty studia Studio M. Tvoje jediná úloha: vezmi popis "
    "vysněného designu nehtů od zákaznice (píše česky) a přepiš ho do JEDNOHO "
    "precizního promptu pro generátor fotorealistických obrázků.\n"
    "Pravidla:\n"
    "- Prompt piš v angličtině, jeden odstavec, 60–120 slov.\n"
    "- Zachyť tvar nehtů, délku, bázi i finální úpravu, konkrétní odstíny barev, "
    "efekty (chrom, ombré, linky, lesk, mat), stav kůžičky.\n"
    "- Doplň fotografický styl: macro close-up elegantní ženské ruky, měkké "
    "studiové světlo, krémově neutrální pozadí, vysoká detailizace.\n"
    "- Nikdy nezmiňuj text, logo ani watermark v obraze.\n"
    "Vrať POUZE finální prompt — bez uvozovek, bez úvodu, bez komentářů."
)


def _anthropic_key() -> str:
    key = os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("EMERGENT_LLM_KEY")
    if not key:
        raise RuntimeError("Chybí ANTHROPIC_API_KEY (nebo EMERGENT_LLM_KEY) v backend/.env")
    return key


async def claude_prompt_agent(design_description: str, service_name: str) -> str:
    """Agent 1 — Claude: popis zákaznice → přesný prompt pro generování obrázku."""
    chat = LlmChat(
        api_key=_anthropic_key(),
        session_id=f"studio-m-prompt-{uuid.uuid4().hex[:8]}",
        system_message=CLAUDE_SYSTEM,
    )
    chat.with_model("anthropic", CLAUDE_MODEL)
    chat.with_params(max_tokens=2048)
    user_text = (
        f"Objednaná služba: {service_name}\n"
        f"Popis designu od zákaznice (česky): {design_description}"
    )
    prompt = await chat.send_message(UserMessage(text=user_text))
    prompt = (prompt or "").strip().strip('"').strip()
    if not prompt:
        raise RuntimeError("Claude nevrátil žádný prompt.")
    logger.info("Agent 1 (Claude): prompt připraven (%d znaků)", len(prompt))
    return prompt


def _gemini_nanobanana_sync(api_key: str, prompt: str) -> bytes:
    """Vlastní Gemini klíč — nano banana přes Gemini Developer API režim."""
    from google import genai

    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model=IMAGE_MODEL_NANO_BANANA,
        contents=[prompt],
    )
    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.data:
            return part.inline_data.data
    raise RuntimeError("Nano banana nevrátil obrázek.")


def _gemini_imagen_sync(api_key: str, prompt: str) -> bytes:
    """Vlastní Gemini klíč — Imagen přes Vertex režim."""
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key, vertexai=True)
    response = client.models.generate_images(
        model=IMAGE_MODEL_IMAGEN,
        prompt=prompt,
        config=types.GenerateImagesConfig(number_of_images=1),
    )
    return response.generated_images[0].image.image_bytes


async def _gemini_generate_image(api_key: str, prompt: str) -> bytes:
    try:
        image = await asyncio.to_thread(_gemini_nanobanana_sync, api_key, prompt)
        logger.info("Agent 2 (Execution): obrázek z vlastního Gemini klíče (nano banana)")
        return image
    except Exception as exc:
        logger.warning("Gemini nano banana selhalo (%s) — zkouším Imagen/Vertex", exc)
    image = await asyncio.to_thread(_gemini_imagen_sync, api_key, prompt)
    logger.info("Agent 2 (Execution): obrázek z vlastního Gemini klíče (Imagen/Vertex)")
    return image


async def _emergent_generate_image(prompt: str) -> bytes:
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise RuntimeError("Chybí GEMINI_API_KEY i EMERGENT_LLM_KEY v backend/.env")
    generator = OpenAIImageGeneration(api_key=api_key)
    images = await generator.generate_images(
        prompt=prompt,
        model=IMAGE_MODEL_OPENAI,
        number_of_images=1,
        quality="medium",
    )
    if not images or not images[0]:
        raise RuntimeError("Generátor obrázků nevrátil žádná data.")
    logger.info("Agent 2 (Execution): obrázek z Emergent engine (%d bajtů)", len(images[0]))
    return images[0]


async def execution_agent_generate_image(prompt: str) -> bytes:
    """Agent 2 — Execution Agent: prompt → fotorealistický obrázek nehtů.

    Pořadí engine: vlastní GEMINI_API_KEY (nano banana → Imagen/Vertex),
    potom automatická záloha na Emergent engine.
    """
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if gemini_key:
        try:
            return await _gemini_generate_image(gemini_key, prompt)
        except Exception as exc:
            logger.warning(
                "Vlastní Gemini klíč selhal (%s) — automatická záloha na Emergent engine", exc
            )
    return await _emergent_generate_image(prompt)
