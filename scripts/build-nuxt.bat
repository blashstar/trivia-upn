@echo off
echo === Nuxt Build Script ===
echo.

echo [1/3] Killing Node processes...
(call taskkill /F /IM node.exe >nul 2>&1) || rem
(call taskkill /F /IM electron.exe >nul 2>&1) || rem
timeout /t 1 /nobreak >nul

echo [2/3] Cleaning build directories...
if exist .output rmdir /s /q .output
if exist .nuxt rmdir /s /q .nuxt

echo [3/3] Building Nuxt...
call npx nuxt build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    exit /b 1
)

echo.
echo === Build Complete! ===