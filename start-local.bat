@echo off
echo Starting FleetHub Local Development...
echo.

echo Starting Backend...
start "Backend" cmd /k "cd Backend && yarn install && yarn prisma generate && yarn prisma migrate dev && yarn db:seed && yarn start:dev"

timeout /t 5 /nobreak >nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && yarn install && yarn dev"

echo.
echo Both services are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause >nul


