#!/usr/bin/env bash
# Deploy script para a VPS Hostinger / CloudPanel.
# Uso (no servidor, dentro da pasta do projeto): bash deploy.sh

set -euo pipefail

APP_NAME="acomac"

echo "▶ Pull do Git..."
git pull --ff-only

echo "▶ Instalando dependências..."
npm install --production=false

echo "▶ Aplicando migrations..."
npx prisma migrate deploy

echo "▶ Gerando build de produção..."
npm run build

echo "▶ Recarregando PM2 ($APP_NAME)..."
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 reload "$APP_NAME" --update-env
else
  pm2 start npm --name "$APP_NAME" -- start
  pm2 save
fi

echo "✅ Deploy concluído. pm2 status:"
pm2 status "$APP_NAME" || true
