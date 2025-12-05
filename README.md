# CourseMaster (React + Vite)

Live demo
- Website: https://coursemasters.netlify.app/

Short overview
- **Frontend:** React + Vite
- **API:** https://coursemaster-ruddy.vercel.app (used by the app for auth, courses, admin endpoints)

Why this README?
- This README highlights the live demo and developer notes. It also documents that the admin analytics use Recharts for charting.

Features
- Responsive course listing and player
- Authentication (login/register)
- Admin area with dashboard, courses, batches, assignments, and analytics
- Student views: assignments, quizzes, watch player

Tech stack
- React, Vite
- Recharts (charts used in admin analytics)

Recharts: where & how
- Charts are implemented with `recharts` in the admin analytics page: `src/pages/Admin/AdminAnalytics.jsx`.
- To add or work with charts locally, install the package:

```bash
npm install recharts
```

Quick setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   npm run preview
   ```

Admin login (local shortcut)
- A local admin shortcut exists for development/testing. Use the following to log in locally without the backend:
  - Email: `bokulsorkar96@gmail.com`
  - Password: `bokulsorkar96@gmail.com`
- This sets a local dummy token and `userRole = "admin"` in localStorage and redirects to the admin area.
- File: `src/pages/Authentication/Login/Login.jsx` (search for the local admin shortcut).

Files to check
- Login component (local admin shortcut): `src/pages/Authentication/Login/Login.jsx`
- Router entry and admin layout: `src/router/router.jsx` and `src/layouts/AdminLayout.jsx`
- Admin analytics (charts): `src/pages/Admin/AdminAnalytics.jsx`

Notes
- The local admin shortcut is for local development only — remove it before deploying to production.
- The app performs real backend sign-in for other credentials.

License / deploy
- Live demo: `https://coursemasters.netlify.app/`

Contributions
- Feel free to open PRs to improve UI, accessibility, or add more analytics charts.

Enjoy exploring CourseMaster! ✨
