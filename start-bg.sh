#!/bin/bash
# Vera Eşarp Node.js Server Runner for cPanel Shared Hosting
cd "$(dirname "$0")" 2>/dev/null || cd ~/public_html 2>/dev/null

PORT=38472
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=512"

echo "Vera Eşarp Sunucusu Port $PORT üzerinde başlatılıyor..."
pkill -9 -f "server.js" 2>/dev/null
fuser -k -9 ${PORT}/tcp 2>/dev/null
sleep 2

PORT=${PORT} nohup node server.js > server.log 2>&1 &
sleep 3

echo "✅ Port $PORT sunucu durumu:"
head -n 20 server.log
