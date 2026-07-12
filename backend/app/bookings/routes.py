from fastapi import APIRouter

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)


@router.get("/")
def get_bookings():

    return {
        "message": "Bookings endpoint working"
    }


@router.post("/")
def create_booking():

    return {
        "message": "Booking created"
    }