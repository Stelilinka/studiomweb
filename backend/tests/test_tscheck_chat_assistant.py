"""Backend coverage for: 'Chat asistentka Klára odpovídá' — POST /api/chat."""


def test_chat_returns_price_answer(client):
    resp = client.post("/chat", json={"message": "Kolik stoji gel lak?"})
    assert resp.status_code == 200, resp.text
    body = resp.json()

    assert isinstance(body.get("reply"), str)
    assert body["reply"].strip() != ""
    assert "session_id" in body and body["session_id"]
    # Reply should reference the currency to be a real price answer.
    assert "k" in body["reply"].lower() and ("č" in body["reply"].lower())


def test_chat_history_is_retrievable(client):
    first = client.post("/chat", json={"message": "Jake mate otevirci hodiny?"})
    assert first.status_code == 200, first.text
    session_id = first.json()["session_id"]

    history_resp = client.get(f"/chat/{session_id}")
    assert history_resp.status_code == 200, history_resp.text
    history = history_resp.json()
    assert len(history.get("turns", [])) >= 2
