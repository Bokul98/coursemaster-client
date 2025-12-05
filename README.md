# CourseMaster (React + Vite)

Short overview
- Frontend: React + Vite
- API: https://coursemaster-ruddy.vercel.app (used by the app for auth, courses, admin endpoints)

Quick setup
1. Install dependencies:
   npm install

2. Run development server:
   npm run dev

3. Build for production:
   npm run build
   npm run preview

Admin login (local shortcut)
- A local admin shortcut has been added to the login form. For local testing you can log in as admin without the backend by using:
  - Email: bokulsorkar96@gmail.com
  - Password: bokulsorkar96@gmail.com
- This sets a local dummy token and `userRole = "admin"` in localStorage and navigates to the admin area.

Files to check
- Login component (local admin shortcut): [`Login`](src/pages/Authentication/Login/Login.jsx)
- Router entry and admin layout: see [`src/router/router.jsx`](src/router/router.jsx) and [`AdminLayout`](src/layouts/AdminLayout.jsx)

Notes
- The local admin shortcut is intended for local development/testing only. Remove it before deploying to production.
- The app still performs real backend signin for other credentials.
