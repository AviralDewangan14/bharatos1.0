@echo off
title BharatOS QEMU Virtual Machine Launcher
echo ====================================================================
echo    🇮🇳 Booting BharatOS Sovereign PC ISO in QEMU Virtual Machine 🇮🇳
echo ====================================================================
echo  * ISO Image:    bharatos\dist\bharatos-2026.1-x86_64.iso
echo  * Architecture: x86_64 (UEFI Long Mode)
echo  * Memory:       2048 MB RAM
echo  * Acceleration: WHPX / TCG
echo ====================================================================
echo.

where qemu-system-x86_64 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    qemu-system-x86_64 -m 2048 -cdrom bharatos\dist\bharatos-2026.1-x86_64.iso -boot d -vga std
) else (
    echo QEMU is not installed in PATH.
    echo You can flash 'bharatos\dist\bharatos-2026.1-x86_64.iso' directly to a USB drive with Rufus / BalenaEtcher
    echo or open it in VirtualBox / VMware Workstation!
    echo.
    echo Starting the Native Standalone Desktop Window instead...
    python bharatos\native_desktop.py
)

pause
