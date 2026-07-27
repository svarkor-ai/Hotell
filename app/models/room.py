from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String(10), unique=True, index=True, nullable=False)
    room_type = Column(String(20), nullable=False)  # single, double, four_person
    capacity = Column(Integer, nullable=False)
    price_per_night = Column(Integer, nullable=False)  # in SEK
    sea_view = Column(Boolean, default=True)
    description = Column(String(500), default="")

    def __repr__(self):
        return f"<Room {self.room_number} ({self.room_type})>"
