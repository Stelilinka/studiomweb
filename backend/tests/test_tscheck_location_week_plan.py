"""Backend coverage for: 'Plán týdnů v administraci je ručně editovatelný'."""

import re

ISO_WEEK_RE = re.compile(r"^\d{4}-W\d{2}$")


def test_week_plan_has_12_rows_with_location(client):
    resp = client.get("/location-weeks", params={"weeks": 12})
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert len(body) == 12, f"expected 12 rows, got {len(body)}"
    for row in body:
        assert ISO_WEEK_RE.match(row["iso_week"])
        assert row["location_id"] in {"krasna-lipa", "neratovice", None}


def test_put_location_week_updates_and_persists(client):
    # Pick a far-future week unlikely to collide with seeded seed data assertions.
    target_week = "2026-W49"

    resp = client.put(f"/location-weeks/{target_week}", json={"location_id": "neratovice"})
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["location_id"] == "neratovice"
    assert body["iso_week"] == target_week

    # Refetch full plan and confirm persisted value shows up.
    plan_resp = client.get("/location-weeks", params={"weeks": 20})
    assert plan_resp.status_code == 200, plan_resp.text
    row = next((r for r in plan_resp.json() if r["iso_week"] == target_week), None)
    assert row is not None, f"{target_week} not found in refetched plan"
    assert row["location_id"] == "neratovice"

    # Set it back to krasna-lipa (restore original seed alternation) to avoid residue.
    restore = client.put(f"/location-weeks/{target_week}", json={"location_id": "krasna-lipa"})
    assert restore.status_code == 200, restore.text


def test_put_location_week_rejects_unknown_location(client):
    resp = client.put("/location-weeks/2026-W49", json={"location_id": "tscheck-nowhere"})
    assert resp.status_code == 400, resp.text
