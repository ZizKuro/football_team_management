# Deployment Guide — GFF League Manager

## 1. MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account.
2. Create a **M0 Free** cluster (choose a region close to you).
3. Under **Database Access**, create a database user with password.
4. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) for development.
5. Click **Connect** → **Drivers** → copy the connection string.
6. Replace `<password>` with your user password and set the database name to `gff_league_manager`.

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gff_league_manager?retryWrites=true&w=majority
```

## 2. Backend — Render

1. Push code to GitHub (repo must have `/frontend` and `/backend` folders).
2. Go to [render.com](https://render.com) → **New Web Service**.
3. Connect your GitHub repo.
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Environment variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = your Atlas connection string
   - `JWT_SECRET` = a long random secret string
   - `JWT_EXPIRES_IN` = `7d`
   - `FRONTEND_URL` = your Netlify URL (set after step 3)
6. Deploy and note your API URL, e.g. `https://gff-league-manager-api.onrender.com`

### Seed production data (optional)

In Render shell or locally with production URI:
```bash
npm run seed
```

## 3. Frontend — Netlify

1. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**.
2. Settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/build`
3. Environment variables:
   - `REACT_APP_API_URL` = `https://your-render-app.onrender.com/api`
4. Deploy.

## 4. Post-deployment checklist

- [ ] `/health` returns OK on Render
- [ ] Login works on Netlify with seeded admin account
- [ ] CORS: update `FRONTEND_URL` on Render if login fails
- [ ] All CRUD operations work end-to-end
- [ ] Update README with live URLs

## 5. Google Classroom submission

Submit:
- GitHub repository link
- Live Netlify app URL
- Live Render API URL
- PDF report (export `docs/PROJECT_REPORT.md` to PDF and add screenshots)
