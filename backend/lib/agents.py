"""AI agenti pipeline Studio M.

Agent 1 — Claude („chytrý“): z popisu zákaznice připraví přesný prompt pro
generování obrázku. Nic negeneruje, jen píše prompt.
Agent 2 — Execution Agent („hloupý“): vezme prompt a zavolá generátor
fotorealistických obrázků. Nic neinterpretuje, jen vykoná.
"""

import logging
import os
import uuid

from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.llm.openai.image_generation import OpenAIImageGeneration

logger = logging.getLogger(__name__)

CLAUDE_MODEL = "claude-sonnet-4-5-20250929"
IMAGE_MODEL = "gpt-image-1"

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


def _api_key() -> str:
    key = os.environ.get("EMERGENT_LLM_KEY")
    if not key:
        raise RuntimeError("Chybí EMERGENT_LLM_KEY v backend/.env")
    return key


async def claude_prompt_agent(design_description: str, service_name: str) -> str:
    """Agent 1 — Claude: popis zákaznice → přesný prompt pro generování obrázku."""
    chat = LlmChat(
        api_key=_api_key(),
        session_id=f"studio-m-prompt-{uuid.uuid4().hex[:8]}",
        system_message=CLAUDE_SYSTEM,
    )
    chat.with_model("anthropic", CLAUDE_MODEL)
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


async def execution_agent_generate_image(prompt: str) -> bytes:
    """Agent 2 — Execution Agent: prompt → fotorealistický obrázek nehtů."""
    generator = OpenAIImageGeneration(api_key=_api_key())
    images = await generator.generate_images(
        prompt=prompt,
        model=IMAGE_MODEL,
        number_of_images=1,
        quality="medium",
    )
    if not images or not images[0]:
        raise RuntimeError("Generátor obrázků nevrátil žádná data.")
    logger.info("Agent 2 (Execution): obrázek vygenerován (%d bajtů)", len(images[0]))
    return images[0]
