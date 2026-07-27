from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from app.database import get_db
from app.models.booking import Booking
from app.models.room import Room
from pydantic import BaseModel
from datetime import date, timedelta

router = APIRouter(prefix="/api/calendar", tags=["calendar"])


class DaySlot(BaseModel):
    date: str
    room_id: int
    room_number: str
    available: bool
    booking_id: Optional[int] = None


class CalendarResponse(BaseModel):
    month: str
    days: List[Dict]


@router.get("/{year}/{month}/rooms/{room_id}")
def room_calendar(
    year: int, month: int, room_id: int,
    db: Session = Depends(get_db)
):
    from datetime import datetime
    start = date(year, month, 1)
    if month == 12:
        end = date(year + 1, 1, 1)
    else:
        end = date(year, month + 1, 1)

    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        from fastapi import HTTPException
        raise HTTPException(404, "Room not found")

    bookings = db.query(Booking).filter(
        Booking.room_id == room_id,
        Booking.status == "confirmed",
        Booking.check_out > start,
        Booking.check_in < end
    ).all()

    days = []
    current = start
    while current < end:
        for b in bookings:
            if b.check_in <= current < b.check_out:
                days.append({
                    "date": current.isoformat(),
                    "room_id": room_id,
                    "room_number": room.room_number,
                    "available": False,
                    "booking_id": b.id,
                })
                break
        else:
            days.append({
                "date": current.isoformat(),
                "room_id": room_id,
                "room_number": room.room_number,
                "available": True,
                "booking_id": None,
            })
        current += timedelta(days=1)

    return {
        "month": start.strftime("%Y-%m"),
        "room": f"{room.room_number} ({room.room_type})",
        "days": days,
    }


@router.get("/{year}/{month}")
def month_calendar(
    year: int, month: int,
    db: Session = Depends(get_db)
):
    from datetime import datetime
    start = date(year, month, 1)
    if month == 12:
        end = date(year + 1, 1, 1)
    else:
        end = date(year, month + 1, 1)

    rooms = db.query(Room).all()
    bookings = db.query(Booking).filter(
        Booking.status == "confirmed",
        Booking.check_out > start,
        Booking.check_in < end
    ).all()

    result = []
    current = start
    while current < end:
        day_entry = {"date": current.isoformat()}
        for room in rooms:
            booked = False
            booking_id = None
            for b in bookings:
                if b.room_id == room.id and b.check_in <= current < b.check_out:
                    booked = True
                    booking_id = b.id
                    break
            day_entry[f"room_{room.id}"] = {
                "room_number": room.room_number,
                "available": not booked,
                "booking_id": booking_id,
            }
        result.append(day_entry)
        current += timedelta(days=1)

    return {
        "month": start.strftime("%Y-%m"),
        "days": result,
    }
