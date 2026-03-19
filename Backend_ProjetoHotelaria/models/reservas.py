from sqlalchemy import Column, Integer, Date, ForeignKey, String
from sqlalchemy.orm import relationship
from database import Base

class Reserva(Base):
    __tablename__ = "reservas"

    id = Column(Integer, primary_key=True, autoincrement=True)

    hospede_id = Column(Integer, ForeignKey("hospedes.id"))
    quarto_id = Column(Integer, ForeignKey("quartos.id"))

    data_checkin = Column(Date)
    data_checkout = Column(Date)

    status = Column(String(20), default="reservada")

    hospede = relationship("Hospede")
    quarto = relationship("Quarto")