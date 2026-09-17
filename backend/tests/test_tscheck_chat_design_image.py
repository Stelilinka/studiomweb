"""Backend coverage for: 'Klára v chatu automaticky vygeneruje a zobrazí návrh nehtů'.

POST /api/chat with a design-request message should return a non-empty image_url.
Generation is synchronous and can take 20-40s (documented spec deviation) — this
test allows up to 90s.
"""


def test_chat_design_request_returns_image_url(client):
    resp = client.post(
        "/chat",
        json={"message": "Vygeneruj mi návrh: mandlový tvar, pudrová růžová s perletí"},
        timeout=90.0,
    )
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["reply"], "empty reply"
    assert body.get("image_url"), (
        f"expected non-empty image_url in chat reply, got {body.get('image_url')!r}; "
        f"reply={body['reply']!r}"
    )
