# 💬 Chatter Backend

[![Nest Logo](https://img.shields.io/badge/NestJS-4C5A96?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/@nestjs/core.svg)](https://github.com/poring86/chatter-backend/blob/master/LICENSE)

## 🌟 Visão Geral do Projeto

Este repositório contém o **backend** robusto e escalável para a aplicação de chat em tempo real **Chatter**. Ele gerencia toda a lógica de negócio, a persistência de dados no MongoDB e a comunicação em tempo real via WebSockets.

👉 **[chatter-ui](https://github.com/poring86/chatter-ui)** (Interface de usuário construída com React e TypeScript).

---

### 📸 Preview da Aplicação

![Interface do Chatter](image.png)

---

## 🏛️ Funcionamento Detalhado

### 1. Sistema de Persistência (Mongoose & MongoDB)

O projeto utiliza o **Mongoose** como ODM para interagir com o **MongoDB**, permitindo modelagem de dados organizada e consultas complexas via _Aggregation Pipelines_.

### 2. Autenticação e Tempo Real

- **JWT**: Autenticação segura via cookies `httpOnly`.
- **WebSockets**: Gateway NestJS para comunicação bidirecional e eventos de status de usuário.

---

## 🚀 Stack de Tecnologia

| Categoria          | Tecnologia     |
| :----------------- | :------------- |
| **Framework**      | **NestJS**     |
| **Banco de Dados** | **MongoDB**    |
| **ORM/ODM**        | **Mongoose**   |
| **Container**      | **Docker**     |
| **Linguagem**      | **TypeScript** |
| **Gerenciador**    | **pnpm / npm** |

---

## ⚙️ Instruções de Setup (Docker)

A forma recomendada de rodar o ambiente de desenvolvimento é utilizando Docker para garantir o isolamento dos serviços.

### **1. Iniciar os Containers**

Suba os serviços (API e Banco de Dados) em modo _background_:

```bash
docker-compose up -d

# Acessar o terminal do container 'app'
docker exec -it app sh

# Dentro do container, instale as dependências (se necessário) e inicie o servidor
pnpm install
pnpm run start:dev
```
