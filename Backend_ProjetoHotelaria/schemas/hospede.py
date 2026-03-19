from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class HospedeBase(BaseModel):
    nome: str
    cpf: Optional[str] = None
    telefone: Optional[str] = None
    email: Optional[str] = None

class HospedeCreate(HospedeBase):
    pass

class Hospede(HospedeBase):
    id: int
    data_cadastro: Optional[datetime] = None

    class Config:
        from_attributes = True  # Mudar de 'orm_mode' para 'from_attributes' (FastAPI atual)