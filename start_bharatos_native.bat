@echo off
title BharatOS Native Sovereign PC Desktop
cd /d "%~dp0"
set PYTHONPATH=%~dp0;%PYTHONPATH%

echo ====================================================================
echo    🇮🇳 Starting BharatOS Sovereign Native PC Operating System 🇮🇳
echo ====================================================================
echo  * Environment: Native Standalone Desktop Window (Zero Browser Required)
echo  * Microkernel: Bharat x86_64 Long Mode (4-Level 64-bit Paging)
echo  * Graphics:    144 FPS Vulkan & Direct3D Engine
echo  * Security:    Kavach Zero-Trust Telemetry Firewall
echo  * Languages:   10 Indic Regional Languages
echo ====================================================================
echo.

python bharatos\native_desktop.py

pause
