# CRM PRO — API (Backend)

API REST do CRM PRO. Gerencia autenticação, funis de vendas, projetos (oportunidades), contatos, tarefas e métricas de dashboard.

> Este repositório é um **submódulo** do wrapper de orquestração. Para subir o ambiente completo (API + frontend + banco) via Docker, consulte o README do repositório raiz.

## Especificações técnicas

| Item              | Tecnologia / Valor                          |
|-------------------|---------------------------------------------|
| Linguagem         | TypeScript                                  |
| Framework         | NestJS 11                                   |
| ORM               | Prisma 7 (adapter `@prisma/adapter-pg`)     |
| Banco de dados    | PostgreSQL                                  |
| Autenticação      | JWT (`@nestjs/jwt`) + cookies HttpOnly      |
| Hash de senha     | bcrypt                                      |
| Validação         | `class-validator` + `class-transformer`     |
| Documentação      | Swagger / OpenAPI (`@nestjs/swagger`)       |
| Porta padrão      | `3000`                                      |
| Node              | 20+ recomendado                             |

### Configurações globais (`src/main.ts`)

- **CORS** habilitado para `http://localhost:3001` com `credentials: true`.
- **ValidationPipe global** com `whitelist`, `forbidNonWhitelisted` e `transform` ativos — payloads só aceitam campos declarados nos DTOs.
- **cookie-parser** para leitura de cookies de autenticação.
- **Swagger** disponível em [`/api`](http://localhost:3000/api) com autenticação Bearer.

## Variáveis de ambiente

| Variável        | Descrição                                          |
|-----------------|----------------------------------------------------|
| `DATABASE_URL`  | String de conexão PostgreSQL                        |
| `JWT_SECRET`    | Segredo de assinatura dos tokens JWT                |
| `SECRET_KEY`    | Chave secreta da aplicação                          |
| `PORT`          | Porta do servidor (padrão `3000`)                   |
| `NODE_ENV`      | Ambiente (`development` / `production`)             |

## Modelo de dados (Prisma)

```
Account ──┬─< Funnel ──< Project ──┬─< Contact
          │                        └─< Task ──< SubTask
          └─< Session
```

| Modelo    | Descrição                                                       |
|-----------|-----------------------------------------------------------------|
| `Account` | Usuário/conta. Possui funis, projetos e sessões.                |
| `Session` | Sessão de autenticação (guarda `token_hash` para refresh).      |
| `Funnel`  | Funil de vendas (coluna do kanban). Tem `position` e `color`.   |
| `Project` | Oportunidade/negócio dentro de um funil.                        |
| `Contact` | Contato associado a um projeto.                                 |
| `Task`    | Tarefa de um projeto.                                           |
| `SubTask` | Subtarefa de uma tarefa.                                        |

**Enums:**

- `StatusProject`: `ACTIVE`, `COMPLETED`, `PAUSED`, `CANCELLED`
- `StatusTask`: `PENDING`, `IN_PROGRESS`, `COMPLETED`
- `Priority`: `LOW`, `MEDIUM`, `HIGH`, `URGENT`

## Endpoints

Base URL: `http://localhost:3000`

### Autenticação — `/auth`

| Método | Rota         | Descrição                          |
|--------|--------------|------------------------------------|
| POST   | `/sign-up`   | Cria conta                         |
| POST   | `/sign-in`   | Login (retorna token + cookie)     |
| POST   | `/sign-out`  | Logout                             |
| GET    | `/profile`   | Dados do usuário autenticado       |
| POST   | `/refresh`   | Renova o token de acesso           |

### Funis — `/funnels`

| Método | Rota             | Descrição                          |
|--------|------------------|------------------------------------|
| GET    | `/`              | Lista funis                        |
| GET    | `/:id`           | Detalha um funil                   |
| GET    | `/:id/projects`  | Projetos de um funil               |
| POST   | `/`              | Cria funil                         |
| PUT    | `/:id`           | Atualiza funil                     |
| PATCH  | `/:id/position`  | Reordena funil (drag & drop)       |
| DELETE | `/:id`           | Remove funil                       |

### Projetos — `/projects`

| Método | Rota             | Descrição                          |
|--------|------------------|------------------------------------|
| GET    | `/`              | Lista projetos                     |
| GET    | `/:id`           | Detalha um projeto                 |
| GET    | `/:id/details`   | Projeto com relacionamentos        |
| POST   | `/`              | Cria projeto                       |
| PATCH  | `/:id`           | Atualiza projeto                   |
| PATCH  | `/:id/position`  | Reordena/move entre funis          |
| PATCH  | `/:id/status`    | Altera status                      |
| DELETE | `/:id`           | Remove projeto                     |

### Contatos — `/contacts`

| Método | Rota                    | Descrição                   |
|--------|-------------------------|-----------------------------|
| GET    | `/`                     | Lista contatos              |
| GET    | `/search`               | Busca contatos              |
| GET    | `/projects/:projectId`  | Contatos de um projeto      |
| GET    | `/:id`                  | Detalha contato             |
| POST   | `/`                     | Cria contato                |
| PATCH  | `/:id`                  | Atualiza contato            |
| DELETE | `/:id`                  | Remove contato              |

### Tarefas — `/tasks`

| Método | Rota            | Descrição                           |
|--------|-----------------|-------------------------------------|
| GET    | `/`             | Lista tarefas                       |
| GET    | `/today`        | Tarefas com vencimento hoje         |
| GET    | `/:id`          | Detalha tarefa                      |
| POST   | `/`             | Cria tarefa                         |
| PATCH  | `/:id`          | Atualiza tarefa                     |
| PATCH  | `/:id/status`   | Altera status da tarefa             |
| DELETE | `/:id`          | Remove tarefa                       |

### Dashboard — `/dashboard`

| Método | Rota         | Descrição                              |
|--------|--------------|----------------------------------------|
| GET    | `/overview`  | Métricas e indicadores agregados       |

## Estrutura de pastas

```
src/
├── main.ts              # Bootstrap (CORS, Swagger, ValidationPipe)
├── app.module.ts        # Módulo raiz
├── prisma/              # PrismaService / módulo de acesso ao banco
├── auth/                # Autenticação, guards JWT e DTOs
├── funnel/              # Funis
├── project/             # Projetos
├── contact/             # Contatos
├── task/                # Tarefas
└── dashboard/           # Métricas agregadas
```

Cada módulo de domínio segue o padrão NestJS: `*.controller.ts`, `*.service.ts`, `*.module.ts` e `dto/`.

## Documentação da API (Swagger)

Com o servidor rodando, acesse:

```
http://localhost:3000/api
```
