from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    Enum
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.session import Base
from app.notifications.enums import NotificationType


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(BigInteger, primary_key=True)

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id"),
        nullable=False
    )

    title = Column(String, nullable=False)

    message = Column(Text, nullable=False)

    type = Column(
        Enum(
            NotificationType,
            values_callable=lambda x: [e.value for e in x],
            name="notification_type"
        )
    )

    is_read = Column(Boolean, default=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )