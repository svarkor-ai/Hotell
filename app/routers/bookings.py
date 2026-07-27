from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.booking import Booking
from pydantic import BaseModel
from datetime import date, datetime

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


class BookingOut(BaseModel):
    id: int
    guest_name: str
    guest_email: str
    room_id: int
    check_in: str
    check_out: str
    total_price: int
    status: str


class BookingCreate(BaseModel):
    guest_name: str
    guest_email: str
    check_in: str
    check_out: str
    rooms: List[int]


def _to_dict(booking: Booking) -> dict:
    return {
        "id": booking.id,
        "guest_name": booking.guest_name,
        "guest_email": booking.guest_email,
        "room_id": booking.room_id,
        "check_in": booking.check_in.isoformat() if isinstance(booking.check_in, date) else booking.check_in,
        "check_out": booking.check_out.isoformat() if isinstance(booking.check_out, date) else booking.check_out,
        "total_price": booking.total_price,
        "status": booking.status,
    }


@router.get("/", response_model=List[BookingOut])
def list_bookings(
    status: Optional[str] = Query(None),
    room_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Booking)
    if status:
        q = q.filter(Booking.status == status)
    if room_id:
        q = q.filter(Booking.room_id == room_id)
    return [_to_dict(b) for b in q.order_by(Booking.check_in.desc()).all()]


@router.get("/{booking_id}", response_model=BookingOut)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(404, "Booking not found")
    return _to_dict(booking)


@router.put("/{booking_id}/cancel")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(404, "Booking not found")
    booking.status = "cancelled"
    db.commit()
    return {"status": "cancelled"}
