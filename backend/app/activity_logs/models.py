from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Text,
    DateTime,
    ForeignKey
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.session import Base


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(BigInteger, primary_key=True)

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id")
    )

    action = Column(String, nullable=False)

    entity_name = Column(String)

    entity_id = Column(BigInteger)

    details = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )