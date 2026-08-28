@echo off
title BharatOS 2026 Sovereign PC Desktop - Native Standalone Mode
color 0B
cls
echo ===============================================================================
echo     🇮🇳 BHARATOS 2026 SOVEREIGN PC OPERATING SYSTEM (STANDALONE NATIVE) 🇮🇳
echo ===============================================================================
echo [INFO] UI Engine       : Prithvi Liquid-Glass Compositor (Zero Browser Required)
echo [INFO] Kernel Subsystem: 64-bit Virtual Kernel & Kavach Ring-0 Enclave
echo [INFO] AI Telemetry    : 100%% Autonomous AI Coding Bot (24/7 Sync)
echo.

:: Ensure Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    pause
    exit /b 1
)

:: Start the background daemon if not already running
echo [1/2] Initializing BharatOS Sovereign Backend Daemon...
start /b "" python main.py --no-browser >nul 2>&1

:: Wait 1.5s for server initialization
timeout /t 2 /nobreak >nul

:: Launch Standalone Native App Window (Frameless / Dedicated Window)
echo [2/2] Launching Native Standalone BharatOS Desktop Window...
python bharatos\native_desktop.py

exit /b 0
