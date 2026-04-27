# build-electron.ps1 — Clean build script for Electron + Nuxt
# Usage: .\scripts\build-electron.ps1

Write-Host "=== Electron Build Script ===" -ForegroundColor Cyan

# Step 1: Kill blocking processes
Write-Host "`n[1/4] Killing Node and Electron processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null | Out-Null
taskkill /F /IM electron.exe 2>$null | Out-Null
Start-Sleep -Seconds 2

# Step 2: Clean build directories
Write-Host "[2/4] Cleaning build directories..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .output -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .nuxt -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# Step 3: Generate Nuxt static files
Write-Host "[3/4] Generating Nuxt static files..." -ForegroundColor Yellow
$env:ELECTRON_BUILD = "true"
npx nuxt generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Nuxt generate failed!" -ForegroundColor Red
    exit 1
}

# Step 4: Build Electron installer
Write-Host "[4/4] Building Electron installer..." -ForegroundColor Yellow
npx electron-builder --win
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Electron build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Build Complete! ===" -ForegroundColor Green
Write-Host "Installer location: release\" -ForegroundColor Green