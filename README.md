# 🏨 Sistema de Hotelaria

Sistema web para gerenciamento de operações hoteleiras, desenvolvido com arquitetura separada entre frontend e backend. A aplicação permite o gerenciamento de hóspedes, quartos e reservas, utilizando uma API REST construída com FastAPI e uma interface web desenvolvida em React.

O projeto também utiliza PostgreSQL para persistência de dados, Docker para conteinerização do ambiente e Kubernetes para orquestração dos serviços.

---

## 📋 Sobre o projeto

O **Sistema de Hotelaria** foi desenvolvido com o objetivo de aplicar conceitos de desenvolvimento web, arquitetura de software, APIs REST, persistência de dados e infraestrutura baseada em containers.

A aplicação possui uma arquitetura dividida em duas camadas principais:

- **Frontend:** aplicação web desenvolvida em React.
- **Backend:** API REST desenvolvida em Python com FastAPI.
- **Banco de dados:** PostgreSQL.
- **Infraestrutura:** Docker e Kubernetes.
- **Mensageria:** RabbitMQ configurado no ambiente de execução.

O sistema permite realizar operações relacionadas a:

- Cadastro e gerenciamento de hóspedes;
- Cadastro e gerenciamento de quartos;
- Cadastro e gerenciamento de reservas;
- Comunicação entre frontend e backend por meio de API REST;
- Persistência das informações em banco de dados PostgreSQL.

---

## 🚀 Principais funcionalidades

### 👤 Hóspedes
- Cadastro de hóspedes;
- Consulta de hóspedes;
- Atualização de informações;
- Exclusão de registros.

### 🛏️ Quartos
- Cadastro de quartos;
- Consulta de quartos;
- Atualização de informações;
- Exclusão de registros.

### 📅 Reservas
- Cadastro de reservas;
- Consulta de reservas;
- Atualização de informações;
- Exclusão de registros.

### 🌐 API
- API REST desenvolvida com FastAPI;
- Organização das rotas por domínio;
- Validação de dados utilizando Pydantic;
- Integração com PostgreSQL através do SQLAlchemy;
- Documentação automática disponibilizada pelo FastAPI;
- Endpoint de verificação de saúde da aplicação.

---

## 🏗️ Arquitetura

A aplicação utiliza uma arquitetura dividida entre frontend, backend e banco de dados.

```text
                    ┌──────────────────────┐
                    │      Frontend        │
                    │   React + Vite       │
                    │ React Bootstrap      │
                    └──────────┬───────────┘
                               │
                               │ HTTP / REST
                               ▼
                    ┌──────────────────────┐
                    │       Backend        │
                    │       FastAPI        │
                    │       Python         │
                    │                      │
                    │ ┌──────────────────┐ │
                    │ │     Routers      │ │
                    │ ├──────────────────┤ │
                    │ │      CRUD        │ │
                    │ ├──────────────────┤ │
                    │ │     Schemas      │ │
                    │ ├──────────────────┤ │
                    │ │      Models      │ │
                    │ └──────────────────┘ │
                    └──────────┬───────────┘
                               │
                               │ SQLAlchemy
                               ▼
                    ┌──────────────────────┐
                    │     PostgreSQL       │
                    │      Database        │
                    └──────────────────────┘
