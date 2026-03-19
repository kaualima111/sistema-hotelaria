from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from database import get_db
from crud import reserva_crud
from schemas import reserva as reserva_schema
from models import reservas, hospedes, quartos

router = APIRouter(prefix="/reservas", tags=["Reservas"])

@router.post("/", response_model=reserva_schema.Reserva, status_code=status.HTTP_201_CREATED)
def criar_reserva(reserva: reserva_schema.ReservaCreate, db: Session = Depends(get_db)):
    """Cria uma nova reserva"""
    # Validar datas
    if reserva.data_checkin >= reserva.data_checkout:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Data de check-in deve ser anterior à data de check-out"
        )
    
    # Verificar se hóspede existe
    hospede = db.query(hospedes.Hospede).filter(hospedes.Hospede.id == reserva.hospede_id).first()
    if not hospede:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hóspede não encontrado"
        )
    
    # Verificar se quarto existe
    quarto = db.query(quartos.Quarto).filter(quartos.Quarto.id == reserva.quarto_id).first()
    if not quarto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quarto não encontrado"
        )
    
    # Verificar disponibilidade do quarto no período
    reservas_conflito = db.query(reservas.Reserva).filter(
        reservas.Reserva.quarto_id == reserva.quarto_id,
        reservas.Reserva.data_checkin < reserva.data_checkout,
        reservas.Reserva.data_checkout > reserva.data_checkin,
        reservas.Reserva.status.in_(["reservada", "confirmada"])
    ).first()
    
    if reservas_conflito:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quarto não está disponível no período solicitado"
        )
    
    return reserva_crud.criar_reserva(db=db, reserva=reserva)

@router.get("/", response_model=List[reserva_schema.Reserva])
def listar_reservas(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    data_inicio: Optional[date] = None,
    data_fim: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """Lista todas as reservas com filtros opcionais"""
    query = db.query(reservas.Reserva)
    
    if status:
        query = query.filter(reservas.Reserva.status == status)
    
    if data_inicio:
        query = query.filter(reservas.Reserva.data_checkin >= data_inicio)
    
    if data_fim:
        query = query.filter(reservas.Reserva.data_checkout <= data_fim)
    
    return query.offset(skip).limit(limit).all()

@router.get("/{reserva_id}", response_model=reserva_schema.Reserva)
def buscar_reserva(reserva_id: int, db: Session = Depends(get_db)):
    """Busca uma reserva pelo ID"""
    db_reserva = reserva_crud.buscar_reserva(db, reserva_id)
    if db_reserva is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reserva não encontrada"
        )
    return db_reserva

@router.put("/{reserva_id}/cancelar", response_model=reserva_schema.Reserva)
def cancelar_reserva(reserva_id: int, db: Session = Depends(get_db)):
    """Cancela uma reserva"""
    db_reserva = reserva_crud.buscar_reserva(db, reserva_id)
    if db_reserva is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reserva não encontrada"
        )
    
    if db_reserva.status == "cancelada":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reserva já está cancelada"
        )
    
    if db_reserva.status in ["finalizada", "checkin_realizado"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível cancelar uma reserva já iniciada ou finalizada"
        )
    
    db_reserva.status = "cancelada"
    db.commit()
    db.refresh(db_reserva)
    
    # Liberar o quarto (status volta para "livre")
    quarto = db.query(quartos.Quarto).filter(quartos.Quarto.id == db_reserva.quarto_id).first()
    if quarto:
        quarto.status = "livre"
        db.commit()
    
    return db_reserva

@router.put("/{reserva_id}/checkin", response_model=reserva_schema.Reserva)
def realizar_checkin(reserva_id: int, db: Session = Depends(get_db)):
    """Realiza check-in de uma reserva"""
    db_reserva = reserva_crud.buscar_reserva(db, reserva_id)
    if db_reserva is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reserva não encontrada"
        )
    
    if db_reserva.status != "reservada":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Não é possível fazer check-in. Status atual: {db_reserva.status}"
        )
    
    db_reserva.status = "checkin_realizado"
    
    # Marcar quarto como ocupado
    quarto = db.query(quartos.Quarto).filter(quartos.Quarto.id == db_reserva.quarto_id).first()
    if quarto:
        quarto.status = "ocupado"
    
    db.commit()
    db.refresh(db_reserva)
    return db_reserva

@router.put("/{reserva_id}/checkout", response_model=reserva_schema.Reserva)
def realizar_checkout(reserva_id: int, db: Session = Depends(get_db)):
    """Realiza check-out de uma reserva"""
    db_reserva = reserva_crud.buscar_reserva(db, reserva_id)
    if db_reserva is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reserva não encontrada"
        )
    
    if db_reserva.status != "checkin_realizado":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Não é possível fazer check-out. Status atual: {db_reserva.status}"
        )
    
    db_reserva.status = "finalizada"
    
    # Marcar quarto como livre novamente
    quarto = db.query(quartos.Quarto).filter(quartos.Quarto.id == db_reserva.quarto_id).first()
    if quarto:
        quarto.status = "livre"
    
    db.commit()
    db.refresh(db_reserva)
    return db_reserva

@router.delete("/{reserva_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_reserva(reserva_id: int, db: Session = Depends(get_db)):
    """Remove uma reserva"""
    db_reserva = reserva_crud.deletar_reserva(db, reserva_id)
    if db_reserva is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reserva não encontrada"
        )
    return None