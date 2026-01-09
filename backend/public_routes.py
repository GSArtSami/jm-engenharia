from fastapi import APIRouter, Depends, Request
from fastapi.responses import FileResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import PageVisit, AppointmentCreate, SimulationCreate
from datetime import datetime
from pathlib import Path

router = APIRouter(tags=["public"])

# Global db variable to be set by server
db_instance = None

# Upload directory
UPLOAD_DIR = Path("/app/backend/uploads")

# Dependency to get database
def get_db():
    return db_instance

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
