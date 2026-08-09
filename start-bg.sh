#!/bin/bash
# Vera Eşarp Node.js Server Runner for cPanel Shared Hosting
PORT=38472

echo "Vera Eşarp Sunucusu Port $PORT üzerinde başlatılıyor..."
fuser -k ${PORT}/tcp 2>/dev/null || pkill -f "server.js" 2>/dev/null
sleep 1

PORT=${PORT} nohup node server.js > server.log 2>&1 &
sleep 2

echo "✅ Port $PORT sunucu durumu:"
head -n 20 server.log
