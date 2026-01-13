from fastapi import APIRouter, Depends, Request
from fastapi.responses import FileResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import PageVisit, AppointmentCreate, SimulationCreate
from datetime import datetime
from pathlib import Path
from bson import ObjectId

router = APIRouter(tags=["public"])

# Global db variable to be set by server
db_instance = None

# Upload directory - use relative path from this file's location
UPLOAD_DIR = Path(__file__).resolve().parent / "uploads"

# Dependency to get database
def get_db():
    return db_instance

# Public properties routes
@router.get("/properties")
async def get_public_properties(bedrooms: int = None, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all properties for public viewing, optionally filtered by bedrooms"""
    query = {}
    if bedrooms:
        query["bedrooms"] = bedrooms
    
    properties = await db.properties.find(query).to_list(1000)
    for prop in properties:
        prop["id"] = str(prop.pop("_id"))
    return properties

@router.get("/properties/{property_id}")
async def get_property_by_id(property_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get a single property by ID"""
    from fastapi import HTTPException
    try:
        prop = await db.properties.find_one({"_id": ObjectId(property_id)})
        if prop:
            prop["id"] = str(prop.pop("_id"))
            return prop
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")
    except Exception as e:
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")

@router.get("/lands")
async def get_public_lands(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all lands for public viewing"""
    lands = await db.lands.find().to_list(1000)
    for land in lands:
        land["id"] = str(land.pop("_id"))
    return lands

@router.get("/lands/{land_id}")
async def get_land_by_id(land_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get a single land by ID"""
    from fastapi import HTTPException
    try:
        land = await db.lands.find_one({"_id": ObjectId(land_id)})
        if land:
            land["id"] = str(land.pop("_id"))
            return land
        raise HTTPException(status_code=404, detail="Terreno não encontrado")
    except Exception as e:
        raise HTTPException(status_code=404, detail="Terreno não encontrado")

@router.get("/constructions")
async def get_public_constructions(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all constructions for public viewing"""
    constructions = await db.constructions.find().to_list(1000)
    for construction in constructions:
        construction["id"] = str(construction.pop("_id"))
    return constructions

@router.get("/constructions/{construction_id}")
async def get_construction_by_id(construction_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get a single construction by ID"""
    from fastapi import HTTPException
    try:
        construction = await db.constructions.find_one({"_id": ObjectId(construction_id)})
        if construction:
            construction["id"] = str(construction.pop("_id"))
            return construction
        raise HTTPException(status_code=404, detail="Construção não encontrada")
    except Exception as e:
        raise HTTPException(status_code=404, detail="Construção não encontrada")

@router.post("/track-visit")
async def track_page_visit(
    request: Request,
    page: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Track a page visit"""
    visit = {
        "page": page,
        "user_ip": request.client.host,
        "user_agent": request.headers.get("user-agent", "unknown"),
        "timestamp": datetime.utcnow()
    }
    
    await db.page_visits.insert_one(visit)
    return {"success": True}

# Serve uploaded files
@router.get("/uploads/{filename}")
async def get_uploaded_file(filename: str):
    """Serve uploaded images"""
    filepath = UPLOAD_DIR / filename
    if not filepath.exists():
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")
    return FileResponse(filepath)

# Save simulation
@router.post("/simulations")
async def save_simulation(
    simulation: SimulationCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Save a client simulation result"""
    sim_dict = simulation.model_dump()
    sim_dict["created_at"] = datetime.utcnow()
    
    result = await db.simulations.insert_one(sim_dict)
    return {"success": True, "id": str(result.inserted_id)}

@router.post("/appointments")
async def create_appointment(
    appointment: AppointmentCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new appointment request"""
    appointment_dict = appointment.model_dump()
    appointment_dict["status"] = "pending"
    appointment_dict["created_at"] = datetime.utcnow()
    
    result = await db.appointments.insert_one(appointment_dict)
    appointment_dict["id"] = str(result.inserted_id)
    # Remove MongoDB's _id field if it exists
    appointment_dict.pop("_id", None)
    # Convert datetime to ISO string for JSON serialization
    appointment_dict["created_at"] = appointment_dict["created_at"].isoformat()
    
    return {"success": True, "appointment": appointment_dict}

@router.get("/appointments/available-slots")
async def get_available_slots():
    """Get available appointment slots (for now, return some example slots)"""
    # This is a simplified version - you can enhance it to check actual availability
    from datetime import datetime, timedelta
    
    slots = []
    start_date = datetime.now()
    
    # Generate next 14 days of slots
    for i in range(14):
        date = start_date + timedelta(days=i)
        if date.weekday() < 5:  # Monday to Friday
            slots.append({
                "date": date.strftime("%Y-%m-%d"),
                "times": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
            })
    
    return slots

@router.get("/unavailable-dates")
async def get_unavailable_dates(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get list of unavailable dates marked by admin"""
    dates = await db.unavailable_dates.find({}, {"_id": 0}).to_list(1000)
    return [date["date"] for date in dates]
