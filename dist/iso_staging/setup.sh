#!/usr/bin/env bash
echo "==============================================================================="
echo "    BHARATOS SOVEREIGN PC OPERATING SYSTEM - INSTALLER (POSIX / LINUX)"
echo "==============================================================================="
python3 --version || { echo "Python 3 is required. Exiting."; exit 1; }
python3 -m pip install psutil requests || true
python3 main.py --no-browser &
echo "[SUCCESS] BharatOS launched in background! Navigate to http://localhost:5678/bharatos"
