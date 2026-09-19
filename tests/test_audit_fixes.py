"""Regression tests for the MC 1290.2 audit fixes (findings F1, F3, F5, F7).

F2 (stored XSS) is a frontend render-time fix in static/js — covered by the
manual/spot verification noted in the evidence file, not by the pytest suite.
F4 (test-order dependency) is covered by running the suite in both orders.
"""
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


# --- F3: calendar must 400 (not 500) on invalid year/month -------------------

def test_calendar_invalid_month_400_not_500(client):
    resp = client.get("/api/calendar/2027/13")
    assert resp.status_code == 400
    assert "Månad" in resp.json()["detail"]


def test_calendar_month_zero_400(client):
    assert client.get("/api/calendar/2027/0").status_code == 400


def test_calendar_negative_month_400(client):
    assert client.get("/api/calendar/-1/5").status_code == 400


def test_calendar_absurd_year_400_not_500(client):
    assert client.get("/api/calendar/100000/5").status_code == 400


def test_calendar_year_zero_400(client):
    assert client.get("/api/calendar/0/5").status_code == 400


def test_calendar_room_endpoint_invalid_month_400(client):
    resp = client.get("/api/calendar/2027/13/rooms/1")
    assert resp.status_code == 400


def test_calendar_valid_month_still_works(client):
    resp = client.get("/api/calendar/2027/10")
    assert resp.status_code == 200
    assert resp.json()["month"] == "2027-10"


# --- F5: server-side validation ----------------------------------------------

def test_booking_empty_guest_name_rejected_400(client):
    resp = _book(client, guest_name="")
    assert resp.status_code == 400


def test_booking_whitespace_guest_name_rejected_400(client):
    resp = _book(client, guest_name="   ")
    assert resp.status_code == 400


def test_booking_invalid_email_rejected_400(client):
    resp = _book(client, guest_email="not-an-email")
    assert resp.status_code == 400


def test_booking_valid_guest_still_accepted(client):
    resp = _book(client)
    assert resp.status_code == 200


def test_create_room_negative_price_rejected_400(client):
    payload = {
        "room_number": "999",
        "room_type": "double",
        "capacity": 2,
        "price_per_night": -500,
    }
    resp = client.post("/api/rooms/", json=payload)
    assert resp.status_code == 400
    assert "positivt" in resp.json()["detail"]


def test_create_room_zero_price_rejected_400(client):
    payload = {
        "room_number": "998",
        "room_type": "double",
        "capacity": 2,
        "price_per_night": 0,
    }
    assert client.post("/api/rooms/", json=payload).status_code == 400


def test_create_room_zero_capacity_rejected_400(client):
    payload = {
        "room_number": "997",
        "room_type": "double",
        "capacity": 0,
        "price_per_night": 1000,
    }
    assert client.post("/api/rooms/", json=payload).status_code == 400


def test_create_room_empty_room_number_rejected_400(client):
    payload = {
        "room_number": "",
        "room_type": "double",
        "capacity": 2,
        "price_per_night": 1000,
    }
    assert client.post("/api/rooms/", json=payload).status_code == 400


def test_create_room_valid_still_accepted(client):
    payload = {
        "room_number": "996",
        "room_type": "double",
        "capacity": 2,
        "price_per_night": 1000,
    }
    resp = client.post("/api/rooms/", json=payload)
    assert resp.status_code == 201
    assert resp.json()["room_number"] == "996"


# --- F7: falsy filter values must apply, not be skipped ----------------------

def test_list_bookings_room_id_zero_filters_not_returns_all(client):
    # F7: ?room_id=0 used to return ALL bookings (truthiness skipped filter).
    assert _book(client, room_id=1).status_code == 200
    resp = client.get("/api/bookings/", params={"room_id": 0})
    assert resp.status_code == 200
    assert resp.json() == []


def test_list_bookings_room_id_filter_matches(client):
    assert _book(client, room_id=1).status_code == 200
    resp = client.get("/api/bookings/", params={"room_id": 1})
    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_list_bookings_status_filter_applies(client):
    booking_id = _book(client).json()["id"]
    client.put(f"/api/bookings/{booking_id}/cancel")
    resp = client.get("/api/bookings/", params={"status": "confirmed"})
    assert resp.status_code == 200
    assert resp.json() == []
    resp = client.get("/api/bookings/", params={"status": "cancelled"})
    assert len(resp.json()) == 1
