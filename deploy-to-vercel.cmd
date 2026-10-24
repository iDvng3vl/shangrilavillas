@echo off
title Shangrila Villas - deploy to Vercel
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Download it from https://nodejs.org and run this again.
  pause
  exit /b 1
)

echo Deploying to Vercel. The first time, it will ask you to log in.
call npx vercel@latest
echo.
echo The https:// link printed above is your review link. Share that one.
pause
