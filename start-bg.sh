#!/bin/bash
# Vera Eşarp Node.js Server Background Runner for cPanel
echo "Vera Eşarp Sunucusu Arka Planda Başlatılıyor..."
pkill -f "next-server" 2>/dev/null
nohup npm start > server.log 2>&1 &
echo "✅ Sunucu Port 3000 üzerinde arka planda çalışmaya başladı!"
