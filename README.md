Setup Instructions
# 1️.Prerequisites
1..Node.js 16+
2.Redis server running locally
3.SQLite (included in Node library — no external install needed)

#Project Structure
analytics/
├── ingestion.js
├── processor.js
├── reporting.js
├── db.js
├── migration.sql
├── package.json
├── .env.example
└── README.md

# Check Redis:  redis-cli ping
# Check Node:  node -v
# Install Dependencies: npm install
# Configure Environment Variables : cp .env.example .env
# Run Database Migration: npm run migrate
# Running the Services

Open three terminals:
# Terminal 1 — Ingestion API :npm run start:ingestion     run on port 4000
# Terminal 2 — Processor Worker: npm run start:processor   connecting the redis
# Terminal 3 — Reporting API:npm run start:reporting        run on port 5000




