"""Regression tests for MC 1310.1 audit fixes: F8 (past check-in dates).

F8 (LOW, audit 1290.1): the API accepted bookings with a check-in date in the
past (e.g. 2020 -> 200 confirmed). The frontend blocks this, but the API must
enforce it server-side: check_in >= today (local date) and check_out >
check_in, rejected with 422 and a clear Swedish error message.
"""
from datetime import date, timedelta

from fastapi.testclient import TestClient


def _book(client: TestClient, room_id: int = 1, **overrides) -> dict:
    payload = {
        "guest_name": "Test Gast",
        "guest_email": "gast@example.com",
        "guest_phone": "",
        "check_in": "2026-10-01",
        "check_out": "2026-10-03",
    }
    payload.update(overrides)
    return client.post(f"/api/rooms/{room_id}/book", json=payload)


def _today() -> date:
    return date.today()


# --- F8: past check-in must be rejected with 422 -----------------------------

def test_past_check_in_rejected_422(client):
    resp = _book(client, check_in="2020-01-01", check_out="2020-01-03")
    assert resp.status_code == 422
    assert "förfluten" in resp.json()["detail"] or "framtid" in resp.json()["detail"]


def test_yesterday_check_in_rejected_422(client):
    yesterday = (_today() - timedelta(days=1)).isoformat()
    day_after = (_today() + timedelta(days=1)).isoformat()
    resp = _book(client, check_in=yesterday, check_out=day_after)
    assert resp.status_code == 422


def test_today_check_in_accepted(client):
    # Boundary: check_in == today is allowed (check-in day itself is bookable).
    today = _today().isoformat()
    tomorrow = (_today() + timedelta(days=2)).isoformat()
    resp = _book(client, check_in=today, check_out=tomorrow)
    assert resp.status_code == 200
    assert resp.json()["status"] == "confirmed"


def test_future_check_in_still_accepted(client):
    resp = _book(client, check_in="2099-01-01", check_out="2099-01-03")
    assert resp.status_code == 200
    assert resp.json()["total_price"] == 2400


def test_check_out_equal_to_today_with_past_check_in_rejected_422(client):
    # check_out in the past too — the check_in rule fires first.
    resp = _book(client, check_in="2020-01-01", check_out="2020-01-02")
    assert resp.status_code == 422
