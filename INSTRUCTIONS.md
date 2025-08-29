# 🚀 API - Departamento de Polícia

Documentação completa sobre como configurar, executar e utilizar a API do projeto Departamento de Polícia.

---

## 📋 Índice

- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#️-configuração)
- [Executando a Aplicação](#-executando-a-aplicação)
- [Documentação da API](#-documentação-da-api)
  - [Autenticação](#-autenticação)
  - [Autenticação e Usuários](#-autenticação-e-usuários)
  - [Agentes](#-agentes)
  - [Casos](#-casos)

---

## 🔧 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:

- **[Node.js](https://nodejs.org/en/)** (versão 18.x ou superior)
- **[NPM](https://www.npmjs.com/)**
- **[Git](https://git-scm.com/)**
- Um banco de dados como **[PostgreSQL](https://www.postgresql.org/)**

---

## 💻 Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/wt-journey-backend-01/wt-journey-backend-01-etapa-4-fonteBean.git
    ```

2.  **Instale as dependências:**
    ```bash
    npm install bcryptjs dotenv express jsonwebtoken knex pg zod
    ```

---

## ⚙️ Configuração

As variáveis de ambiente são essenciais para a execução da API.

1.  **Crie o arquivo de ambiente:**
    Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`.

    ```bash
    cp .env.example .env
    ```

2.  **Configure as variáveis:**
    Abra o arquivo `.env` e preencha com as suas credenciais e configurações.

    ```env
    # Porta da aplicação
    PORT=3000

    # Configuração do Banco de Dados
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=seu_usuario
    DB_PASSWORD=sua_senha
    DB_NAME=nome_do_banco

    # Chave secreta para JWT
    JWT_SECRET=sua_chave_secreta_super_segura
    JWT_EXPIRES_IN=1d
    ```

3.  **Execute as migrações do banco (se aplicável):**
    ```bash
    npm run setup
    ```

---

## ▶️ Executando a Aplicação

Use os seguintes comandos para iniciar o servidor:

- **Modo de Desenvolvimento** (com hot-reload):

  ```bash
  npm run dev
  ```

- **Modo de Produção:**
  ```bash
  npm start
  ```

Após iniciar, a API estará disponível em `http://localhost:3000` (ou na porta que você configurou).

---

## 📚 Documentação da API

### 🔒 Autenticação

Diversas rotas nesta API são protegidas e exigem autenticação para serem acessadas. A autenticação é feita através de um **JSON Web Token (JWT)**.

#### Como se Autenticar

1.  **Obtenha o Token:** Primeiro, faça uma requisição para o endpoint `POST /login` com um email e senha válidos. A resposta de sucesso conterá um `access_token`.

2.  **Envie o Token:** Para acessar rotas protegidas, você deve incluir o token obtido no cabeçalho (**Header**) `Authorization` de cada requisição, utilizando o esquema `Bearer`.

- **Formato do Cabeçalho:**
  `Authorization: Bearer <seu_token_jwt>`

- **Exemplo prático com cURL:**

  ```bash
  curl -X GET http://localhost:3000/usuarios/me \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  ```

#### Respostas de Erro de Autenticação

Se o token não for fornecido corretamente ou for inválido, você receberá uma das seguintes respostas de erro com o status `401 Unauthorized`:

| Mensagem de Erro   | Causa                                                                                               |
| :----------------- | :-------------------------------------------------------------------------------------------------- |
| `Token Necessario` | A requisição foi feita sem o cabeçalho `Authorization` ou o token não foi incluído após o `Bearer`. |
| `Token invalido`   | O token fornecido está expirado, malformado ou não é válido por algum outro motivo.                 |

---

### 🔑 Autenticação e Usuários

Endpoints para criar, autenticar e gerenciar usuários. Rotas marcadas com 🔒 requerem autenticação.

#### `POST /register`

Cria um novo usuário no sistema.

- **Corpo da Requisição (Request Body):**

  ```json
  {
    "nome": "Seu Nome Completo",
    "email": "usuario@exemplo.com",
    "senha": "Senha@123"
  }
  ```

  | Campo   | Tipo   | Descrição                                                                                                                                                                                                                                                           |
  | :------ | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
  | `nome`  | string | **Obrigatório.** Nome do usuário.                                                                                                                                                                                                                                   |
  | `email` | string | **Obrigatório.** Deve ser um email válido e único.                                                                                                                                                                                                                  |
  | `senha` | string | **Obrigatório.** Deve atender aos seguintes critérios:<br>- Mínimo de 8 caracteres<br>- Pelo menos uma letra minúscula (`a-z`)<br>- Pelo menos uma letra maiúscula (`A-Z`)<br>- Pelo menos um número (`0-9`)<br>- Pelo menos um caractere especial (ex: `!@#$%^&*`) |

- **Resposta de Sucesso (`201 Created`):**

  ```json
  {
    "user": {
      "id": 1,
      "nome": "Seu Nome Completo",
      "email": "usuario@exemplo.com",
      "criado_em": "2025-08-29T14:45:00.000Z"
    }
  }
  ```

---

#### `POST /login`

Autentica um usuário existente e retorna um token de acesso JWT.

- **Corpo da Requisição (Request Body):**

  ```json
  {
    "email": "usuario@exemplo.com",
    "senha": "Senha@123"
  }
  ```

- **Resposta de Sucesso (`200 OK`):**

  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

---

#### `GET /usuarios/me` 🔒

Retorna as informações do usuário que está atualmente autenticado.

- **Resposta de Sucesso (`200 OK`):**

  ```json
  {
    "id": 1,
    "nome": "Seu Nome Completo",
    "email": "usuario@exemplo.com",
    "senha": "$2b$10$...",
    "criado_em": "2025-08-29T14:45:00.000Z"
  }
  ```

---

#### `GET /usuarios` 🔒

Retorna uma lista com todos os usuários cadastrados no sistema.

- **Resposta de Sucesso (`200 OK`):**

  ```json
  [
    {
      "id": 1,
      "nome": "Usuário Um",
      "email": "um@exemplo.com",
      "criado_em": "2025-08-28T10:00:00.000Z"
    }
  ]
  ```

---

#### `DELETE /users/:id` 🔒

Deleta um usuário específico pelo seu ID.

- **Parâmetro de URL:** `id` (integer, obrigatório).
- **Resposta de Sucesso (`204 No Content`):** Nenhum corpo de resposta.

---

#### `POST /logout` 🔒

Realiza o logout do usuário.

- **Resposta de Sucesso (`204 No Content`):** Nenhum corpo de resposta.

---

### 👮 Agentes

Endpoints para gerenciar os agentes da organização. Rotas marcadas com 🔒 requerem autenticação.

#### `GET /agentes`

Lista todos os agentes. Permite filtrar por cargo e ordenar os resultados.

- **Parâmetros de Query:** `cargo` (string, opcional), `sort` (string, opcional).

- **Resposta de Sucesso (`200 OK`):**

  ```json
  [
    {
      "id": 1,
      "nome": "Agente Ana Silva",
      "cargo": "Investigadora Chefe",
      "dataDeIncorporacao": "2020-05-15"
    }
  ]
  ```

---

#### `GET /agentes/:id`

Busca um agente específico pelo seu ID.

- **Parâmetro de URL:** `id` (integer, obrigatório).
- **Resposta de Sucesso (`200 OK`):** Retorna o objeto do agente.

---

#### `POST /agentes` 🔒

Cria um novo agente.

- **Corpo da Requisição:** `nome` (string), `cargo` (string), `dataDeIncorporacao` (string `YYYY-MM-DD`). Todos obrigatórios.
- **Resposta de Sucesso (`201 Created`):** Retorna o agente recém-criado.

---

#### `PUT /agentes/:id` 🔒

Atualiza **todos** os dados de um agente.

- **Parâmetro de URL:** `id` (integer, obrigatório).
- **Corpo da Requisição:** `nome`, `cargo`, `dataDeIncorporacao`. Todos obrigatórios.
- **Resposta de Sucesso (`200 OK`):** Retorna o objeto do agente atualizado.

---

#### `PATCH /agentes/:id` 🔒

Atualiza **parcialmente** os dados de um agente.

- **Parâmetro de URL:** `id` (integer, obrigatório).
- **Corpo da Requisição:** `nome`, `cargo`, ou `dataDeIncorporacao`. Pelo menos um é necessário.
- **Resposta de Sucesso (`200 OK`):** Retorna o objeto do agente atualizado.

---

#### `DELETE /agentes/:id` 🔒

Deleta um agente específico pelo seu ID.

- **Parâmetro de URL:** `id` (integer, obrigatório).
- **Resposta de Sucesso (`204 No Content`):** Nenhum corpo de resposta.

---

### 📂 Casos

Endpoints para gerenciar os casos de investigação. Rotas marcadas com 🔒 requerem autenticação.

#### `GET /casos`

Lista todos os casos. Permite filtrar por status e por agente.

- **Parâmetros de Query:** `status` (string 'aberto' ou 'solucionado'), `agente_id` (number). Ambos opcionais.
- **Resposta de Sucesso (`200 OK`):** Retorna uma lista de casos.

---

#### `GET /casos/search`

Busca casos por uma palavra-chave.

- **Parâmetro de Query:** `q` (string, obrigatório).
- **Resposta de Sucesso (`200 OK`):** Retorna uma lista de casos que correspondem à busca.

---

#### `GET /casos/:id`

Busca um caso específico pelo seu ID.

- **Parâmetro de URL:** `id` (integer, obrigatório).
- **Resposta de Sucesso (`200 OK`):** Retorna o objeto do caso.

---

#### `GET /casos/:id/agente`

Busca o agente responsável por um caso específico.

- **Parâmetro de URL:** `id` (integer, obrigatório).
- **Resposta de Sucesso (`200 OK`):** Retorna o objeto do agente.

---

#### `POST /casos` 🔒

Cria um novo caso.

- **Corpo da Requisição:** `titulo`, `descricao`, `status`, `agente_id`. Todos obrigatórios.
- **Resposta de Sucesso (`201 Created`):** Retorna o caso recém-criado.

---

#### `PUT /casos/:id` 🔒

Atualiza **todos** os dados de um caso.

- **Parâmetro de URL:** `id` (integer, obrigatório).
- **Corpo da Requisição:** `titulo`, `descricao`, `status`, `agente_id`. Todos obrigatórios.
- **Resposta de Sucesso (`200 OK`):** Retorna o objeto do caso atualizado.

---

#### `PATCH /casos/:id` 🔒

Atualiza **parcialmente** os dados de um caso.

- **Parâmetro de URL:** `id` (integer, obrigatório).
- **Corpo da Requisição:** Pelo menos um entre `titulo`, `descricao`, `status`, `agente_id`.
- **Resposta de Sucesso (`200 OK`):** Retorna o objeto do caso atualizado.

---

#### `DELETE /casos/:id` 🔒

Deleta um caso específico pelo seu ID.

- **Parâmetro de URL:** `id` (integer, obrigatório).
- **Resposta de Sucesso (`204 No Content`):** Nenhum corpo de resposta.
