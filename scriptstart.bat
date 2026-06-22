@echo off
setlocal enabledelayedexpansion

start cmd /k "npm run dev"
timeout /t 1 >nul
start http://localhost:5173