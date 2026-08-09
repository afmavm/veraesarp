#!/bin/bash
# Vera Eşarp Node.js Server Background Runner for cPanel
echo "Vera Eşarp Sunucusu Arka Planda Yeniden Başlatılıyor..."
fuser -k 3000/tcp 2>/dev/null || pkill -f "next" 2>/dev/null
sleep 1
nohup npm start > server.log 2>&1 &
sleep 2
echo "✅ Port 3000 sunucu arka plan durumu:"
head -n 20 server.log
