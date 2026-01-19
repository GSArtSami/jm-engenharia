from fastapi import FastAPI, APIRouter, Depends
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone

# 1. CARREGAR AMBIENTE
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# 2. CONFIGURAR UPLOADS
UPLOAD_DIR = ROOT_DIR / "uploads"
try:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
except Exception as e:
    import tempfile
    UPLOAD_DIR = Path(tempfile.gettempdir()) / "jm_uploads"
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# 3. CONEXÃO MONGODB
mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# 4. INICIALIZAR APP
app = FastAPI()

# 5. CONFIGURAR CORS (IMPORTANTE: DEVE VIR ANTES DOS ROUTERS)
# Usamos "*" para garantir que nenhuma rota seja bloqueada pelo navegador
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 6. ARQUIVOS ESTÁTICOS
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# 7. ROUTERS E BANCO DE DADOS
import admin_routes
import public_routes

# Passar a conexão do banco para os arquivos de rota
admin_routes.db_instance = db
public_routes.db_instance = db

# Criar o prefixo global /api
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {"message": "API JM Engenharia Online"}

# Incluir as rotas externas dentro do prefixo /api
api_router.include_router(admin_routes.router)
api_router.include_router(public_routes.router)

# Registrar tudo no app principal
app.include_router(api_router)

# 8. LOGGING
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
