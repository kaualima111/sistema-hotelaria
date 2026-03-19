from sqlalchemy import Column, Integer, String, Float
from database import Base

class Quarto(Base):
    __tablename__ = "quartos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    numero = Column(Integer, nullable=False)
    tipo = Column(String(50))
    preco_diaria = Column(Float)
    status = Column(String(20), default="livre")