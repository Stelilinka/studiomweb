"""Ceník studia — jediný zdroj pravdy pro služby."""

from fastapi import APIRouter

from models.booking import Service

router = APIRouter(tags=["services"])

SERVICES: list[Service] = [
    Service(
        id="klasicka-manikura",
        name="Klasická manikúra",
        price="450 Kč",
        duration_min=45,
        tag="Základní péče",
        description="Kompletní ošetření nehtové kůžičky, zapilování do tvaru, vyživující lázeň a záverečný regenerační olejíček.",
    ),
    Service(
        id="gel-lak",
        name="Gel lak",
        price="650 Kč",
        duration_min=60,
        tag="Nejpopulárnější",
        description="Profesionální aplikace vysoce odolného šetrného gel laku s výdrží 3–4 týdny a zrcadlovým leskem.",
    ),
    Service(
        id="modelaz-nehtu",
        name="Modeláž nehtů",
        price="950 Kč",
        duration_min=120,
        tag="Prodloužení & zpevnění",
        description="Prodloužení na šablonky prémiovým polygelem s precizním modelováním C-oblouku a maximální pevností.",
    ),
    Service(
        id="nail-art",
        name="Bespoke Nail Art",
        price="od 100 Kč",
        duration_min=30,
        tag="Umělecký detail",
        description="Ručně malované motivy, chromové pigmenty, minimalistické linky, ombré přechody a kamínky Swarovski.",
    ),
    Service(
        id="pedikura",
        name="Spa Pedikúra",
        price="750 Kč",
        duration_min=60,
        tag="Relaxace",
        description="Komplexní přístrojová i mokrá pedikúra, peeling s himálajskou solí, úprava nehtů a uvolňující masáž chodidel.",
    ),
]

SERVICES_BY_ID: dict[str, Service] = {s.id: s for s in SERVICES}


@router.get("/services", response_model=list[Service])
async def list_services() -> list[Service]:
    return SERVICES
