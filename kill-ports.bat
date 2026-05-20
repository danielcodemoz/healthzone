@echo off
for /f "tokens=5" %%i in ('netstat -aon ^| findstr :3001') do taskkill /f /pid %%i 2>nul
for /f "tokens=5" %%i in ('netstat -aon ^| findstr :5173') do taskkill /f /pid %%i 2>nul
for /f "tokens=5" %%i in ('netstat -aon ^| findstr :5174') do taskkill /f /pid %%i 2>nul
for /f "tokens=5" %%i in ('netstat -aon ^| findstr :5175') do taskkill /f /pid %%i 2>nul
timeout /t 2 /nobreak >nul
echo Ports cleared
