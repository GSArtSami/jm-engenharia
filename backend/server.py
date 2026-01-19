from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from pathlib import Path
from dotenv import load_dotenv

# 1. SETUP E VARIÁVEIS
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = FastAPI()

# 2. SEGURANÇA (CORS) - PRECISA VIR ANTES DAS ROTAS!
# Isso libera o "gancho" que está travando o agendamento no navegador
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. CONEXÃO MONGODB
mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# 4. IMPORTAR ROTAS
import admin_routes
import public_routes

# 5. VINCULAR O BANCO AOS ROUTERS (IMPORTANTE PARA SALVAR O AGENDAMENTO)
admin_routes.db_instance = db
public_routes.db_instance = db

# 6. MONTAR O PREFIXO /API
api_router = APIRouter(prefix="/api")

# Inclui as rotas do admin e do público dentro do prefixo /api
api_router.include_router(admin_routes.router)
api_router.include_router(public_routes.router)

app.include_router(api_router)

# 7. ARQUIVOS ESTÁTICOS (UPLOADS)
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
