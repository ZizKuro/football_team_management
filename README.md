# GFF League Manager

**Gambia Football Federation League Management System**  
A full-stack MERN web application for managing Gambian domestic football league clubs and players.

> **The University of The Gambia** — Internet and Web Programming II Project (2026)

## Live URLs

| Service | URL |
|---------|-----|
| Frontend (Netlify) | `https://gff-league-manager.netlify.app` |
| Backend API (Render) | `https://gff-league-manager-api.onrender.com` |
| API Health Check | `https://gff-league-manager-api.onrender.com/health` |

> Update these URLs after you deploy with your own Netlify and Render accounts.

## Problem Statement

The Gambia Football Federation (GFF) needs a centralised system to manage league clubs (Real de Banjul, Gamtel FC, Armed Forces, etc.), track player registrations, and view season statistics across Gambian cities — Banjul, Serrekunda, Brikama, and beyond.

## Features

- **JWT Authentication** with bcrypt password hashing
- **Two roles**: `admin` (GFF officials) and `user` (fans/supporters)
- **Full CRUD** on **Clubs** and **Players**
- **RESTful Express API** with controllers and services
- **React frontend** with routing, forms, validation, pagination, search/filter
- **Bootstrap 5** responsive UI with Gambian flag colours
- **MongoDB Atlas** with Mongoose schemas and relationships

## Demo Accounts

After running `npm run seed` in the backend:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gff.gm | admin123 |
| User | fan@gff.gm | user123 |

## Project Structure

```
├── frontend/          # React app (Netlify)
│   └── src/
│       ├── components/
│       ├── context/   # Auth context & guards
│       └── services/  # API service layer
├── backend/           # Express API (Render)
│   └── src/
│       ├── models/    # User, Team, Player
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       └── middleware/
└── docs/
    └── PROJECT_REPORT.md
```

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGODB_URI and JWT_SECRET
npm install
npm run seed    # optional: load Gambian sample data
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

- Frontend: http://localhost:3000
- API: http://localhost:5000

## API Endpoints Summary

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Authenticated | Current user profile |

### Clubs (Teams)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/teams` | Auth | List clubs (pagination, search, filter) |
| GET | `/api/teams/:id` | Auth | Club details |
| POST | `/api/teams` | Admin | Create club |
| PUT | `/api/teams/:id` | Admin | Update club |
| DELETE | `/api/teams/:id` | Admin | Delete club |
| GET | `/api/teams/top/:minWins` | Auth | Top clubs by wins |
| GET | `/api/teams/stats/:season` | Auth | Season statistics |

### Players
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/players` | Auth | List players (pagination, search, filter) |
| GET | `/api/players/:id` | Auth | Player details |
| POST | `/api/players` | Admin | Register player |
| PUT | `/api/players/:id` | Admin | Update player |
| DELETE | `/api/players/:id` | Admin | Delete player |
| GET | `/api/players/scorers/top` | Auth | Top goal scorers |

## Deployment

### MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Add your connection string to `MONGODB_URI`

### Backend (Render)
1. Connect GitHub repo, set root directory to `backend`
2. Set env vars: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`
3. Deploy

### Frontend (Netlify)
1. Connect GitHub repo, set base directory to `frontend`
2. Build command: `npm run build`, publish: `build`
3. Set `REACT_APP_API_URL` to your Render API URL + `/api`

See `docs/DEPLOYMENT.md` for detailed steps.

## License

MIT — UTG Internet and Web Programming II Project
