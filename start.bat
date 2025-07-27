@echo off
echo Starting Mindful Weight Tracker...
echo.

echo Checking if dependencies are installed...
if not exist "node_modules" (
    echo Dependencies not found. Running installation...
    call install.bat
)

echo Starting Expo development server...
npm start

pause 