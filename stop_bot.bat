@echo off
title Stop Hackatime 24/7 Bot
echo Stopping any running Hackatime 24/7 Bot instances...

powershell -Command "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*main.py*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force; Write-Host 'Stopped PID:' $_.ProcessId }"

echo.
echo Done. All Hackatime bot processes have been stopped.
timeout /t 3 >nul
