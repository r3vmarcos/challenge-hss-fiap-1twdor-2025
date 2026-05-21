@echo off
cd /d "%~dp0"
:menu
cls
echo Health Sync Solutions - Calculadora ROI v6
echo Porta atual: 5196
echo Arquivo env: config\servidor_dev.env
echo [1] Instalar dependencias
echo [2] Rodar projeto
echo [3] Cloudflare
echo [4] Abrir VSCode
echo [0] Sair
set /p opcao=Escolha: 
if "%opcao%"=="1" call z_npm_install.bat
if "%opcao%"=="2" call z_run_dev.bat
if "%opcao%"=="3" call bats\Cloudflare\Opcoes_Cloudflare.bat
if "%opcao%"=="4" call z_bat_vscode.bat
if "%opcao%"=="0" exit /b
goto menu
