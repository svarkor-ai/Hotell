"""Idempotent demo-room seeding for the Sea View Hotel demo.

The app's ``create_all`` creates empty tables; the demo rooms previously lived
only inside a committed ``.data/hotel.db`` binary, which is not a reliable
source of truth on a fresh deploy. ``seed_rooms`` guarantees the four demo
rooms exist on startup so the site is *shoppable* out of the box, without ever
duplicating rooms (``room_number`` is unique) or clobbering existing rows.

Usage:
    from app.seed import seed_rooms
    seed_rooms(db)   # -> {"added": n, "skipped": m}
"""
from sqlalchemy.orm import Session

from app.models.room import Room

# The four demo rooms that ship with the demo. room_number is the natural,
# unique business key used for idempotency.
SEED_ROOMS = [
    {
        "room_number": "101",
        "room_type": "double",
        "capacity": 2,
        "price_per_night": 1200,
        "sea_view": True,
        "description": "Rymlig dubbel med havsutsikt och balkong.",
    },
    {
        "room_number": "102",
        "room_type": "double",
        "capacity": 2,
        "price_per_night": 1300,
        "sea_view": True,
        "description": "Dubbel med panoramafönster mot havet.",
    },
    {
        "room_number": "201",
        "room_type": "single",
        "capacity": 1,
        "price_per_night": 800,
        "sea_view": True,
        "description": "Kompakt singel som vetter mot trädgården.",
    },
    {
        "room_number": "301",
        "room_type": "four_person",
        "capacity": 4,
        "price_per_night": 2000,
        "sea_view": True,
        "description": "Familjerum med fyra bäddar och havsutsikt.",
    },
]


def seed_rooms(db: Session) -> dict:
    """Idempotently ensure every room in SEED_ROOMS exists.

    Rooms already present (matched by the unique ``room_number``) are skipped
    untouched, so re-running after an edit or a partial seed adds only the
    missing rooms. Returns ``{"added": n, "skipped": m}``.
    """
    added = 0
    skipped = 0
    for spec in SEED_ROOMS:
        existing = (
            db.query(Room)
            .filter(Room.room_number == spec["room_number"])
            .first()
        )
        if existing is not None:
            skipped += 1
            continue
        db.add(Room(**spec))
        added += 1
    db.commit()
    return {"added": added, "skipped": skipped}
