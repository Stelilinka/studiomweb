"""Backend coverage for: 'Nový ceník podle provozovny'."""

EXPECTED_IDS = {"manikura", "gel-lak", "modelaz-nova", "modelaz-doplneni", "pedikura"}

KRASNA_LIPA_PRICES = {
    "manikura": "380 Kč",
    "gel-lak": "480 Kč",
    "modelaz-nova": "650 Kč",
    "modelaz-doplneni": "530 Kč",
    "pedikura": "380 Kč",
}

NERATOVICE_PRICES = {
    "manikura": "380 Kč",
    "gel-lak": "580 Kč",
    "modelaz-nova": "900 Kč",
    "modelaz-doplneni": "780 Kč",
    "pedikura": "380 Kč",
}


def test_services_default_prices_krasna_lipa(client):
    resp = client.get("/services")
    assert resp.status_code == 200, resp.text
    body = resp.json()
    ids = {item["id"] for item in body}
    assert EXPECTED_IDS.issubset(ids)
    by_id = {item["id"]: item for item in body}
    for sid, expected_price in KRASNA_LIPA_PRICES.items():
        assert by_id[sid]["price"] == expected_price, f"{sid}: {by_id[sid]['price']}"


def test_services_neratovice_prices(client):
    resp = client.get("/services", params={"location": "neratovice"})
    assert resp.status_code == 200, resp.text
    by_id = {item["id"]: item for item in resp.json()}
    for sid, expected_price in NERATOVICE_PRICES.items():
        assert by_id[sid]["price"] == expected_price, f"{sid}: {by_id[sid]['price']}"


def test_services_unknown_location_returns_400(client):
    resp = client.get("/services", params={"location": "tscheck-unknown-location"})
    assert resp.status_code == 400, resp.text
