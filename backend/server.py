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

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# --- CONFIGURAÇÃO DE DIRETÓRIOS ---
UPLOAD_DIR = ROOT_DIR / "uploads"
try:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
except Exception as e:
    print(f"Warning: Could not create uploads directory: {e}")
    import tempfile
    UPLOAD_DIR = Path(tempfile.gettempdir()) / "jm_uploads"
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# --- CONEXÃO MONGODB ---
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

def get_db():
    return db

# --- INICIALIZAÇÃO DO APP ---
app = FastAPI()

# 1. CONFIGURAÇÃO DE CORS (DEVE VIR LOGO NO INÍCIO)
# Adicionei a variação com e sem barra no final para garantir
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://jm-engenharia.onrender.com",
        "https://jm-engenharia.onrender.com/",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. ARQUIVOS ESTÁTICOS
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# --- MODELOS ---
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# --- ROUTERS ---
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

# Importar rotas externas
import admin_routes
import public_routes

# Passar banco de dados para os routers
admin_routes.db_instance = db
public_routes.db_instance = db

# Incluir sub-routers no api_router
api_router.include_router(admin_routes.router)
api_router.include_router(public_routes.router)

# Incluir o api_router principal no app
app.include_router(api_router)

# --- LOGGING E LIFECYCLE ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
