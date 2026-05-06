@echo off
echo ===================================
echo    TechLoop - Iniciando...
echo ===================================
echo.

echo [1/2] Instalando dependencias...
cd "%~dp0frontend"
call npm install

echo.
echo [2/2] Iniciando servidor de desarrollo...
echo.
echo Abre tu navegador en: http://localhost:3000
echo.
call npm run dev
pause
