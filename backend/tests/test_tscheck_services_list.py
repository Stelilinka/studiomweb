"""Backend coverage for: 'Ceník se načítá z /api/services a zobrazuje řádky služeb'."""

EXPECTED_SERVICE_IDS = {
    "klasicka-manikura",
    "gel-lak",
    "modelaz-nehtu",
    "nail-art",
    "pedikura",
}


def test_services_endpoint_returns_seeded_services(client):
    resp = client.get("/services")
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert isinstance(body, list)
    assert len(body) >= 5, f"expected at least 5 services, got {len(body)}"

    ids = {item["id"] for item in body}
    assert EXPECTED_SERVICE_IDS.issubset(ids), f"missing seeded services, got ids={ids}"

    for item in body:
        assert item["name"]
        assert item["description"]
        assert "K" in item["price"]  # "450 Kč" / "od 100 Kč"
        assert isinstance(item["duration_min"], int) and item["duration_min"] > 0
