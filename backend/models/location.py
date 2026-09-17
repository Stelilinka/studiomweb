"""Provozovny studia a ruční plán týdnů (jedna technička, střídání po týdnech)."""

from typing import Optional

from pydantic import BaseModel


class Location(BaseModel):
    id: str
    name: str
    address: str
    city: str
    maps_query: str


class WeekPlanItem(BaseModel):
    iso_week: str  # např. 2026-W38
    monday: str  # YYYY-MM-DD
    sunday: str  # YYYY-MM-DD
    location_id: Optional[str] = None
    location_name: Optional[str] = None
    is_current: bool = False


class WeekPlanUpdate(BaseModel):
    location_id: str


class CurrentLocation(BaseModel):
    iso_week: str
    monday: str
    sunday: str
    location: Optional[Location] = None
