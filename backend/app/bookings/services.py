from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException


def create_booking(db, booking):

    try:
        db.add(booking)
        db.commit()
        db.refresh(booking)

        return booking

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=409,
            detail="Booking overlap detected"
        )