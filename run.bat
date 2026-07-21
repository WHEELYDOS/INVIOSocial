@echo off
echo Starting development server...

if not exist "node_modules\" (
    echo Installing dependencies...
    npm install
)

npm run dev
pause
