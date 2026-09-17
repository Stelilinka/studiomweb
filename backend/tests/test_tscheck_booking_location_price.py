"""Backend coverage for: 'Rezervace nese provozovnu a její cenu podle plánu týdne'."""

import uuid
from datetime import datetime, timedelta


def _next_open_date_with_slot(client):
    day = datetime.now() + timedelta(days=1)
    for _ in range(21):
        if day.weekday() != 6:  # not Sunday
            date_str = day.strftime("%Y-%m-%d")
            resp = client.get("/availability", params={"date": date_str})
            assert resp.status_code == 200, resp.text
            body = resp.json()
            if not body["closed"]:
                available = [s["time"] for s in body["slots"] if s["available"]]
                if available:
                    return date_str, available[0], body["location_id"], body["location_name"]
        day += timedelta(days=1)
    raise AssertionError("Could not find an open day with a slot in the next 21 days")


def test_booking_carries_location_and_location_price(client):
    date_str, time_str, expected_location_id, expected_location_name = _next_open_date_with_slot(client)
    unique_name = f"tscheck-loc-booking-{uuid.uuid4().hex[:8]}"

    services_resp = client.get("/services", params={"location": expected_location_id})
    assert services_resp.status_code == 200, services_resp.text
    expected_price = next(s["price"] for s in services_resp.json() if s["id"] == "gel-lak")

    payload = {
        "service_id": "gel-lak",
        "date": date_str,
        "time": time_str,
        "name": unique_name,
        "phone": "+420700999888",
    }
    resp = client.post("/bookings", json=payload)
    assert resp.status_code == 200, resp.text
    booking = resp.json()

    assert booking["location_id"] == expected_location_id, booking
    assert booking["location_name"] == expected_location_name, booking
    assert booking["service_price"] == expected_price, booking
