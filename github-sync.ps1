# GitHub Senkronizasyon ve Veri Çekme Senaryosu (GitHub Pull & Push Helper)
param (
    [string]$RepoUrl = "",
    [string]$Branch = "main"
)

Write-Host "================================================" -ForegroundColor Gold
Write-Host "  VERA EŞARP — GitHub Veri & Kod Senkronizasyonu " -ForegroundColor Gold
Write-Host "================================================" -ForegroundColor Gold

# Check if git repository is initialized
if (-not (Test-Path ".git")) {
    Write-Host "[1/4] Git deposu ilklendiriliyor..." -ForegroundColor Cyan
    git init
}

# Set git branch to main/master
Write-Host "[2/4] Dal (Branch) adı ayarlanıyor ($Branch)..." -ForegroundColor Cyan
git branch -M $Branch

# Remote URL Check
$existingRemote = git remote get-url origin 2>$null
if (-not $existingRemote -and $RepoUrl -ne "") {
    Write-Host "[3/4] Remote GitHub adresi ekleniyor: $RepoUrl" -ForegroundColor Green
    git remote add origin $RepoUrl
} elseif ($existingRemote) {
    Write-Host "[3/4] Mevcut GitHub Remote adresi: $existingRemote" -ForegroundColor Green
} else {
    Write-Host "[3/4] Remote adres belirlenmedi. 'git remote add origin <GITHUB_URL>' ile ekleyebilirsiniz." -ForegroundColor Yellow
}

# Pull latest changes if remote exists
if ($existingRemote -or $RepoUrl -ne "") {
    Write-Host "[4/4] GitHub'dan en son değişiklikler çekiliyor (git pull)..." -ForegroundColor Cyan
    git pull origin $Branch --rebase 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ GitHub verileri ve kodlar başarıyla güncellendi!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Remote dal henüz mevcut olmayabilir veya ilklendirilmeyi bekliyor." -ForegroundColor Yellow
    }
}

Write-Host "`nİşlem tamamlandı!" -ForegroundColor Gold
