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
    images: List[str] = []  # Multiple images
    amenities: List[Amenity] = []
    propertyValue: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PropertyCreate(BaseModel):
    name: str
    location: str
    description: str
    bedrooms: int
    badge: str = "Lançamento"
    images: List[str] = []
    amenities: List[Amenity] = []
    propertyValue: str

class Land(BaseModel):
    id: Optional[str] = None
    name: str
    location: str
    description: str
    images: List[str] = []  # Multiple images
    area: str
    price: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LandCreate(BaseModel):
    name: str
    location: str
    description: str
    images: List[str] = []
    area: str
    price: str

class Construction(BaseModel):
    id: Optional[str] = None
    name: str
    location: str
    description: str
    images: List[str] = []  # Multiple images
    landPrice: str  # Valor do terreno
    constructionPrice: str  # Valor da construção
    landArea: str  # Área do terreno
    builtArea: str  # Área construída
    totalPrice: str  # Valor total
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ConstructionCreate(BaseModel):
    name: str
    location: str
    description: str
    images: List[str] = []
    landPrice: str
    constructionPrice: str
    landArea: str
    builtArea: str
    totalPrice: str

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

# Simulation models
class SimulationResult(BaseModel):
    id: Optional[str] = None
    client_name: str
    client_phone: str
    income: str
    income_label: str
    property_value: str
    property_value_label: str
    result_data: dict  # Store the full simulation result
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SimulationCreate(BaseModel):
    client_name: str
    client_phone: str
    income: str
    income_label: str
    property_value: str
    property_value_label: str
    result_data: dict
