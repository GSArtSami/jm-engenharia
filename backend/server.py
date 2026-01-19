from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from pathlib import Path
from dotenv import load_dotenv

# 1. SETUP INICIAL
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = FastAPI()

# 2. CORS - TOTALMENTE ABERTO PARA TESTE (Obrigatório vir primeiro)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. CONEXÃO MONGODB (Com verificação de segurança)
MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'jm_engenharia')

try:
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    print(f"✅ Conectado ao MongoDB: {DB_NAME}")
except Exception as e:
    print(f"❌ Erro na conexão MongoDB: {e}")

# 4. IMPORTAR E CONFIGURAR ROTAS
import admin_routes
import public_routes

# Vincula o banco de dados aos arquivos de rota ANTES de incluí-los
admin_routes.db_instance = db
public_routes.db_instance = db

# 5. ESTRUTURA DE ROTAS /API
api_router = APIRouter(prefix="/api")

@api_router.get("/health")
async def health_check():
    return {"status": "online", "database": "connected"}

api_router.include_router(admin_routes.router)
api_router.include_router(public_routes.router)

app.include_router(api_router)

# 6. ARQUIVOS ESTÁTICOS
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
