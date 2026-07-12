from enum import Enum


class NotificationType(str, Enum):
    BOOKING = "booking"
    ALLOCATION = "allocation"
    MAINTENANCE = "maintenance"
    GENERAL = "general"