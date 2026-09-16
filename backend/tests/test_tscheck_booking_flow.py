"""Backend coverage for: 'Rezervace end-to-end přes průvodce' (booking creation flow)."""

import uuid
from datetime import datetime, timedelta


def _next_open_date_with_slot(client):
    """Find the next non-Sunday day (skipping today) that has an available slot."""
    day = datetime.now() + timedelta(days=1)
    for _ in range(14):
        if day.weekday() != 6:  # not Sunday
            date_str = day.strftime("%Y-%m-%d")
            resp = client.get("/availability", params={"date": date_str})
            assert resp.status_code == 200, resp.text
            body = resp.json()
            if not body["closed"]:
                available = [s["time"] for s in body["slots"] if s["available"]]
                if available:
                    return date_str, available[0]
        day += timedelta(days=1)
    raise AssertionError("Could not find an open day with an available slot in the next 14 days")


def test_availability_closed_on_sunday(client):
    day = datetime.now() + timedelta(days=1)
    while day.weekday() != 6:
        day += timedelta(days=1)
    resp = client.get("/availability", params={"date": day.strftime("%Y-%m-%d")})
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["closed"] is True
    assert all(not s["available"] for s in body["slots"])


def test_create_booking_end_to_end(client):
    date_str, time_str = _next_open_date_with_slot(client)
    unique_name = f"tscheck-booking-{uuid.uuid4().hex[:8]}"

    payload = {
        "service_id": "gel-lak",
        "date": date_str,
        "time": time_str,
        "name": unique_name,
        "phone": "+420700123456",
    }
    resp = client.post("/bookings", json=payload)
    assert resp.status_code == 200, resp.text
    booking = resp.json()
    assert booking["name"] == unique_name
    assert booking["date"] == date_str
    assert booking["time"] == time_str
    assert booking["service_id"] == "gel-lak"
    assert booking["status"] == "nova"
    # Google Calendar is not connected in this environment (expected deviation).
    assert booking["calendar_synced"] is False

    # Fetch it back by id — confirms it was actually persisted, not just echoed.
    get_resp = client.get(f"/bookings/{booking['id']}")
    assert get_resp.status_code == 200, get_resp.text
    assert get_resp.json()["name"] == unique_name

    # A second booking for the exact same slot must be rejected (double-booking guard).
    clash_resp = client.post("/bookings", json=payload)
    assert clash_resp.status_code == 409, clash_resp.text
