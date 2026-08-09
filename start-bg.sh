#!/bin/bash
# Vera Eşarp Node.js Server Standalone Runner for cPanel
echo "Vera Eşarp Standalone Sunucusu Başlatılıyor..."
fuser -k 3000/tcp 2>/dev/null || pkill -f "node" 2>/dev/null
sleep 1

# Copy public and static assets to standalone folder
cp -rn public .next/standalone/ 2>/dev/null
cp -rn .next/static .next/standalone/.next/ 2>/dev/null

PORT=3000 nohup node .next/standalone/server.js > server.log 2>&1 &
sleep 2

echo "✅ Sunucu Başlatma Durumu:"
head -n 20 server.log
