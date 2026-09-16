"""Demo data pro Studio M — spustit: cd /app/backend && python seed.py

Idempotentní: vkládá jen pokud je kolekce rezervací prázdná. Nespouští se
automaticky, není importovaná serverem.
"""

import asyncio
from datetime import date, timedelta


def _upcoming_weekday(start_days: int) -> str:
    """Nejbližší pracovní den (ne-neděle) za `start_days` dní — jako YYYY-MM-DD."""
    day = date.today() + timedelta(days=start_days)
    while day.weekday() == 6:  # neděle
        day += timedelta(days=1)
    return day.isoformat()


DEMO_BOOKINGS = [
    {
        "id": "demo-potvrzena-001",
        "service_id": "gel-lak",
        "service_name": "Gel lak",
        "service_price": "650 Kč",
        "service_duration_min": 60,
        "date": _upcoming_weekday(2),
        "time": "10:00",
        "name": "Tereza K.",
        "phone": "+420 777 123 456",
        "email": "tereza@example.cz",
        "design_description": (
            "Miluju jemné nude tóny, na prsteníčku a prostředníčku bych chtěla "
            "zlaté mini kamínky a lesklý finish. Krátká až střední mandlová délka."
        ),
        "status": "potvrzena",
        "pipeline_status": "none",
        "has_design_image": False,
        "calendar_synced": False,
    },
    {
        "id": "demo-nova-002",
        "service_id": "modelaz-nehtu",
        "service_name": "Modeláž nehtů",
        "service_price": "950 Kč",
        "service_duration_min": 120,
        "date": _upcoming_weekday(4),
        "time": "14:00",
        "name": "Karolína M.",
        "phone": "+420 606 987 654",
        "email": None,
        "design_description": None,
        "status": "nova",
        "pipeline_status": "none",
        "has_design_image": False,
        "calendar_synced": False,
    },
    {
        "id": "demo-dokoncena-003",
        "service_id": "nail-art",
        "service_name": "Bespoke Nail Art",
        "service_price": "od 100 Kč",
        "service_duration_min": 30,
        "date": _upcoming_weekday(-6),
        "time": "16:00",
        "name": "Michaela V.",
        "phone": "+420 731 456 789",
        "email": "michaela@example.cz",
        "design_description": (
            "Francouzská ombré náměsíčková manikúra s tenkou zlatou linkou u "
            "kůžičky, oválný tvar, přirozená délka."
        ),
        "design_prompt": (
            "Macro close-up of an elegant female hand with oval natural-length "
            "nails, soft french ombré fading from nude beige to milky white, a "
            "thin gold line near the cuticle, glossy top coat, manicured "
            "cuticles, soft studio lighting, cream neutral background, high "
            "detail, photorealistic."
        ),
        "status": "dokoncena",
        "pipeline_status": "done",
        "has_design_image": False,
        "calendar_synced": False,
    },
]


async def main() -> None:
    from lib.db import db, ensure_indexes

    existing = await db.bookings.count_documents({})
    if existing > 0:
        print(f"Kolekce rezervací už obsahuje {existing} dokumentů — seed přeskočen.")
        return

    for doc in DEMO_BOOKINGS:
        await db.bookings.update_one({"id": doc["id"]}, {"$set": doc}, upsert=True)
    print(f"Vloženo {len(DEMO_BOOKINGS)} demo rezervací.")
    await ensure_indexes()


if __name__ == "__main__":
    asyncio.run(main())
