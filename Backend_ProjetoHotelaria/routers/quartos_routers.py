from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from database import get_db
from crud import quarto_crud
from schemas import quarto as quarto_schema
from models import reservas, quartos

router = APIRouter(prefix="/quartos", tags=["Quartos"])

@router.post("/", response_model=quarto_schema.Quarto, status_code=status.HTTP_201_CREATED)
def criar_quarto(quarto: quarto_schema.QuartoCreate, db: Session = Depends(get_db)):
    """Cria um novo quarto"""
    # Verificar se número do quarto já existe
    quarto_existente = db.query(quartos.Quarto).filter(
        quartos.Quarto.numero == quarto.numero
    ).first()
    
    if quarto_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Quarto número {quarto.numero} já existe"
        )
    
    return quarto_crud.criar_quarto(db=db, quarto=quarto)

@router.get("/", response_model=List[quarto_schema.Quarto])
def listar_quartos(
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Lista todos os quartos com filtros opcionais"""
    query = db.query(quartos.Quarto)
    
    if status:
        query = query.filter(quartos.Quarto.status == status)
    
    return query.offset(skip).limit(limit).all()

@router.get("/disponiveis")
def quartos_disponiveis(
    data_checkin: date,
    data_checkout: date,
    tipo: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Lista quartos disponíveis em um período"""
    # Validar datas
    if data_checkin >= data_checkout:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Data de check-in deve ser anterior à data de check-out"
        )
    
    # Quartos reservados no período
    quartos_reservados = db.query(reservas.Reserva.quarto_id).filter(
        reservas.Reserva.data_checkin < data_checkout,
        reservas.Reserva.data_checkout > data_checkin,
        reservas.Reserva.status.in_(["reservada", "confirmada"])
    ).subquery()
    
    # Buscar quartos disponíveis
    query = db.query(quartos.Quarto).filter(
        ~quartos.Quarto.id.in_(quartos_reservados),
        quartos.Quarto.status == "livre"
    )
    
    if tipo:
        query = query.filter(quartos.Quarto.tipo == tipo)
    
    return query.all()

@router.get("/{quarto_id}", response_model=quarto_schema.Quarto)
def buscar_quarto(quarto_id: int, db: Session = Depends(get_db)):
    """Busca um quarto pelo ID"""
    db_quarto = quarto_crud.buscar_quarto(db, quarto_id)
    if db_quarto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quarto não encontrado"
        )
    return db_quarto

@router.put("/{quarto_id}", response_model=quarto_schema.Quarto)
def atualizar_quarto(
    quarto_id: int,
    quarto: quarto_schema.QuartoCreate,
    db: Session = Depends(get_db)
):
    """Atualiza um quarto existente"""
    # Verificar se número já existe em outro quarto
    if quarto.numero:
        quarto_existente = db.query(quartos.Quarto).filter(
            quartos.Quarto.numero == quarto.numero,
            quartos.Quarto.id != quarto_id
        ).first()
        
        if quarto_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Quarto número {quarto.numero} já existe"
            )
    
    db_quarto = quarto_crud.atualizar_quarto(db, quarto_id, quarto)
    if db_quarto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quarto não encontrado"
        )
    return db_quarto

@router.delete("/{quarto_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_quarto(quarto_id: int, db: Session = Depends(get_db)):
    """Remove um quarto (apenas se não tiver reservas)"""
    # Verificar se existem reservas para este quarto
    reservas_ativas = db.query(reservas.Reserva).filter(
        reservas.Reserva.quarto_id == quarto_id
    ).first()
    
    if reservas_ativas:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quarto possui reservas e não pode ser removido"
        )
    
    db_quarto = quarto_crud.deletar_quarto(db, quarto_id)
    if db_quarto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quarto não encontrado"
        )
    return None