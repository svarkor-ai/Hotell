from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.room import Room
from app.models.booking import Booking
from pydantic import BaseModel
from datetime import date, datetime

router = APIRouter(prefix="/api/rooms", tags=["rooms"])


class RoomCreate(BaseModel):
    room_number: str
    room_type: str
    capacity: int
    price_per_night: int
    sea_view: bool = True
    description: str = ""


class RoomOut(BaseModel):
    id: int
    room_number: str
    room_type: str
    capacity: int
    price_per_night: int
    sea_view: bool
    description: str

    class Config:
        from_attributes = True


class BookingRequest(BaseModel):
    guest_name: str
    guest_email: str
    guest_phone: str = ""
    check_in: str  # YYYY-MM-DD
    check_out: str  # YYYY-MM-DD


class BookingOut(BaseModel):
    id: int
    guest_name: str
    guest_email: str
    room_id: int
    check_in: str
    check_out: str
    total_price: int
    status: str


def _booking_to_dict(booking: Booking) -> dict:
    ci = booking.check_in.isoformat() if isinstance(booking.check_in, date) else booking.check_in
    co = booking.check_out.isoformat() if isinstance(booking.check_out, date) else booking.check_out
    return {
        "id": booking.id,
        "guest_name": booking.guest_name,
        "guest_email": booking.guest_email,
        "room_id": booking.room_id,
        "check_in": ci,
        "check_out": co,
        "total_price": booking.total_price,
        "status": booking.status,
    }


@router.get("/", response_model=List[RoomOut])
def list_rooms(db: Session = Depends(get_db), sea_view_only: bool = False):
    q = db.query(Room)
    if sea_view_only:
        q = q.filter(Room.sea_view == True)
    return q.all()


@router.post("/", status_code=201)
def create_room(room: RoomCreate, db: Session = Depends(get_db)):
    existing = db.query(Room).filter(Room.room_number == room.room_number).first()
    if existing:
        raise HTTPException(400, f"Room {room.room_number} already exists")
    db_room = Room(**room.model_dump())
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room


@router.post("/{room_id}/book", response_model=BookingOut)
def book_room(room_id: int, booking: BookingRequest, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(404, "Room not found")

    ci = datetime.strptime(booking.check_in, "%Y-%m-%d").date()
    co = datetime.strptime(booking.check_out, "%Y-%m-%d").date()

    overlaps = db.query(Booking).filter(
        Booking.room_id == room_id,
        Booking.status == "confirmed",
        Booking.check_out > ci,
        Booking.check_in < co
    ).first()

    if overlaps:
        raise HTTPException(400, "Room not available for these dates")

    nights = (co - ci).days
    total = nights * room.price_per_night

    db_booking = Booking(
        guest_name=booking.guest_name,
        guest_email=booking.guest_email,
        guest_phone=booking.guest_phone,
        room_id=room_id,
        check_in=ci,
        check_out=co,
        total_price=total,
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return _booking_to_dict(db_booking)
