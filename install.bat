@echo off
echo Installing Mindful Weight Tracker...
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js not found. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found. Installing dependencies...
npm install

echo.
echo Installation complete!
echo.
echo To start the development server:
echo   npm start
echo.
echo To run on Android:
echo   npm run android
echo.
echo Make sure you have Expo Go installed on your Samsung Galaxy S24
echo.
pause 