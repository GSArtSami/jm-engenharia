from fastapi import APIRouter, Depends, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import PageVisit, AppointmentCreate
from datetime import datetime

router = APIRouter(tags=["public"])

# Dependency to get database
def get_db():
    from server import db
    return db

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

@router.post("/appointments")
async def create_appointment(
    appointment: AppointmentCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new appointment request"""
    appointment_dict = appointment.dict()
    appointment_dict["status"] = "pending"
    appointment_dict["created_at"] = datetime.utcnow()
    
    result = await db.appointments.insert_one(appointment_dict)
    appointment_dict["id"] = str(result.inserted_id)
    
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
