#!/bin/bash

echo "Starting backend..."
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 &

echo "Starting frontend..."
cd ../frontend
npm start