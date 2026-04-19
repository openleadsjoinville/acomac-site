# Site ACOMAC Joinville

Site institucional + painel administrativo da ACOMAC Joinville.

**Stack**: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma + SQLite · TipTap (editor) · JWT (auth admin).

---

## 🚀 Rodando localmente

Pré-requisitos: Node 22+, npm.

```bash
# 1. Instalar dependências
npm install

# 2. Subir o banco e popular dados iniciais
npx prisma migrate dev
npm run db:seed

# 3. Subir o dev server
npm run dev
```

Site público em `http://localhost:3000`. Painel admin em `http://localhost:3000/admin/login`.

Senha admin padrão: definida em `.env` na variável `ADMIN_PASSWORD`.

### Variáveis de ambiente (`.env`)

```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="defina-uma-senha-forte"
JWT_SECRET="cole-aqui-32-bytes-aleatorios"
```

Gere o `JWT_SECRET` com `openssl rand -hex 32`.

---

## 📦 Estrutura

```
src/
  app/
    (rotas públicas)/      home, sobre, beneficios, cursos, eventos,
                            convenios, contato, conecta-associados,
                            blog, associar
    admin/                  painel administrativo (auth + CRUD)
    api/                    endpoints públicos e admin
  components/               UI compartilhada (Header, Footer, etc.)
  lib/
    content/                schemas Zod + defaults
    auth.ts                 JWT helpers
    db.ts                   Prisma client
prisma/
  schema.prisma             modelos do banco
  migrations/               histórico de migrations
  seed.ts                   seed inicial
  seed-blog.ts              10 posts de exemplo do blog
  *.ts                      scripts pontuais (atualizar stats, telefone, etc.)
```

---

## 🌐 Deploy na VPS Hostinger + CloudPanel

### Pré-requisitos
- VPS Ubuntu 22.04 com **CloudPanel** instalado.
- Domínio apontando para o IP da VPS.
- Acesso SSH como `root`.

### 1. Instalar Node 22 + PM2 (uma vez por servidor)

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
npm install -g pm2
```

### 2. Criar o site no CloudPanel
1. CloudPanel → **+ Add Site** → **Node.js**
2. Domínio: `acomacjoinville.com.br`
3. App port: `3000`
4. Anote o **Site User** criado (ex: `acomac`).

CloudPanel cria o vhost Nginx fazendo proxy de `:80` → `localhost:3000` automaticamente.

### 3. Subir o código

Como o site user (ex: `su - acomac`):

```bash
cd htdocs/acomacjoinville.com.br
git clone https://github.com/SEU-USER/SEU-REPO.git .
mkdir -p /home/acomac/data public/uploads
```

### 4. Configurar `.env` de produção

```bash
nano .env
```

```env
DATABASE_URL="file:/home/acomac/data/prod.db"
ADMIN_PASSWORD="senha-forte-aqui"
JWT_SECRET="hex-de-32-bytes"
NODE_ENV=production
```

> **Importante**: o DB fica fora da pasta do projeto (`/home/acomac/data/prod.db`) pra sobreviver a deploys.

### 5. Primeiro build e start

```bash
npm install --production=false
npx prisma migrate deploy
npm run db:seed       # opcional, popula dados iniciais
npm run build
pm2 start npm --name acomac -- start
pm2 save
pm2 startup systemd   # cole o comando que aparecer
```

### 6. Habilitar SSL
CloudPanel → seu site → **SSL/TLS** → **Install Let's Encrypt Certificate**. Marque renovação automática.

### 7. Deploys subsequentes

```bash
bash deploy.sh
```

O script faz: pull do Git → install → migrate → build → reload PM2.

---

## 🔧 Comandos úteis

```bash
# Banco
npm run db:seed                                       # seed inicial
npm run db:studio                                     # Prisma Studio (UI)
npm run db:migrate                                    # nova migration

# Scripts pontuais (executar com tsx)
./node_modules/.bin/tsx prisma/seed-blog.ts           # 10 posts de exemplo
./node_modules/.bin/tsx prisma/update-stats.ts        # atualizar números das stats
./node_modules/.bin/tsx prisma/clean-fake-phone.ts    # remover telefones fake
./node_modules/.bin/tsx prisma/migrate-whatsapp-ctas.ts # popular CTAs WhatsApp

# PM2
pm2 status              # ver processos
pm2 logs acomac         # logs em tempo real
pm2 reload acomac       # restart sem downtime
pm2 monit               # dashboard CLI
```

---

## 🔒 Backups

Configure um cron diário copiando o DB:

```cron
0 3 * * * cp /home/acomac/data/prod.db /home/acomac/data/backups/prod-$(date +\%Y\%m\%d).db
```

Para algo mais robusto, espelhe pra um bucket S3/Backblaze.

---

## 📈 Migração futura para Postgres

Quando o tráfego crescer, troque o `DATABASE_URL` para Postgres (CloudPanel cria o DB em 1 clique), ajuste `prisma/schema.prisma` (`provider = "postgresql"`), e rode `npx prisma migrate deploy`. Os scripts de seed continuam compatíveis.
