# HealthZone — Personal Health Assistant Dashboard

A modern, full-stack personal wellness dashboard built with React + Vite + TypeScript (frontend) and Express + SQLite (backend).

## Features

- **Dashboard** — Health score, hydration, heart rate, BMI, medications, streaks
- **Water Tracker** — Log intake, daily goals, weekly history, progress visualization
- **Heart Rate** — Manual BPM logging, trend charts, health zones
- **Medical Management** — Medications, allergies, conditions, emergency contacts
- **Analytics** — Weekly charts for hydration and heart rate
- **Health Tips** — Categorized wellness advice
- **Telemedicine** — Mock doctor cards, appointment booking
- **Emergency** — Medical ID card, emergency contacts, quick-call
- **Settings** — Profile, theme toggle, water goal
- **Dark Mode** — Premium dark theme with smooth transitions

## Quick Start

### Option 1: Click-to-Run (Windows)
Double-click `start.bat`

### Option 2: Manual
```bash
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

## Demo Account

- **Email:** demo@healthzone.app
- **Password:** demo123

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, TailwindCSS v3 |
| Animations | Framer Motion |
| Charts | Recharts |
| State | Zustand |
| Icons | Lucide React |
| Backend | Express.js, Node.js |
| Database | SQLite (better-sqlite3) |
| Auth | JWT + bcrypt |

## Project Structure

```
healthzone/
├── client/          # React frontend
│   └── src/
│       ├── components/  # UI + layout components
│       ├── pages/       # Route pages
│       ├── store/       # Zustand stores
│       ├── services/    # API client
│       ├── animations/  # Framer Motion variants
│       └── types/       # TypeScript types
├── server/          # Express backend
│   ├── routes/      # API routes
│   ├── database/    # SQLite init + seed
│   ├── middleware/   # Auth + error handling
│   └── utils/       # JWT helpers
├── database/        # SQLite DB file (auto-created)
├── start.bat        # Click-to-run
└── package.json     # Root orchestrator
```
