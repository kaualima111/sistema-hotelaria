# 🏨 Sistema de Hotelaria

## 📋 Descrição
Sistema completo de gestão hoteleira com frontend React, backend FastAPI e orquestração Kubernetes.

## 🚀 Tecnologias
- **Frontend:** React + Bootstrap
- **Backend:** FastAPI + SQLAlchemy
- **Banco de Dados:** PostgreSQL
- **Mensageria:** RabbitMQ (configurado)
- **Container:** Docker
- **Orquestração:** Kubernetes

## 📁 Estrutura
/
| ---- frontend/ # Aplicação React
| ---- backend/ # API FastAPI
| ---- README.md

## 🛠️ Como executar

### Backend (Docker)
```bash
cd backend
docker-compose up -d
cd backend
kubectl apply -f k8s/

### Frontend (Docker)
```bash
cd frontend
npm install
npm run dev