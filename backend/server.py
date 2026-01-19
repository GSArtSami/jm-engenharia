from fastapi import FastAPI, APIRouter, Depends
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path

# 1. Carregar configurações
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# 2. Conectar ao MongoDB
mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# 3. Inicializar o App
app = FastAPI()

# 4. CONFIGURAR CORS (MUITO IMPORTANTE: DEVE VIR AQUI, ANTES DAS ROTAS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Usar "*" temporariamente para garantir que o agendamento funcione
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. Configurar Pastas de Upload
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# 6. Importar e Configurar Rotas
import admin_routes
import public_routes

# Passa o banco para os arquivos de rota
admin_routes.db_instance = db
public_routes.db_instance = db

# Criar o roteador principal /api
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {"message": "API Online"}

# Incluir as sub-rotas
api_router.include_router(admin_routes.router)
api_router.include_router(public_routes.router)

# Por fim, incluir tudo no app
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
