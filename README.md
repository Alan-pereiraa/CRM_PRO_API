# CRM Pro API

API base construída com NestJS para servir como ponto de partida do projeto CRM Pro.

## Descrição

O projeto atualmente expõe uma rota raiz simples que retorna `Hello World!`.

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
