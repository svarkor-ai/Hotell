"""Tests for the rooms API endpoints (app/routers/rooms.py).

Covers the single-room GET endpoint that the booking flow depends on:
GET /api/rooms/{id}/ must return the room (RoomOut) for a valid id and
404 for an unknown id. Without it the frontend booking modal falls back
to a fetch that 404s and renders "Boka Rum undefined" (MC 902.1).
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.models.room import Room
from app.seed import seed_rooms
from app.main import app


@pytest.fixture()
def client(tmp_path):
    # File-backed SQLite (in-memory would be a fresh empty DB per connection).
    engine = create_engine(
        f"sqlite:///{tmp_path}/test_hotell.db",
        connect_args={"check_same_thread": False},
    )
    Base.metadata.create_all(bind=engine)
    TestingSession = sessionmaker(bind=engine)
    session = TestingSession()
    seed_rooms(session)
    session.close()

    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
    engine.dispose()


def test_get_room_returns_room_for_valid_id(client):
    # Room 1 is the first seeded demo room (room_number "101").
    resp = client.get("/api/rooms/1/")
    assert resp.status_code == 200
    body = resp.json()
    assert body["id"] == 1
    assert body["room_number"] == "101"
    assert body["price_per_night"] > 0


def test_get_room_returns_404_for_unknown_id(client):
    resp = client.get("/api/rooms/9999/")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Room not found"
