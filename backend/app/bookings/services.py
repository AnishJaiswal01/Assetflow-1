from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from app.bookings.models import Booking


def create_booking(db, booking_data):

    booking = Booking(
        asset_id=booking_data.asset_id,
        booking_date=booking_data.booking_date,
        start_time=booking_data.start_time,
        end_time=booking_data.end_time,
        purpose=booking_data.purpose,

        # temporary values until auth is ready
        user_id="1"
    )

    try:

        db.add(booking)

        db.commit()

        db.refresh(booking)

        return booking

    except IntegrityError as e:

        db.rollback()

        raise HTTPException(
            status_code=409,
            detail=str(e.orig)
        )