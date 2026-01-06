from fastapi import APIRouter, HTTPException, Depends, Body, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import Property, PropertyCreate, Land, LandCreate, Construction, ConstructionCreate, AdminLogin, PageVisit, Appointment, AppointmentCreate
from typing import List, Dict
import os
import jwt
from datetime import datetime, timedelta
from bson import ObjectId

router = APIRouter(prefix="/admin", tags=["admin"])

# Global db variable to be set by server
db_instance = None

# Dependency to get database
def get_db():
    return db_instance

# Admin password
ADMIN_PASSWORD = "JM@engcivil"
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")

def create_token():
    payload = {
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow(),
        "admin": True
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload.get("admin") == True
    except:
        return False

@router.post("/login")
async def admin_login(login: AdminLogin):
    if login.password == ADMIN_PASSWORD:
        token = create_token()
        return {"success": True, "token": token}
    raise HTTPException(status_code=401, detail="Senha incorreta")

# Property routes
@router.get("/properties")
async def get_all_properties(db: AsyncIOMotorDatabase = Depends(get_db)):
    properties = await db.properties.find().to_list(1000)
    for prop in properties:
        prop["id"] = str(prop.pop("_id"))
    return properties

@router.post("/properties")
async def create_property(property: PropertyCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    property_dict = property.model_dump()
    result = await db.properties.insert_one(property_dict)
    property_dict["id"] = str(result.inserted_id)
    return {"success": True, "property": property_dict}

@router.put("/properties/{property_id}")
async def update_property(property_id: str, property: PropertyCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    result = await db.properties.update_one(
        {"_id": ObjectId(property_id)},
        {"$set": property.dict()}
    )
    if result.modified_count:
        return {"success": True}
    raise HTTPException(status_code=404, detail="Imóvel não encontrado")

@router.delete("/properties/{property_id}")
async def delete_property(property_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    result = await db.properties.delete_one({"_id": ObjectId(property_id)})
    if result.deleted_count:
        return {"success": True}
    raise HTTPException(status_code=404, detail="Imóvel não encontrado")

# Land routes
@router.get("/lands")
async def get_all_lands(db: AsyncIOMotorDatabase = Depends(get_db)):
    lands = await db.lands.find().to_list(1000)
    for land in lands:
        land["id"] = str(land.pop("_id"))
    return lands

@router.post("/lands")
async def create_land(land: LandCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    land_dict = land.dict()
    result = await db.lands.insert_one(land_dict)
    land_dict["id"] = str(result.inserted_id)
    return {"success": True, "land": land_dict}

@router.put("/lands/{land_id}")
async def update_land(land_id: str, land: LandCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    result = await db.lands.update_one(
        {"_id": ObjectId(land_id)},
        {"$set": land.dict()}
    )
    if result.modified_count:
        return {"success": True}
    raise HTTPException(status_code=404, detail="Terreno não encontrado")

@router.delete("/lands/{land_id}")
async def delete_land(land_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    result = await db.lands.delete_one({"_id": ObjectId(land_id)})
    if result.deleted_count:
        return {"success": True}
    raise HTTPException(status_code=404, detail="Terreno não encontrado")

# Construction routes
@router.get("/constructions")
async def get_all_constructions(db: AsyncIOMotorDatabase = Depends(get_db)):
    constructions = await db.constructions.find().to_list(1000)
    for construction in constructions:
        construction["id"] = str(construction.pop("_id"))
    return constructions

@router.post("/constructions")
async def create_construction(construction: ConstructionCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    construction_dict = construction.dict()
    result = await db.constructions.insert_one(construction_dict)
    construction_dict["id"] = str(result.inserted_id)
    return {"success": True, "construction": construction_dict}

@router.put("/constructions/{construction_id}")
async def update_construction(construction_id: str, construction: ConstructionCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    result = await db.constructions.update_one(
        {"_id": ObjectId(construction_id)},
        {"$set": construction.dict()}
    )
    if result.modified_count:
        return {"success": True}
    raise HTTPException(status_code=404, detail="Construção não encontrada")

@router.delete("/constructions/{construction_id}")
async def delete_construction(construction_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    result = await db.constructions.delete_one({"_id": ObjectId(construction_id)})
    if result.deleted_count:
        return {"success": True}
    raise HTTPException(status_code=404, detail="Construção não encontrada")


# Analytics routes
@router.get("/analytics/visits")
async def get_visit_analytics(period: str = "day", db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get visit analytics grouped by day, week, or month"""
    from datetime import datetime, timedelta
    
    now = datetime.utcnow()
    
    if period == "day":
        start_date = now - timedelta(days=30)  # Last 30 days
        group_format = "%Y-%m-%d"
    elif period == "week":
        start_date = now - timedelta(weeks=12)  # Last 12 weeks
        group_format = "%Y-W%U"
    elif period == "month":
        start_date = now - timedelta(days=365)  # Last 12 months
        group_format = "%Y-%m"
    else:
        start_date = now - timedelta(days=30)
        group_format = "%Y-%m-%d"
    
    pipeline = [
        {"$match": {"timestamp": {"$gte": start_date}}},
        {
            "$group": {
                "_id": {
                    "$dateToString": {"format": group_format, "date": "$timestamp"}
                },
                "count": {"$sum": 1},
                "unique_ips": {"$addToSet": "$user_ip"}
            }
        },
        {
            "$project": {
                "date": "$_id",
                "total_visits": "$count",
                "unique_visitors": {"$size": "$unique_ips"}
            }
        },
        {"$sort": {"date": 1}}
    ]
    
    results = await db.page_visits.aggregate(pipeline).to_list(1000)
    return results

@router.get("/analytics/summary")
async def get_analytics_summary(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get overall analytics summary"""
    from datetime import datetime, timedelta
    
    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)
    week_start = now - timedelta(days=7)
    month_start = now - timedelta(days=30)
    
    # Today's visits
    today_visits = await db.page_visits.count_documents({"timestamp": {"$gte": today_start}})
    
    # This week's visits
    week_visits = await db.page_visits.count_documents({"timestamp": {"$gte": week_start}})
    
    # This month's visits
    month_visits = await db.page_visits.count_documents({"timestamp": {"$gte": month_start}})
    
    # Total visits
    total_visits = await db.page_visits.count_documents({})
    
    # Unique visitors today
    today_visitors = await db.page_visits.distinct("user_ip", {"timestamp": {"$gte": today_start}})
    
    return {
        "today": today_visits,
        "this_week": week_visits,
        "this_month": month_visits,
        "total": total_visits,
        "unique_today": len(today_visitors)
    }

# Appointment routes
@router.get("/appointments")
async def get_all_appointments(status: str = None, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all appointments, optionally filtered by status"""
    query = {}
    if status:
        query["status"] = status
    
    appointments = await db.appointments.find(query).sort("created_at", -1).to_list(1000)
    for appt in appointments:
        appt["id"] = str(appt.pop("_id"))
    return appointments

@router.get("/appointments/pending/count")
async def get_pending_appointments_count(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get count of pending appointments for notifications"""
    count = await db.appointments.count_documents({"status": "pending"})
    return {"count": count}

@router.put("/appointments/{appointment_id}/status")
async def update_appointment_status(
    appointment_id: str, 
    status: str = Body(..., embed=True),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update appointment status (confirm, cancel, etc.)"""
    if status not in ["pending", "confirmed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Status inválido")
    
    result = await db.appointments.update_one(
        {"_id": ObjectId(appointment_id)},
        {"$set": {"status": status}}
    )
    
    if result.modified_count:
        return {"success": True}
    raise HTTPException(status_code=404, detail="Agendamento não encontrado")
