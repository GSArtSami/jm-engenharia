from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Amenity(BaseModel):
    name: str
    icon: str

class Property(BaseModel):
    id: Optional[str] = None
    name: str
    location: str
    description: str
    bedrooms: int
    badge: str = "Lançamento"
    image: str
    amenities: List[Amenity]
    propertyValue: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PropertyCreate(BaseModel):
    name: str
    location: str
    description: str
    bedrooms: int
    badge: str = "Lançamento"
    image: str
    amenities: List[Amenity]
    propertyValue: str

class Land(BaseModel):
    id: Optional[str] = None
    name: str
    location: str
    description: str
    image: str
    area: str
    price: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LandCreate(BaseModel):
    name: str
    location: str
    description: str
    image: str
    area: str
    price: str

class Construction(BaseModel):
    id: Optional[str] = None
    name: str
    location: str
    description: str
    image: str
    price: str
    features: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ConstructionCreate(BaseModel):
    name: str
    location: str
    description: str
    image: str
    price: str
    features: List[str]

class AdminLogin(BaseModel):
    password: str

class PageVisit(BaseModel):
    id: Optional[str] = None
    page: str
    user_ip: str
    user_agent: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Appointment(BaseModel):
    id: Optional[str] = None
    name: str
    email: str
    phone: str
    preferred_date: str
    preferred_time: str
    message: Optional[str] = None
    status: str = "pending"  # pending, confirmed, cancelled
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AppointmentCreate(BaseModel):
    name: str
    email: str
    phone: str
    preferred_date: str
    preferred_time: str
    message: Optional[str] = None
