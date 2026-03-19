from sqlalchemy import Column, Integer, String, TIMESTAMP, text
from database import Base

class Hospede(Base):
    __tablename__ = "hospedes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(100), nullable=False)
    cpf = Column(String(20))
    telefone = Column(String(20))
    email = Column(String(100))
    data_cadastro = Column(TIMESTAMP(timezone=True),
                           server_default=text('NOW()'))