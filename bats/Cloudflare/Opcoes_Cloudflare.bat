@echo off
cd /d "%~dp0\..\.."
:menu_cloudflare
cls
echo Health Sync Solutions - Cloudflare
echo [1] Instalar Wrangler
echo [2] Login Cloudflare
echo [3] Criar banco D1 hss_roi_db
echo [4] Aplicar migrations local
echo [5] Aplicar migrations remoto
echo [6] Build
echo [7] Deploy Pages
echo [0] Voltar
set /p opcao=Escolha: 
if "%opcao%"=="1" npm install -D wrangler
if "%opcao%"=="2" npx wrangler login
if "%opcao%"=="3" npx wrangler d1 create hss_roi_db
if "%opcao%"=="4" npx wrangler d1 migrations apply hss_roi_db --local
if "%opcao%"=="5" npx wrangler d1 migrations apply hss_roi_db --remote
if "%opcao%"=="6" npm run build
if "%opcao%"=="7" npx wrangler pages deploy dist
if "%opcao%"=="0" exit /b
pause
goto menu_cloudflare
