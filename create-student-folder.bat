@echo off
title HealthZone - Create Offline Student Folder
color 0E
setlocal EnableDelayedExpansion

cd /d "%~dp0"
set "OUT=%~dp0healthzone-student"
set "NODE_PORTABLE=%~dp0tools\node-portable\node.exe"

echo.
echo  =========================================
echo   HealthZone - Create Offline Student Folder
echo  =========================================
echo.
echo  Builds a self-contained folder for students who
echo  CANNOT install anything and may have NO internet.
echo.
echo  The student only double-clicks start-student.bat.
echo.

REM --- Ensure build dependencies exist ---
if not exist "server\node_modules" (
    echo  Installing server dependencies...
    cd server
    call npm install
    if errorlevel 1 (
        echo  ERROR: server npm install failed.
        cd ..
        pause
        exit /b 1
    )
    cd ..
)

if not exist "client\node_modules" (
    echo  Installing client dependencies...
    cd client
    call npm install
    if errorlevel 1 (
        echo  ERROR: client npm install failed.
        cd ..
        pause
        exit /b 1
    )
    cd ..
)

echo  [1/5] Getting portable Node.js...
if exist "%NODE_PORTABLE%" (
    echo         Using cached copy.
) else (
    echo         Looking for Node.js on this PC ^(no download^)...
    if not exist "%~dp0tools\node-portable" mkdir "%~dp0tools\node-portable"

    where node >nul 2>&1
    if not errorlevel 1 (
        for /f "delims=" %%N in ('where node 2^>nul') do (
            echo         Found: %%N
            copy /Y "%%N" "%NODE_PORTABLE%" >nul 2>&1
        )
    )

    if not exist "%NODE_PORTABLE%" if exist "%ProgramFiles%\nodejs\node.exe" (
        echo         Found: %ProgramFiles%\nodejs\node.exe
        copy /Y "%ProgramFiles%\nodejs\node.exe" "%NODE_PORTABLE%" >nul 2>&1
    )

    if not exist "%NODE_PORTABLE%" if exist "%ProgramFiles(x86)%\nodejs\node.exe" (
        echo         Found: %ProgramFiles(x86)%\nodejs\node.exe
        copy /Y "%ProgramFiles(x86)%\nodejs\node.exe" "%NODE_PORTABLE%" >nul 2>&1
    )

    if not exist "%NODE_PORTABLE%" (
        echo         Local Node not found. Trying download...
        powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\setup-portable-node.ps1"
        if errorlevel 1 (
            echo.
            echo  ERROR: Could not get portable Node.js.
            echo.
            echo  Fix options:
            echo    1. Install Node.js on this PC, then run this script again
            echo    2. Manually copy node.exe to:
            echo       tools\node-portable\node.exe
            echo    3. Check your internet connection and retry
            echo.
            pause
            exit /b 1
        )
    )

    if exist "%NODE_PORTABLE%" echo         Portable Node.js ready.
)

if not exist "%NODE_PORTABLE%" (
    echo  ERROR: Portable Node.js missing after setup.
    pause
    exit /b 1
)

echo  [2/5] Building minified frontend...
cd client
call npm run build
if errorlevel 1 (
    echo  ERROR: Client build failed.
    cd ..
    pause
    exit /b 1
)
cd ..

echo  [3/5] Preparing output folder...
if exist "%OUT%" rmdir /s /q "%OUT%"
mkdir "%OUT%"
mkdir "%OUT%\runtime"
mkdir "%OUT%\server"
mkdir "%OUT%\client"
mkdir "%OUT%\database"

echo  [4/5] Copying application ^(includes server node_modules^)...
echo         This may take a minute...
robocopy "server" "%OUT%\server" /E /NFL /NDL /NJH /NJS /nc /ns /np >nul
robocopy "client\dist" "%OUT%\client\dist" /E /NFL /NDL /NJH /NJS /nc /ns /np >nul
copy /Y "%NODE_PORTABLE%" "%OUT%\runtime\node.exe" >nul
copy /Y "start-student.bat" "%OUT%\start-student.bat" >nul

(
echo JWT_SECRET=healthzone-student-offline-key
echo PORT=3001
echo DB_PATH=../database/health_assistant.db
) > "%OUT%\.env"

echo  [5/5] Summarizing folder...
for /f "tokens=1,2 delims=|" %%a in ('powershell -NoProfile -Command "$i=Get-ChildItem -Path '%OUT%' -Recurse -File -ErrorAction SilentlyContinue; $s=($i | Measure-Object -Property Length -Sum).Sum; Write-Output ('{0}|{1}' -f $i.Count, [math]::Round($s/1MB, 1))"') do (
    set "COUNT=%%a"
    set "SIZE_MB=%%b"
)
if not defined COUNT set COUNT=?
if not defined SIZE_MB set SIZE_MB=?

echo.
echo  =========================================
echo   Offline student folder ready!
echo  =========================================
echo   Location: %OUT%
echo   Files:    !COUNT!
echo   Size:     ~!SIZE_MB! MB
echo.
echo   Give the student the entire "healthzone-student" folder.
echo   Student steps:
echo     1. Copy folder to their laptop ^(USB, etc.^)
echo     2. Double-click start-student.bat
echo     3. Open http://localhost:3001
echo.
echo   No Node.js install, no npm, no internet needed on student PC.
echo   Demo login: demo@healthzone.app / demo123
echo.
pause
