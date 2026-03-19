from sqlalchemy.orm import Session
from models import quartos
from schemas import quarto as quarto_schema

def criar_quarto(db: Session, quarto: quarto_schema.QuartoCreate):
    db_quarto = quartos.Quarto(**quarto.dict())
    db.add(db_quarto)
    db.commit()
    db.refresh(db_quarto)
    return db_quarto

def listar_quartos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(quartos.Quarto).offset(skip).limit(limit).all()

def buscar_quarto(db: Session, quarto_id: int):
    return db.query(quartos.Quarto).filter(quartos.Quarto.id == quarto_id).first()

def atualizar_quarto(db: Session, quarto_id: int, quarto: quarto_schema.QuartoCreate):
    db_quarto = buscar_quarto(db, quarto_id)
    if db_quarto:
        for key, value in quarto.dict().items():
            setattr(db_quarto, key, value)
        db.commit()
        db.refresh(db_quarto)
    return db_quarto

def deletar_quarto(db: Session, quarto_id: int):
    db_quarto = buscar_quarto(db, quarto_id)
    if db_quarto:
        db.delete(db_quarto)
        db.commit()
    return db_quarto