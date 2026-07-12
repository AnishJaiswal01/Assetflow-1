from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.bookings.models import Booking

from app.db.session import get_db
from app.bookings.schemas import BookingCreate
from app.bookings.services import create_booking

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)

@router.get("/")
def get_bookings(db: Session = Depends(get_db)):
    return db.query(Booking).all()


@router.post("/")
def create_new_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db)
):
    return create_booking(db, booking)