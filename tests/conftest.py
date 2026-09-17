"""Shared fixtures for the Hotell API tests.

Extracted from tests/test_rooms_api.py (MC 1286.1): the file-backed SQLite
+ TestClient fixture pattern is reused by every test module, so it lives here.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
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
    # Bypass the DemoWriteGuard rate limiter (MC 2034.2): these tests make many
    # back-to-back writes from one "visitor" and target booking logic, not the
    # limiter. Removing the middleware is the cleanest way to disable it.
    from app.demo_guard import DemoWriteGuard
    app.user_middleware[:] = [
        m for m in app.user_middleware if m.cls is not DemoWriteGuard
    ]
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
    engine.dispose()
