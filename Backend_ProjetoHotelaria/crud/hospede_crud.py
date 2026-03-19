from sqlalchemy.orm import Session
from models import hospedes
from schemas import hospede as hospede_schema

def criar_hospede(db: Session, hospede: hospede_schema.HospedeCreate):
    db_hospede = hospedes.Hospede(**hospede.dict())
    db.add(db_hospede)
    db.commit()
    db.refresh(db_hospede)
    return db_hospede

def listar_hospedes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(hospedes.Hospede).offset(skip).limit(limit).all()

def buscar_hospede(db: Session, hospede_id: int):
    return db.query(hospedes.Hospede).filter(hospedes.Hospede.id == hospede_id).first()

def buscar_hospede_por_cpf(db: Session, cpf: str):
    return db.query(hospedes.Hospede).filter(hospedes.Hospede.cpf == cpf).first()

def atualizar_hospede(db: Session, hospede_id: int, hospede: hospede_schema.HospedeCreate):
    db_hospede = buscar_hospede(db, hospede_id)
    if db_hospede:
        for key, value in hospede.dict().items():
            setattr(db_hospede, key, value)
        db.commit()
        db.refresh(db_hospede)
    return db_hospede

def deletar_hospede(db: Session, hospede_id: int):
    db_hospede = buscar_hospede(db, hospede_id)
    if db_hospede:
        db.delete(db_hospede)
        db.commit()
    return db_hospede