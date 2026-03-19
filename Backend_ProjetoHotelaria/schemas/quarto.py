from pydantic import BaseModel
from typing import Optional

class QuartoBase(BaseModel):
    numero: int
    tipo: Optional[str] = None
    preco_diaria: float
    status: Optional[str] = "livre"

class QuartoCreate(QuartoBase):
    pass

class Quarto(QuartoBase):
    id: int

    class Config:
        from_attributes = True