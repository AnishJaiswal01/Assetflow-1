from sqlalchemy.orm import Session
from sqlalchemy import text
from app.dashboard import schemas
import uuid
from datetime import date

def get_dashboard_summary(db: Session) -> schemas.DashboardSummary:
    # Use raw SQL to read from tables owned by other developers
    asset_counts_query = text("SELECT status, COUNT(*) FROM assets GROUP BY status")
    assets_raw = db.execute(asset_counts_query).fetchall()
    
    counts = {row[0]: row[1] for row in assets_raw}
    total = sum(counts.values())
    
    pending_maint_query = text("SELECT COUNT(*) FROM maintenance WHERE status = 'pending'")
    pending_maint = db.execute(pending_maint_query).scalar() or 0
    
    today_str = date.today().isoformat()
    active_bookings_query = text(
        "SELECT COUNT(*) FROM bookings WHERE status = 'active' AND start_time <= :today AND end_time >= :today"
    )
    active_bookings = db.execute(active_bookings_query, {"today": today_str}).scalar() or 0
    
    return schemas.DashboardSummary(
        total_assets=total,
        available_assets=counts.get("available", 0),
        allocated_assets=counts.get("allocated", 0),
        booked_assets=counts.get("booked", 0),
        under_maintenance_assets=counts.get("under_maintenance", 0),
        pending_maintenance_requests=pending_maint,
        active_bookings_today=active_bookings
    )

def get_my_assets(db: Session, user_id: uuid.UUID) -> schemas.MyAssetsResponse:
    allocations_query = text(
        """
        SELECT a.id, a.asset_id, ast.name as asset_name, a.allocated_at 
        FROM allocations a 
        JOIN assets ast ON a.asset_id = ast.id 
        WHERE a.user_id = :user_id AND a.status = 'active'
        """
    )
    allocations_raw = db.execute(allocations_query, {"user_id": str(user_id)}).fetchall()
    
    bookings_query = text(
        """
        SELECT b.id, b.asset_id, ast.name as asset_name, b.start_time, b.end_time, b.status 
        FROM bookings b 
        JOIN assets ast ON b.asset_id = ast.id 
        WHERE b.user_id = :user_id AND b.end_time > CURRENT_TIMESTAMP
        ORDER BY b.start_time ASC
        """
    )
    bookings_raw = db.execute(bookings_query, {"user_id": str(user_id)}).fetchall()
    
    allocations = [
        schemas.MyAllocation(
            id=row[0],
            asset_id=row[1],
            asset_name=row[2],
            allocated_at=row[3]
        ) for row in allocations_raw
    ]
    
    bookings = [
        schemas.MyBooking(
            id=row[0],
            asset_id=row[1],
            asset_name=row[2],
            start_time=row[3],
            end_time=row[4],
            status=row[5]
        ) for row in bookings_raw
    ]
    
    return schemas.MyAssetsResponse(
        allocations=allocations,
        upcoming_bookings=bookings
    )