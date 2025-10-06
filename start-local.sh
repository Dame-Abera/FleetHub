#!/bin/bash

echo "Starting FleetHub Local Development..."
echo

# Function to start backend
start_backend() {
    echo "Starting Backend..."
    cd Backend
    yarn install
    yarn prisma generate
    yarn prisma migrate dev
    yarn db:seed
    yarn start:dev
}

# Function to start frontend
start_frontend() {
    echo "Starting Frontend..."
    cd frontend
    yarn install
    yarn dev
}

# Start backend in background
start_backend &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 5

# Start frontend in background
start_frontend &
FRONTEND_PID=$!

echo
echo "Both services are starting..."
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop both services"

# Wait for user to stop
wait


