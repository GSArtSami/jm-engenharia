from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from pathlib import Path
import admin_routes
import public_routes

app = FastAPI()

# 1. CORS - PRECISA VIR ANTES DE TUDO
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Libera geral para testar
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. CONEXÃO MONGODB COM TRATAMENTO DE ERRO
try:
    mongo_url = os.environ.get('MONGO_URL', "")
    db_name = os.environ.get('DB_NAME', "jm_engenharia")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # 3. VINCULAR O BANCO AOS ROUTERS
    admin_routes.db_instance = db
    public_routes.db_instance = db
except Exception as e:
    print(f"ERRO DE CONEXÃO: {e}")

# 4. ROTAS COM PREFIXO /API
api_router = APIRouter(prefix="/api")
api_router.include_router(admin_routes.router)
api_router.include_router(public_routes.router)

app.include_router(api_router)
