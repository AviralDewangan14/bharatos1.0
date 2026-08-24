@echo off
title Install Hackatime 24/7 Bot to Windows Startup
cd /d "%~dp0"
echo ========================================================
echo   Registering Hackatime 24/7 Bot in Windows Startup
echo ========================================================

set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT=%STARTUP_DIR%\Hackatime247Bot.vbs"

copy /y "%~dp0start_silent_background.vbs" "%SHORTCUT%"

if exist "%SHORTCUT%" (
    echo.
    echo [SUCCESS] Hackatime 24/7 Bot is now registered in Windows Startup!
    echo It will automatically launch silently in the background whenever your PC boots up or you log in.
    echo.
    echo To view the dashboard at any time, open http://localhost:5678 or run open_dashboard.bat
) else (
    echo.
    echo [ERROR] Failed to copy shortcut to Startup folder.
)

echo.
pause
