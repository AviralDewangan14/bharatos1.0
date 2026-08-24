@echo off
title Uninstall Hackatime 24/7 Bot from Windows Startup
echo Removing Hackatime 24/7 Bot from Windows Startup...

set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT=%STARTUP_DIR%\Hackatime247Bot.vbs"

if exist "%SHORTCUT%" (
    del /f /q "%SHORTCUT%"
    echo [SUCCESS] Removed from Startup folder.
) else (
    echo [INFO] Bot was not found in Startup folder.
)

echo.
pause
