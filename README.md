# Backend - Vistoria Imobiliária

API em Node.js + Express + PostgreSQL pensada para centralizar vistorias imobiliárias. O projeto já vem configurado com TypeScript, ESLint, Prettier, scripts de desenvolvimento e uma estrutura modular que facilita evoluções futuras.

## Tecnologias principais

- Node.js 20+
- Express 5
- PostgreSQL 16 (driver `pg`)
- Drizzle ORM + migrations SQL
- Multer para uploads
- JWT + bcrypt para autenticação
- Vitest + Supertest para testes
- TypeScript, ESLint e Prettier

## Pré‑requisitos

- Node.js >= 20
- PostgreSQL em execução e acessível

## Configuração

1. **Instale as dependências**

   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente**

   Copie `env.example` para `.env` (o arquivo `.env` já está ignorado por padrão) e ajuste os valores:

   ```bash
   cp env.example .env
   ```

   | Variável        | Descrição                                                                 |
   | --------------- | ------------------------------------------------------------------------- |
   | `PORT`          | Porta do servidor HTTP (padrão `3333`)                                    |
   | `DATABASE_URL`  | String completa do Postgres (ex.: `postgresql://user:pass@host:5432/db`)  |
   | `JWT_SECRET`    | Chave usada para assinar e validar os tokens JWT                          |
   | `JWT_EXPIRES_IN`| Tempo de expiração dos tokens (ex.: `1h`, `7d`)                           |

3. **Execute as migrations**

   ```bash
   npm run migrate
   ```

   As migrations criam todas as tabelas (usuários, imóveis, vistorias e anexos). Certifique-se de que o banco definido em `DATABASE_URL` exista e esteja acessível antes de rodar este comando.

4. **Crie a pasta de uploads (opcional)**

   Já existe uma pasta `uploads/` com `.gitkeep`, mas é possível redefinir o caminho no arquivo `src/config/upload.ts`.

## Scripts disponíveis

| Script            | Descrição                                                     |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Sobe a API com `ts-node-dev` e reload automático              |
| `npm run build`   | Compila o TypeScript para `dist/`                             |
| `npm start`       | Executa o código já compilado                                 |
| `npm run lint`    | Executa ESLint                                                |
| `npm run lint:fix`| Corrige lint automaticamente                                  |
| `npm run typecheck` | Checa os tipos sem emitir arquivos                          |
| `npm run migrate` | Executa as migrations do Drizzle                              |
| `npm run create:test-user` | Cria (ou reaproveita) o usuário admin `admin@test.com` |
| `npm run test`    | Roda os testes unitários e e2e com Vitest + Supertest         |

## Execução do servidor e scripts úteis

### Subir o backend após as migrations

Com o `.env` configurado e o banco migrado, execute:

```bash
npm run dev
```

O servidor ficará disponível em `http://localhost:3333`, servirá os arquivos enviados em `/uploads` e registrará todos os endpoints protegidos pelo middleware de JWT.

### Criar o usuário admin de teste

Use o script dedicado (idempotente) para garantir que o usuário padrão exista. A senha é automaticamente criptografada com bcrypt.

```bash
npm run create:test-user
```

- **E-mail:** `admin@test.com`
- **Senha:** `123456`

### Autenticação e uso do token JWT

1. Faça login via `POST /api/auth/login` enviando `email` e `password`.
2. Pegue o `accessToken` retornado.
3. Envie o cabeçalho `Authorization: Bearer <token>` em qualquer rota protegida (`/api/properties`, `/api/inspections`, `/api/attachments`, etc.).

Exemplo:

```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456"}'

curl http://localhost:3333/api/properties \
  -H "Authorization: Bearer <TOKEN_DO_LOGIN>"
```

### Uploads acessíveis via `/uploads`

- Para enviar anexos utilize `POST /api/inspections/:id/attachments` com `multipart/form-data` e campo `files`.
- Os arquivos são gravados em `uploads/inspections/<inspectionId>/` e podem ser baixados diretamente via `GET /uploads/inspections/<inspectionId>/<arquivo>`.

### Testes automatizados do fluxo completo

`src/tests/e2e/full-flow.spec.ts` cobre registro, login, criação de imóvel, criação de vistoria e upload de anexo. Rode:

```bash
npm run test
```

## Frontend (React + Vite + Tailwind)

O repositório agora traz o diretório `frontend/` com um painel completo em React + Vite + TypeScript. O layout segue inspiração em Vercel/Supabase, utiliza TailwindCSS, React Router, React Query, Axios com interceptors JWT, Sonner para toasts e componentes reutilizáveis (cards, tabelas, formulários, upload com progresso etc.).

### Como rodar

```bash
cd frontend
npm install
npm run dev
```

Configure a variável `VITE_API_URL` (ex.: `http://localhost:3333`) criando um arquivo `.env` na pasta `frontend/`. O token JWT fica salvo no LocalStorage e todas as rotas são protegidas por um `PrivateRoute`.

### Estrutura resumida

```
frontend/src
├── api/              # Axios + services (auth, imóveis, vistorias, anexos)
├── components/       # UI reutilizável, formulários, anexos, feedback
├── contexts/         # Auth + Theme providers
├── hooks/            # Hooks customizados (ex.: useAuth)
├── layouts/          # DashboardLayout com Sidebar/Header
├── pages/            # Login, Dashboard, Imóveis, Vistorias, Perfil
├── routes/           # AppRoutes + PrivateRoute
└── utils/            # Formatadores, storage, constantes
```

Funcionalidades principais: login, dashboard com métricas, CRUD de imóveis, criação/listagem/detalhes de vistorias, upload/remoção de anexos com preview, perfil do usuário e controle de tema claro/escuro.

## Estrutura de pastas

```
src/
├── app.ts                 # Configuração do Express
├── server.ts              # Ponto de entrada do servidor
├── config/                # Variáveis, banco (Drizzle) e upload
├── middlewares/           # Tratamento de erros, auth e 404
├── modules/
│   ├── auth/              # Registro/login + testes
│   ├── users/             # Repositório de usuários
│   ├── properties/        # CRUD de imóveis
│   ├── inspections/       # Vistorias e anexos
│   └── attachments/       # Upload/listagem/remoção de arquivos
├── routes/                # Agrupamento e definição de rotas
├── tests/                 # Cenários e2e com Supertest
└── utils/                 # Utilitários compartilhados
```

## Próximos passos sugeridos

- Monitoramento e observabilidade (ex.: logs estruturados + métricas).
- Cache para consultas frequentes (Redis).
- Versionamento de arquivos em storage externo (S3, GCS, etc.).
- Integração com serviços externos (assinatura digital, notificações).

