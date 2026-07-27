import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.database import engine, Base
from app.models.room import Room
from app.routers.rooms import router as rooms_router
from app.routers.bookings import router as bookings_router
from app.routers.calendar import router as calendar_router
from app.config import get_settings

settings = get_settings()

# Ensure data directory exists
os.makedirs("data", exist_ok=True)

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME, version="0.1.0")

# Serve static files (CSS, JS, images)
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(rooms_router)
app.include_router(bookings_router)
app.include_router(calendar_router)


@app.get("/health")
def health():
    return {"status": "ok", "app": settings.APP_NAME}


@app.get("/")
def index():
    return FileResponse("templates/index.html")
