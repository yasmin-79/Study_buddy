StudyBuddy - Fullstack project (backend + frontend)
-------------------------------------------------
What this zip contains:
- server/: Express + PostgreSQL backend with auth, file upload, files listing
- client/: React frontend with Upload and Browse pages
- README contains setup steps.

IMPORTANT:
- This package is ready-to-run after you install dependencies locally.
- You must create a .env file in server/ (see .env.example)
- Run `npm install` in server/ and client/ then run the apps as described below.

Quick setup:
1. Unzip studybuddy.zip
2. In terminal:
   cd studybuddy/server
   npm install
   # create .env with DATABASE_URL and JWT_SECRET (see .env.example)
   node server.js
3. In another terminal:
   cd studybuddy/client
   npm install
   npm start
4. Open http://localhost:3000 (React) and ensure backend runs at http://localhost:5000

Notes:
- uploads/ folder is created by server; uploaded PDFs will be saved there.
- The frontend expects the backend at http://localhost:5000
- This code includes clear comments. If you want Tailwind or extra polish, ask and I'll add it.
