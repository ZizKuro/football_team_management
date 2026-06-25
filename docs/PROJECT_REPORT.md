# GFF League Manager — Project Report

**The University of The Gambia**  
**Course:** Internet and Web Programming II  
**Project:** Real-World Full-Stack Web Application Using the MERN Stack  
**Date:** May 2026

---

## 1. Project Overview and Purpose

**GFF League Manager** is a full-stack web application built for the **Gambia Football Federation (GFF)** to manage the domestic football league in The Gambia. The system allows GFF administrators to register league clubs (such as Real de Banjul FC, Gamtel FC, and Armed Forces FC), manage player records, and track season statistics. Registered fans can browse clubs and players across Gambian cities including Banjul, Serrekunda, Brikama, and Farafenni.

The application solves the practical problem of scattered league data by providing a single online platform with secure access, structured data, and real-time statistics.

---

## 2. Features List

### Authentication & Authorization
- User registration and login with JWT tokens
- Password hashing using bcrypt (12 rounds)
- Two roles: **admin** (GFF officials) and **user** (fans)
- Backend route protection by role (`restrictTo` middleware)
- React `ProtectedRoute` and `AdminRoute` guards

### CRUD Operations
- **Clubs (Teams):** Create, list, view details, update, delete
- **Players:** Create, list, view details, update, delete (linked to clubs)

### API & Backend
- Express.js RESTful API
- Controllers and services pattern (no business logic in routes)
- Centralised error handling middleware
- Input validation via Mongoose schemas

### Frontend
- React 18 with React Router
- Bootstrap 5 responsive design (Gambian flag colours: red, white, blue, green)
- Forms with client-side validation
- Dashboard with league statistics
- Loading spinners and toast notifications
- Pagination and search/filter on list pages

### Database
- MongoDB Atlas (cloud-hosted)
- Mongoose ODM with validation
- Player-to-Team relationship (many-to-one)

### Deployment
- Frontend: Netlify
- Backend: Render
- Database: MongoDB Atlas

---

## 3. Architecture / System Design

```
┌─────────────────┐     HTTPS/JWT      ┌─────────────────┐
│  React Frontend │ ◄────────────────► │ Express Backend │
│  (Netlify)      │     REST API       │ (Render)        │
└─────────────────┘                    └────────┬────────┘
                                                │
                                                │ Mongoose
                                                ▼
                                       ┌─────────────────┐
                                       │ MongoDB Atlas   │
                                       │ (gff_league)    │
                                       └─────────────────┘
```

### Backend Layers
1. **Routes** — Define endpoints and attach middleware
2. **Controllers** — Handle HTTP request/response
3. **Services** — Business logic and database operations
4. **Models** — Mongoose schemas (User, Team, Player)
5. **Middleware** — Auth (JWT), error handling

### Frontend Layers
1. **Pages/Components** — UI views
2. **Context** — Auth state management
3. **Services** — Axios API calls
4. **Guards** — ProtectedRoute, AdminRoute

---

## 4. Database Models

### User
| Field | Type | Description |
|-------|------|-------------|
| name | String | Full name |
| email | String | Unique, required |
| password | String | Hashed with bcrypt |
| role | Enum | `admin` or `user` |
| region | String | Gambian region |

### Team (Club)
| Field | Type | Description |
|-------|------|-------------|
| name | String | Club name (unique per season) |
| city | Enum | Gambian city |
| stadium | String | Home ground |
| founded | Number | Year founded |
| season | Number | League season year |
| gamesPlayed, wins, draws, losses | Number | Match stats |
| goalsFor, goalsAgainst, points | Number | League stats |
| createdBy | ObjectId | Ref to User |

### Player
| Field | Type | Description |
|-------|------|-------------|
| fullName | String | Player name |
| position | Enum | GK, DEF, MID, FWD |
| jerseyNumber | Number | Unique per club |
| nationality | String | Default: Gambian |
| goals, assists, appearances | Number | Stats |
| team | ObjectId | Ref to Team (required) |
| createdBy | ObjectId | Ref to User |

---

## 5. API Endpoints Summary

See README.md for the full endpoint table.

**Base URL:** `https://gff-league-manager-api.onrender.com`

All protected routes require header: `Authorization: Bearer <token>`

---

## 6. Screenshots (Major Pages)

> *Add screenshots when submitting your PDF:*
> 1. Login page
> 2. Dashboard with league stats
> 3. Clubs list with search/filter
> 4. Club detail page
> 5. Players list
> 6. Add club form (admin)
> 7. Register page

---

## 7. Challenges and Solutions

| Challenge | Solution |
|-----------|----------|
| Role-based access on frontend and backend | JWT payload includes role; `restrictTo` middleware on backend; `AdminRoute` component on frontend |
| Player-club relationship integrity | Mongoose `ref` on Player model; service validates team exists before creating player |
| CORS between Netlify and Render | Configured `cors` with `FRONTEND_URL` env variable |
| Route ordering (stats vs :id) | Placed specific routes (`/stats/:season`, `/scorers/top`) before parameterized routes |
| Gambian-localised data | Seed script with real GFF club names and Gambian player names |

---

## 8. Deployment Information

| Item | Value |
|------|-------|
| GitHub Repository | *Your repo URL* |
| Live App (Netlify) | *Your Netlify URL* |
| Live API (Render) | *Your Render URL* |
| MongoDB Atlas | Cloud cluster |

---

**Submitted by:** *[Your Name]*  
**Student ID:** *[Your ID]*  
**Instructor:** *[Instructor Name]*
