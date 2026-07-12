from sqlalchemy.orm import Session
from sqlalchemy import text

def get_summary(db: Session):
    query = text("""
        SELECT 
            (SELECT COUNT(*) FROM assets) as assets_total,
            (SELECT COUNT(*) FROM assets WHERE status = 'available') as assets_available,
            (SELECT COUNT(*) FROM assets WHERE status = 'allocated') as assets_allocated,
            (SELECT COUNT(*) FROM assets WHERE status = 'booked') as assets_booked,
            (SELECT COUNT(*) FROM assets WHERE status = 'under_maintenance') as assets_under_maintenance,
            (SELECT COUNT(*) FROM maintenance_requests WHERE status = 'pending') as pending_maintenance,
            (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed' AND DATE(start_time) = CURRENT_DATE) as active_bookings_today
    """)
    
    result = db.execute(query).fetchone()
    
    return {
        "assets_total": result[0],
        "assets_available": result[1],
        "assets_allocated": result[2],
        "assets_booked": result[3],
        "assets_under_maintenance": result[4],
        "pending_maintenance": result[5],
        "active_bookings_today": result[6]
    }

def get_my_assets(db: Session, user_id: str):
    # Joins Dev 4's tables purely through SQL for read-only return
    query = text("""
        SELECT a.id, a.name, a.status, al.allocated_at 
        FROM allocations al
        JOIN assets a ON al.asset_id = a.id
        WHERE al.user_id = :user_id AND al.status = 'active'
    """)
    result = db.execute(query, {"user_id": user_id}).fetchall()
    
    return [{"id": row[0], "name": row[1], "status": row[2], "allocated_at": row[3]} for row in result]