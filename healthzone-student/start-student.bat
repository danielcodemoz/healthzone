@echo off
title HealthZone - Student Edition (Offline)
color 0B
cd /d "%~dp0"

set "NODE_EXE=%~dp0runtime\node.exe"

if not exist "%NODE_EXE%" (
    echo.
    echo  ERROR: Portable Node.js not found.
    echo  Expected: runtime\node.exe
    echo.
    echo  Ask your teacher to rebuild the folder using
    echo  create-student-folder.bat on their computer.
    pause
    exit /b 1
)

if not exist "client\dist\index.html" (
    echo.
    echo  ERROR: Application files are missing.
    echo  Make sure you copied the entire healthzone-student folder.
    pause
    exit /b 1
)

if not exist "database" mkdir "database"

if not exist ".env" (
    (
    echo JWT_SECRET=healthzone-student-offline-key
    echo PORT=3001
    echo DB_PATH=../database/health_assistant.db
    ) > ".env"
)

for /f "tokens=2 delims==" %%a in ('findstr /B "PORT=" .env 2^>nul') do set PORT=%%a
if not defined PORT set PORT=3001

echo.
echo  =========================================
echo   HealthZone - Student Edition
echo  =========================================
echo.
echo  No installation required. Works offline.
echo.
echo  Starting server...
echo  Open: http://localhost:%PORT%
echo.
echo  Demo login: demo@healthzone.app / demo123
echo  Press Ctrl+C to stop.
echo.

start "" /min cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:%PORT%"

set NODE_ENV=production
cd /d "%~dp0server"
"%NODE_EXE%" index.js
pause
