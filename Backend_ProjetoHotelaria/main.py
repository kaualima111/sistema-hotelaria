from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ← ADICIONAR
from database import engine, Base

import models.hospedes
import models.quartos
import models.reservas

from routers import hospedes_routers, quartos_routers, reservas_routers

app = FastAPI(
    title="Sistema de Hotelaria",
    description="API para gerenciamento de hotel",
    version="1.0.0"
)

# 👇 ADICIONAR ESTE BLOCO (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Criar tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Incluir rotas
app.include_router(hospedes_routers.router)
app.include_router(quartos_routers.router)
app.include_router(reservas_routers.router)

@app.get("/")
def root():
    return {
        "mensagem": "Sistema de Hotelaria funcionando",
        "documentacao": "/docs",
        "versao": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "banco": "conectado"}