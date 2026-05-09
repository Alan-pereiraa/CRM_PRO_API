# CRM Pro API

API backend do CRM Pro desenvolvida com NestJS, Prisma e PostgreSQL.

## Visão geral

Esta API centraliza a operação de um CRM com foco em organização comercial e acompanhamento de pipeline. Ela oferece:

- Autenticação com JWT e sessão via refresh token em cookie httpOnly
- Cadastro, login, logout, renovação de token e consulta de perfil
- Dashboard com visão geral dos dados principais
- Gestão de funis de vendas
- Gestão de projetos vinculados a funis
- Gestão de tarefas vinculadas a projetos
- Gestão de contatos vinculados a projetos
- Documentação automática via Swagger
- Validação de entrada com class-validator e ValidationPipe global

## Funcionalidades

### Autenticação

- `POST /auth/sign-up` cria uma nova conta
- `POST /auth/sign-in` autentica o usuário
- `POST /auth/sign-out` encerra a sessão atual
- `GET /auth/profile` retorna os dados do usuário autenticado
- `POST /auth/refresh` gera um novo access token usando o refresh token

### Dashboard

- `GET /dashboard/overview` retorna os indicadores principais da conta autenticada

### Funis

- `GET /funnels` lista os funis da conta
- `GET /funnels/:id` busca um funil por id
- `GET /funnels/:id/projects` lista os projetos de um funil
- `POST /funnels` cria um novo funil
- `PUT /funnels/:id` atualiza um funil
- `PATCH /funnels/:id/position` atualiza a posição do funil
- `DELETE /funnels/:id` remove um funil

### Projetos

- `GET /projects` lista os projetos da conta
- `GET /projects/:id` busca um projeto por id
- `GET /projects/:id/details` retorna detalhes do projeto com funil, tarefas e contatos
- `POST /projects` cria um novo projeto
- `PATCH /projects/:id` atualiza um projeto
- `PATCH /projects/:id/position` atualiza a posição do projeto
- `PATCH /projects/:id/status` atualiza o status do projeto
- `DELETE /projects/:id` remove um projeto

### Tarefas

- `GET /tasks` lista as tarefas da conta
- `GET /tasks/today` lista as tarefas de hoje
- `GET /tasks/:id` busca uma tarefa por id
- `POST /tasks` cria uma nova tarefa
- `PATCH /tasks/:id` atualiza uma tarefa
- `PATCH /tasks/:id/status` atualiza apenas o status da tarefa
- `DELETE /tasks/:id` remove uma tarefa

### Contatos

- `GET /contacts` lista os contatos da conta
- `GET /contacts/search?q=...` pesquisa contatos por nome, e-mail ou telefone
- `GET /contacts/projects/:projectId` lista contatos de um projeto
- `GET /contacts/:id` busca um contato por id
- `POST /contacts` cria um novo contato
- `PATCH /contacts/:id` atualiza um contato
- `DELETE /contacts/:id` remove um contato

## Requisitos

- Node.js 18 ou superior
- npm
- PostgreSQL

## Variáveis de ambiente

O projeto utiliza as seguintes variáveis:

- `DATABASE_URL` conexão com o banco PostgreSQL
- `SECRET_KEY` chave usada na assinatura dos tokens JWT
- `PORT` porta da aplicação, opcional

Exemplo de arquivo `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/crm_pro"
SECRET_KEY="your-secret-key"
PORT=3000
```

## Instalação

```bash
npm install
```

## Banco de dados

Gere o client do Prisma e aplique as migrations de desenvolvimento:

```bash
npm run prisma:generate
npm run migrate
```

Se quiser apenas aplicar migrations em ambiente de teste:

```bash
npm run test:migrate
```

## Execução

```bash
# desenvolvimento
npm run start:dev

# build
npm run build

# produção
npm run start:prod
```

A API sobe por padrão em `http://localhost:3000`, ou na porta definida em `PORT`.

## Swagger

A documentação interativa fica disponível em:

```text
http://localhost:3000/api
```

No Swagger você encontra:

- descrição dos endpoints
- schemas dos DTOs
- parâmetros de rota e query
- autenticação via Bearer token

Para testar rotas protegidas, use o botão `Authorize` e informe o access token gerado no login.

## Autenticação e fluxo de uso

1. Crie uma conta com `POST /auth/sign-up`.
2. Faça login em `POST /auth/sign-in`.
3. Use o `accessToken` no header `Authorization: Bearer <token>`.
4. O refresh token é mantido em cookie httpOnly para renovar a sessão.
5. Para testar via Swagger, clique em `Authorize` e cole o bearer token.

## Testes

```bash
npm run test
npm run test:cov
npm run test:e2e
```

## Estrutura principal

- `src/main.ts`: bootstrap da aplicação e configuração do Swagger
- `src/app.module.ts`: módulo raiz
- `src/auth`: autenticação e sessões
- `src/dashboard`: indicadores da conta
- `src/funnel`: funis de vendas
- `src/project`: projetos
- `src/task`: tarefas
- `src/contact`: contatos
- `src/prisma`: integração com Prisma
- `prisma/schema.prisma`: schema do banco

## Observações

- Os campos sensíveis ou formatados, como telefone, são normalizados antes de persistir no banco.
- Os DTOs usam validação e metadados do Swagger para documentação automática.
- A rota raiz `/` não faz parte da API; a documentação fica em `/api`.

## Documentação adicional

- [Modelagem do projeto](documents/modelagem.md)

## Licença

Projeto privado, sem licença definida.
