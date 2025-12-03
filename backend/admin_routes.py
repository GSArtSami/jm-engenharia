from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import Property, PropertyCreate, Land, LandCreate, Construction, ConstructionCreate, AdminLogin
from typing import List
import os
import jwt
from datetime import datetime, timedelta

router = APIRouter(prefix="/admin", tags=["admin"])

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
@router.get("/properties", response_model=List[Property])
async def get_all_properties(db: AsyncIOMotorDatabase):
    properties = await db.properties.find().to_list(1000)
    return properties

@router.post("/properties")
async def create_property(property: PropertyCreate, db: AsyncIOMotorDatabase):
    property_dict = property.dict()
    result = await db.properties.insert_one(property_dict)
    property_dict["id"] = str(result.inserted_id)
    return {"success": True, "property": property_dict}

@router.put("/properties/{property_id}")
async def update_property(property_id: str, property: PropertyCreate, db: AsyncIOMotorDatabase):
    from bson import ObjectId
    result = await db.properties.update_one(
        {"_id": ObjectId(property_id)},
        {"$set": property.dict()}
    )
    if result.modified_count:
        return {"success": True}
    raise HTTPException(status_code=404, detail="Imóvel não encontrado")

@router.delete("/properties/{property_id}")
async def delete_property(property_id: str, db: AsyncIOMotorDatabase):
    from bson import ObjectId
    result = await db.properties.delete_one({"_id": ObjectId(property_id)})
    if result.deleted_count:
        return {"success": True}
    raise HTTPException(status_code=404, detail="Imóvel não encontrado")

# Land routes
@router.get("/lands", response_model=List[Land])
async def get_all_lands(db: AsyncIOMotorDatabase):
    lands = await db.lands.find().to_list(1000)
    return lands

@router.post("/lands")
async def create_land(land: LandCreate, db: AsyncIOMotorDatabase):
    land_dict = land.dict()
    result = await db.lands.insert_one(land_dict)
    land_dict["id"] = str(result.inserted_id)
    return {"success": True, "land": land_dict}

@router.put("/lands/{land_id}")
async def update_land(land_id: str, land: LandCreate, db: AsyncIOMotorDatabase):
    from bson import ObjectId
    result = await db.lands.update_one(
        {"_id": ObjectId(land_id)},
        {"$set": land.dict()}
    )
    if result.modified_count:
        return {"success": True}
    raise HTTPException(status_code=404, detail="Terreno não encontrado")

@router.delete("/lands/{land_id}")
async def delete_land(land_id: str, db: AsyncIOMotorDatabase):
    from bson import ObjectId
    result = await db.lands.delete_one({"_id": ObjectId(land_id)})
    if result.deleted_count:
        return {"success": True}
    raise HTTPException(status_code=404, detail="Terreno não encontrado")

# Construction routes
@router.get("/constructions", response_model=List[Construction])
async def get_all_constructions(db: AsyncIOMotorDatabase):
    constructions = await db.constructions.find().to_list(1000)
    return constructions

@router.post("/constructions")
async def create_construction(construction: ConstructionCreate, db: AsyncIOMotorDatabase):
    construction_dict = construction.dict()
    result = await db.constructions.insert_one(construction_dict)
    construction_dict["id"] = str(result.inserted_id)
    return {"success": True, "construction": construction_dict}

@router.put("/constructions/{construction_id}")
async def update_construction(construction_id: str, construction: ConstructionCreate, db: AsyncIOMotorDatabase):
    from bson import ObjectId
    result = await db.constructions.update_one(
        {"_id": ObjectId(construction_id)},
        {"$set": construction.dict()}
    )
    if result.modified_count:
        return {"success": True}
    raise HTTPException(status_code=404, detail="Construção não encontrada")

@router.delete("/constructions/{construction_id}")
async def delete_construction(construction_id: str, db: AsyncIOMotorDatabase):
    from bson import ObjectId
    result = await db.constructions.delete_one({"_id": ObjectId(construction_id)})
    if result.deleted_count:
        return {"success": True}
    raise HTTPException(status_code=404, detail="Construção não encontrada")
