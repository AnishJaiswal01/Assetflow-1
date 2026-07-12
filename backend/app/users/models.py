from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True) # References auth.users(id) via DB
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(ENUM('admin', 'asset_manager', 'department_head', 'employee', name='user_role', create_type=False), nullable=False, default='employee')
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    department = relationship("Department", back_populates="users", foreign_keys=[department_id])