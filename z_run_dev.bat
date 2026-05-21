@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
set "HOST=localhost"
set "PORTA=5196"
if exist "config\servidor_dev.env" (
  for /f "usebackq tokens=1,2 delims==" %%A in ("config\servidor_dev.env") do (
    if /i "%%A"=="HOST" set "HOST=%%B"
    if /i "%%A"=="PORTA" set "PORTA=%%B"
  )
)
echo Rodando em http://%HOST%:%PORTA%/
npx vite --host %HOST% --port %PORTA% --strictPort --open
pause
