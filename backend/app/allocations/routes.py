from fastapi import APIRouter

router = APIRouter(
    prefix="/allocations",
    tags=["Allocations"]
)

@router.get("/")
def get_allocations():
    return {
        "message": "Allocations working"
    }