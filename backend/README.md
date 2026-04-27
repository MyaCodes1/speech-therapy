# Sound Safari - Speech Therapy Application

## Overview 
Sound Safari is a gamified speech therapy web application for children aged 4-8 with speech sound disorders. The stack is: React for the frontend, FastAPI for the backend, SQLite for the database and OpenAI Whisper for automatic speech recognition.

## Requirements 
- Python 3.10+
- Node.js 18+ 
- npm

## Running the backend 
1. cd backend 
2. source venv/bin/activate
3. pip install -r requirements.txt
4. uvicorn main:app --reload

## Running the frontend
1. cd frontend
2. npm install
3. npm run dev 
4. Open http://localhost:5173 in your browser 

## Seeding the database
After starting the backend run: 
curl -X POST http://localhost:8000/exercsises/seed

## Test account 
Email: test@test.com
Password: test123


