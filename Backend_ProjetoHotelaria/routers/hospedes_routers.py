from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from crud import hospede_crud
from schemas import hospede as hospede_schema
from models import reservas

router = APIRouter(prefix="/hospedes", tags=["Hóspedes"])

@router.post("/", response_model=hospede_schema.Hospede, status_code=status.HTTP_201_CREATED)
def criar_hospede(hospede: hospede_schema.HospedeCreate, db: Session = Depends(get_db)):
    """Cria um novo hóspede"""
    # Verificar se CPF já existe
    if hospede.cpf:
        hospede_existente = hospede_crud.buscar_hospede_por_cpf(db, hospede.cpf)
        if hospede_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CPF já cadastrado"
            )
    
    return hospede_crud.criar_hospede(db=db, hospede=hospede)

@router.get("/", response_model=List[hospede_schema.Hospede])
def listar_hospedes(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """Lista todos os hóspedes com paginação"""
    return hospede_crud.listar_hospedes(db, skip=skip, limit=limit)

@router.get("/{hospede_id}", response_model=hospede_schema.Hospede)
def buscar_hospede(hospede_id: int, db: Session = Depends(get_db)):
    """Busca um hóspede pelo ID"""
    db_hospede = hospede_crud.buscar_hospede(db, hospede_id)
    if db_hospede is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hóspede não encontrado"
        )
    return db_hospede

@router.put("/{hospede_id}", response_model=hospede_schema.Hospede)
def atualizar_hospede(
    hospede_id: int, 
    hospede: hospede_schema.HospedeCreate, 
    db: Session = Depends(get_db)
):
    """Atualiza um hóspede existente"""
    db_hospede = hospede_crud.atualizar_hospede(db, hospede_id, hospede)
    if db_hospede is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hóspede não encontrado"
        )
    return db_hospede

@router.delete("/{hospede_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_hospede(hospede_id: int, db: Session = Depends(get_db)):
    """Remove um hóspede"""
    # Verificar se hóspede tem reservas ativas
    reservas_ativas = db.query(reservas.Reserva).filter(
        reservas.Reserva.hospede_id == hospede_id,
        reservas.Reserva.status.in_(["reservada", "confirmada"])
    ).first()
    
    if reservas_ativas:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hóspede possui reservas ativas e não pode ser removido"
        )
    
    db_hospede = hospede_crud.deletar_hospede(db, hospede_id)
    if db_hospede is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hóspede não encontrado"
        )
    return None

@router.get("/{hospede_id}/reservas", response_model=List[dict])
def listar_reservas_do_hospede(
    hospede_id: int, 
    db: Session = Depends(get_db)
):
    """Lista todas as reservas de um hóspede específico"""
    # Verificar se hóspede existe
    db_hospede = hospede_crud.buscar_hospede(db, hospede_id)
    if db_hospede is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hóspede não encontrado"
        )
    
    reservas_lista = db.query(
        reservas.Reserva.id,
        reservas.Reserva.data_checkin,
        reservas.Reserva.data_checkout,
        reservas.Reserva.status,
        reservas.Quarto.numero.label("quarto_numero"),
        reservas.Quarto.tipo.label("quarto_tipo")
    ).join(
        reservas.Quarto, reservas.Reserva.quarto_id == reservas.Quarto.id
    ).filter(
        reservas.Reserva.hospede_id == hospede_id
    ).all()
    
    return reservas_lista