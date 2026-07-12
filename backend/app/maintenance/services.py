from app.maintenance.models import MaintenanceRequest

TEST_USER_ID = "c7a9edd0-079b-4d2e-9595-5ccdb69b5243"


def create_maintenance_request(db, data):

    request = MaintenanceRequest(
        asset_id=data.asset_id,
        reported_by=TEST_USER_ID,
        issue_description=data.issue_description,
        priority=data.priority,
        status="pending"
    )

    db.add(request)

    db.commit()

    db.refresh(request)

    return request