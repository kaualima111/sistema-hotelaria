from sqlalchemy.orm import Session
from models import reservas
from schemas import reserva as reserva_schema

def criar_reserva(db: Session, reserva: reserva_schema.ReservaCreate):
    db_reserva = reservas.Reserva(**reserva.dict())
    db.add(db_reserva)
    db.commit()
    db.refresh(db_reserva)
    return db_reserva

def listar_reservas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(reservas.Reserva).offset(skip).limit(limit).all()

def buscar_reserva(db: Session, reserva_id: int):
    return db.query(reservas.Reserva).filter(reservas.Reserva.id == reserva_id).first()

def atualizar_reserva(db: Session, reserva_id: int, reserva: reserva_schema.ReservaCreate):
    db_reserva = buscar_reserva(db, reserva_id)
    if db_reserva:
        for key, value in reserva.dict().items():
            setattr(db_reserva, key, value)
        db.commit()
        db.refresh(db_reserva)
    return db_reserva

def deletar_reserva(db: Session, reserva_id: int):
    db_reserva = buscar_reserva(db, reserva_id)
    if db_reserva:
        db.delete(db_reserva)
        db.commit()
    return db_reserva