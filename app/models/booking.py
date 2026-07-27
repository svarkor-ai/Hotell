from sqlalchemy import Column, Integer, String, Date, ForeignKey, Boolean
from app.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    guest_name = Column(String(100), nullable=False)
    guest_email = Column(String(100), nullable=False)
    guest_phone = Column(String(20), default="")
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    check_in = Column(Date, nullable=False)
    check_out = Column(Date, nullable=False)
    total_price = Column(Integer, default=0)  # in SEK
    status = Column(String(20), default="confirmed")  # confirmed, cancelled, completed

    def __repr__(self):
        return f"<Booking #{self.id} Room {self.room_id}>"
