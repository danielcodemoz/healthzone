@echo off
title HealthZone - Personal Health Assistant
color 0B
echo.
echo  =========================================
echo   HealthZone - Personal Health Assistant
echo  =========================================
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo  [1/2] Installing dependencies...
    call npm install
    echo.
)

echo  Starting HealthZone servers...
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:3005
echo.
echo  The browser will open automatically.
echo  Press Ctrl+C to stop the servers.
echo.

REM Open browser maximized after a short delay (runs in background)
start "" /min cmd /c "timeout /t 5 /nobreak >nul && start /max http://localhost:5173"

REM Start dev servers (blocking — keeps this window open)
call npm run dev
pause
