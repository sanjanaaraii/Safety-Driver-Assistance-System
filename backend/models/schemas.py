from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from enum import Enum

# --- Enums ---
class RoleEnum(str, Enum):
    USER = "USER"
    DRIVER = "DRIVER"
    ADMIN = "ADMIN"

class TransmissionEnum(str, Enum):
    MANUAL = "MANUAL"
    AUTOMATIC = "AUTOMATIC"

class TripStatusEnum(str, Enum):
    REQUESTED = "REQUESTED"
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

# --- Users ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: RoleEnum = RoleEnum.USER

class UserCreate(UserBase):
    pass # In Supabase, auth handles passwords, but we create the profile

class UserResponse(UserBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# --- Drivers ---
class DriverBase(BaseModel):
    license_number: str
    license_type: TransmissionEnum
    is_available: bool = True

class DriverCreate(DriverBase):
    pass

class DriverResponse(DriverBase):
    id: UUID
    is_verified: bool
    completed_trips: int
    last_trip_completed_at: Optional[datetime]

    class Config:
        from_attributes = True


# --- Vehicles ---
class VehicleBase(BaseModel):
    model: str
    year: int
    license_plate: str

class VehicleCreate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: UUID
    user_id: UUID
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


# --- Trips ---
class TripBase(BaseModel):
    vehicle_id: UUID
    pickup_location: str
    dropoff_location: str
    notes: Optional[str] = None

class TripCreate(TripBase):
    pass

class TripResponse(TripBase):
    id: UUID
    user_id: UUID
    driver_id: Optional[UUID] = None
    status: TripStatusEnum
    requested_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
