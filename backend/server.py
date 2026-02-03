from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import admin_routes
import public_routes

app = FastAPI()

# 1. CORS (Sempre no topo para evitar bloqueios no navegador)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. ROTA DE TESTE (Para saber se o servidor está vivo)
@app.get("/health")
async def health():
    return {"status": "ok"}

# 3. CONEXÃO MONGODB
# Movido para cima das rotas para garantir que o 'db' exista
try:
    mongo_url = os.environ.get('MONGO_URL', "")
    db_name = os.environ.get('DB_NAME', "jm_engenharia")
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Agora sim, vinculamos o db aos routers DEPOIS que ele foi criado
    admin_routes.db_instance = db
    public_routes.db_instance = db
    print("✅ Conectado ao MongoDB e instâncias vinculadas!")
except Exception as e:
    print(f"❌ ERRO DE CONEXÃO: {e}")

# 4. CONFIGURAÇÃO DAS ROTAS
api_router = APIRouter(prefix="/api")
api_router.include_router(admin_routes.router)
api_router.include_router(public_routes.router)

app.include_router(api_router)
