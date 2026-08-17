"""Tests for app/seed.py -- idempotent demo-room seeding.

The Hotell demo must come up *shoppable* on a fresh deploy even when the
committed demo DB is absent or empty. seed_rooms() guarantees the four demo
rooms exist, and is *idempotent*: running it any number of times must never
create duplicate rooms (room_number is unique) nor clobber existing ones.
"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.models.room import Room
from app.models.booking import Booking
from app.seed import seed_rooms, SEED_ROOMS


@pytest.fixture()
def db():
    # In-memory SQLite bound to the app's own Base/models.
    engine = create_engine("sqlite://")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        yield session
    finally:
        session.close()
        engine.dispose()


def test_seed_populates_all_four_demo_rooms(db):
    result = seed_rooms(db)
    assert db.query(Room).count() == 4
    assert result["added"] == 4
    assert result["skipped"] == 0


def test_seed_is_idempotent_on_second_run(db):
    seed_rooms(db)
    result = seed_rooms(db)
    assert db.query(Room).count() == 4, "second run must not duplicate rooms"
    assert result["added"] == 0
    assert result["skipped"] == 4


def test_seed_does_not_clobber_existing_room_data(db):
    seed_rooms(db)
    room = db.query(Room).filter(Room.room_number == "101").one()
    room.description = "user-edited description"
    db.commit()
    # Re-seeding must not overwrite the edited field.
    result = seed_rooms(db)
    refreshed = db.query(Room).filter(Room.room_number == "101").one()
    assert refreshed.description == "user-edited description"
    assert result["added"] == 0
    assert result["skipped"] == 4


def test_seed_handles_partially_seeded_db(db):
    # Pre-insert only two rooms, then seed -- the other two must be added.
    for spec in [SEED_ROOMS[0], SEED_ROOMS[1]]:
        db.add(Room(**spec))
    db.commit()
    result = seed_rooms(db)
    assert db.query(Room).count() == 4
    assert result["added"] == 2
    assert result["skipped"] == 2


def test_seed_room_numbers_are_unique_across_runs(db):
    seed_rooms(db)
    seed_rooms(db)
    seed_rooms(db)
    numbers = [r.room_number for r in db.query(Room).all()]
    assert len(numbers) == len(set(numbers)) == 4
