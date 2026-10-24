@echo off
title Shangrila Villas - local site
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Download it from https://nodejs.org and run this again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies, first run only...
  call npm install
  if errorlevel 1 (
    echo Install failed. Check the messages above.
    pause
    exit /b 1
  )
)

echo Starting the site. Press Ctrl+C to stop.
call npm run dev -- --open
pause
