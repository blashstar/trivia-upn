@echo off
echo === Electron Build Script ===
echo.

REM Step 1: Kill blocking processes
echo [1/4] Killing Node and Electron processes...
(call taskkill /F /IM node.exe >nul 2>&1) || rem
(call taskkill /F /IM electron.exe >nul 2>&1) || rem
timeout /t 2 /nobreak >nul

REM Step 2: Clean build directories
echo [2/4] Cleaning build directories...
if exist .output rmdir /s /q .output
if exist .nuxt rmdir /s /q .nuxt
if exist dist rmdir /s /q dist

REM Step 3: Generate Nuxt static files
echo [3/4] Generating Nuxt static files...
set ELECTRON_BUILD=true
call npx nuxt generate
if %errorlevel% neq 0 (
    echo ERROR: Nuxt generate failed!
    exit /b 1
)

REM Step 4: Build Electron installer
echo [4/4] Building Electron installer...
call npx electron-builder --win
if %errorlevel% neq 0 (
    echo ERROR: Electron build failed!
    exit /b 1
)

echo.
echo === Build Complete! ===
echo Installer location: release\