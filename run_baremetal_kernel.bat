@echo off
title BharatOS Sovereign Bare-Metal Kernel (Ring-0 Console)
color 0b
echo ===============================================================================
echo Starting BharatOS Sovereign x86_64 Bare-Metal Virtual Machine...
echo ===============================================================================
python "%~dp0kernel_vm_emulator.py"
pause
