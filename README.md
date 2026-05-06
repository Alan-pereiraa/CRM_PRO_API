# CRM Pro API

API base construída com NestJS para servir como ponto de partida do projeto CRM Pro.

## Descrição

O projeto atualmente expõe uma rota raiz simples que retorna `Hello World!`.

Autenticação:

POST /auth/register -> 201. Retorna { user: PublicAccount, token: string }. O usuário público vem de account.ts:1.
POST /auth/login -> 200. Retorna { user: PublicAccount, token: string }.
GET /auth/me -> 200. Retorna { user: PublicAccount } ou 401 se não autenticado.
POST /auth/logout -> 204, ou 200 com { success: true }.
Dashboard:

GET /dashboard/overview?accountId=... -> 200. Retorna { stats: StatCard[], funnel: { stages: FunnelStage[], growthPercent: number }, todayTasks: { tasks: Task[], pendingCount: number } }. O formato está em dashboard.ts:1 e o serviço atual em dashboardService.ts:1.
Funis:

GET /funnels?accountId=... -> 200. Retorna Funnel[] ordenado por position.
GET /funnels/:id -> 200. Retorna Funnel ou 404.
POST /funnels -> 201. Entra { name, color, accountId } e sai o Funnel criado.
PATCH /funnels/:id -> 200. Retorna o Funnel atualizado, aceitando name e/ou color.
PATCH /funnels/reorder -> 204. Entrada: orderedIds: string[].
Opcional: DELETE /funnels/:id -> 204, se você quiser permitir exclusão.
Projetos:

GET /projects?accountId=... -> 200. Retorna Project[].
GET /projects/:id -> 200. Retorna Project ou 404.
GET /funnels/:funnelId/projects -> 200. Retorna Project[] daquela coluna/funil.
GET /projects/:id/details -> 200. Retorna { project: Project, tasks: Task[] }.
POST /projects -> 201. Entrada: CreateProjectInput + accountId implícito pela sessão; retorno: Project.
PATCH /projects/:id -> 200. Retorna Project atualizado.
PATCH /projects/:id/move -> 200. Entrada: { funnelId, position }; retorno: Project movido.
PATCH /projects/reorder -> 204. Entrada: [{ id, funnelId, position }].
DELETE /projects/:id -> 204.
Tarefas:

GET /tasks?accountId=... -> 200. Retorna Task[].
GET /projects/:projectId/tasks -> 200. Retorna Task[] do projeto.
POST /tasks -> 201. Entrada: dados da tarefa sem id, createdAt, updatedAt e completedAt; retorno: Task.
PATCH /tasks/:id -> 200. Retorna Task atualizada.
PATCH /tasks/:id/status -> 200. Entrada: { status: "pending" | "in_progress" | "completed" }; retorno: Task.
Opcional: DELETE /tasks/:id -> 204.
Contatos:

GET /contacts?projectId=... -> 200. Retorna Contact[].
POST /contacts -> 201. Entrada: CreateContactInput; retorno: Contact.
PATCH /contacts/:id -> 200. Retorna Contact atualizado.
DELETE /contacts/:id -> 204

## Requisitos

- Node.js 18 ou superior
- npm

## Instalação

```bash
npm install
```

## Execução

```bash
# desenvolvimento
npm run start:dev

# produção
npm run build
npm run start:prod
```

## Testes

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## Estrutura básica

- `src/main.ts`: inicialização da aplicação
- `src/app.module.ts`: módulo raiz
- `src/app.controller.ts`: rota principal
- `src/app.service.ts`: serviço com a resposta padrão

## Documentação

- [Modelagem do projeto](documents/modelagem.md)

## Licença

Projeto privado, sem licença definida.
