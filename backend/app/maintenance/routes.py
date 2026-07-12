from fastapi import APIRouter

router = APIRouter(
    prefix="/maintenance",
    tags=["Maintenance"]
)

@router.get("/")
def get_maintenance():
    return {
        "message": "Maintenance working"
    }