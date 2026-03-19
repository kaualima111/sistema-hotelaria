from pydantic import BaseModel
from datetime import date
from typing import Optional

class ReservaBase(BaseModel):
    hospede_id: int
    quarto_id: int
    data_checkin: date
    data_checkout: date
    status: Optional[str] = "reservada"

class ReservaCreate(ReservaBase):
    pass

class Reserva(ReservaBase):
    id: int

    class Config:
        from_attributes = True