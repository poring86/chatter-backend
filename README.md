# 💬 Chatter Backend

[![Nest Logo](https://img.shields.io/badge/NestJS-4C5A96?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/@nestjs/core.svg)](https://github.com/poring86/chatter-backend/blob/master/LICENSE)

## 🌟 Visão Geral do Projeto

Este repositório contém o **backend** robusto e escalável para a aplicação de chat em tempo real **Chatter**. Ele gerencia toda a lógica de negócio, a persistência de dados no MongoDB e a comunicação em tempo real via WebSockets.

O projeto faz parte de uma arquitetura Full Stack que se conecta com o frontend:
👉 **[chatter-ui](https://github.com/poring86/chatter-ui)** (Interface de usuário construída com React e TypeScript).

---

## 🏛️ Funcionamento Detalhado da Aplicação

### 1. Sistema de Persistência (Mongoose & MongoDB)

O projeto utiliza o **Mongoose** como ODM (Object Data Modeling) para interagir com o banco de dados **MongoDB**. Isso permite modelar esquemas de dados de forma organizada, utilizando recursos como _Aggregation Pipelines_ para consultas complexas (evidenciado no código do `ChatsService`).

#### Estrutura de Modelos Chave

| Modelo (Entidade) | Descrição                                                    | Relações Chave                                                  |
| :---------------- | :----------------------------------------------------------- | :-------------------------------------------------------------- |
| **User**          | Armazena dados do usuário (ID, nome de usuário, senha hash). | Relacionado a **Message** (autor)                               |
| **Message**       | Armazena o conteúdo, autor e timestamp de cada mensagem.     | Relacionado a **User** (autor)                                  |
| **Chat/Room**     | Gerencia as conversas ou salas de chat.                      | Contém referências/subdocumentos para **Messages** e **Users**. |

### 2. Autenticação (JWT)

A autenticação é baseada em JWT (JSON Web Token), implementada com **Passport.js** no NestJS. O JWT é obrigatório para acessar rotas REST protegidas e essencial para a conexão WebSocket.

### 3. Comunicação em Tempo Real (WebSockets)

A funcionalidade de chat em tempo real é fornecida por um **Gateway WebSocket** NestJS.

| Fluxo       | Evento Principal | Descrição do Processo                                                                                                                   |
| :---------- | :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **Conexão** | `connection`     | O backend realiza a validação do JWT enviado pelo cliente antes de estabelecer a conexão persistente.                                   |
| **Envio**   | `message:send`   | O Gateway salva a mensagem no MongoDB e utiliza _broadcasting_ para retransmiti-la imediatamente para todos os clientes ativos na sala. |
| **Status**  | `user:status`    | Notificação em tempo real sobre usuários entrando ou saindo da sala de chat.                                                            |

## 🚀 Stack de Tecnologia

| Categoria           | Tecnologia            | Detalhes                                              |
| :------------------ | :-------------------- | :---------------------------------------------------- |
| **Framework**       | **NestJS**            | Padrão modular e arquitetura escalável.               |
| **Banco de Dados**  | **MongoDB**           | NoSQL de alta performance.                            |
| **ORM/ODM**         | **Mongoose**          | Camada de modelagem de dados e esquemas para MongoDB. |
| **Containerização** | **Docker**            | Isolamento e portabilidade do ambiente de execução.   |
| **Linguagem**       | **TypeScript**        | Forte tipagem.                                        |
| **Auth**            | **Passport.js (JWT)** | Estratégias de autenticação.                          |
| **Comunicação**     | **WebSockets**        | Comunicação bidirecional em tempo real.               |
| **Gerenciador**     | **pnpm**              |                                                       |

---

## ⚙️ Instruções de Setup

Para rodar a aplicação Full Stack, você precisa ter o backend e o frontend em execução.

### 🛠️ Pré-requisitos

- **Docker** e **Docker Compose** (Opção preferencial para ambiente completo)
- **Node.js** (v18+), **pnpm** e **Yarn** (Opção manual)

### 1. Configurar o Backend com pnpm (Desenvolvimento Local)

Esta opção é ideal se você deseja rodar o backend localmente com _hot reload_ e seu banco de dados (MongoDB) já está instalado e acessível.

1.  **Clonar e Instalar Dependências:**
    ```bash
    git clone [https://github.com/poring86/chatter-backend.git](https://github.com/poring86/chatter-backend.git)
    cd chatter-backend
    pnpm install
    ```
2.  **Configurar Variáveis de Ambiente (`.env`):**
    Crie o arquivo `.env` na raiz. A porta `3001` é recomendada para evitar conflito com o frontend (porta `3000`).

    ```bash
    # .env file
    PORT=3001
    DATABASE_URL="mongodb://localhost:27017/chatterdb"
    JWT_SECRET="sua_chave_secreta_aqui"
    ```

3.  **Iniciar o Backend (com Hot Reload):**
    ```bash
    pnpm run start:dev
    # Servidor rodando em http://localhost:3001
    ```

### 2. Configurar o Backend com Docker Compose (Ambiente Isolado)

Use o Docker para construir e rodar o servidor, idealmente junto com o container do MongoDB.

1.  **Clonar e Configurar `.env`** (passos 1 e 2 da seção anterior).
2.  **Construir e Iniciar os Containers:**
    ```bash
    docker-compose up --build
    # O backend estará disponível em http://localhost:3001
    ```

### 3. Configurar e Iniciar o Frontend (chatter-ui)

1.  **Clonar e Instalar (em outro terminal):**
    ```bash
    cd ..
    git clone [https://github.com/poring86/chatter-ui.git](https://github.com/poring86/chatter-ui.git)
    cd chatter-ui
    yarn install
    ```
2.  **Configurar Conexão no Frontend:**
    Certifique-se de que o frontend está apontando para a porta `3001` do backend.

    ```bash
    # Exemplo de configuração de variáveis de ambiente no frontend (geralmente .env.local)
    REACT_APP_API_URL=http://localhost:3001
    REACT_APP_WS_URL=ws://localhost:3001/chat
    ```

3.  **Iniciar o Frontend:**
    ```bash
    yarn start
    # Frontend rodando em http://localhost:3000
    ```

## 🤝 Contribuições

Contribuições, sugestões e relatórios de bugs são sempre bem-vindos.

## 📄 Licença

Este projeto está sob a licença [MIT](https://github.com/poring86/chatter-backend/blob/master/LICENSE).
