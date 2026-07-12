from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.db.session import Base


class Asset(Base):
    __tablename__ = "assets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    name = Column(String, nullable=False)

    category_id = Column(
        UUID(as_uuid=True),
        ForeignKey("asset_categories.id"),
        nullable=False
    )

    status = Column(String, default="available")

    notes = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )