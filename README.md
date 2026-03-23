# SDAC – Safety Driver Assistance System
### React + Vite + Supabase · Full-Stack Web App

---

## 🚀 Quick Start in VS Code

```bash
# 1. Open this folder in VS Code
# 2. Open the terminal (Ctrl + `)

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev

# 5. Open http://localhost:5173 in your browser
```

That's it! The app runs in **demo mode** without any backend setup.

---

## 🗄️ Connect Supabase (Full Backend)

### Step 1 — Create a Supabase project
1. Go to [supabase.com](https://supabase.com) → Create a free account
2. Click "New Project" and fill in the details
3. Go to **Settings → API** and copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public key** (long JWT string)

### Step 2 — Set up environment variables
Create a `.env` file in the project root (same folder as `package.json`):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

### Step 3 — Run the database schema
In your Supabase project → **SQL Editor** → paste and run the SQL from inside the app:
- Sign in → User Dashboard → **DB Schema tab** → Copy SQL → Run it in Supabase

---

## 📁 Project Structure

```
sdac/
├── index.html                  # App entry point
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies
├── .env.example                # Copy to .env and fill credentials
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Router + app shell
    ├── index.css               # Global styles (CSS variables, components)
    ├── context/
    │   └── AppContext.jsx      # Global state (user, toasts, auth)
    ├── lib/
    │   ├── supabase.js         # Supabase client setup
    │   └── mockData.js         # Demo data + SQL schema
    ├── components/
    │   ├── TopNav.jsx          # Navigation bar
    │   └── MapVisual.jsx       # Animated map component
    └── pages/
        ├── LandingPage.jsx     # Home / marketing page
        ├── AuthPage.jsx        # Login + Signup
        ├── UserDashboard.jsx   # Passenger interface
        └── DriverDashboard.jsx # Driver interface
```

---

## 🗺️ App Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Landing Page | Public |
| `/login` | Sign In | Public |
| `/signup` | Create Account | Public |
| `/dashboard` | User Dashboard | Passengers only |
| `/driver` | Driver Dashboard | Drivers only |

---

## 🗄️ Database Schema

```
auth.users (Supabase built-in)
    │
    ▼
profiles (id, full_name, phone, role, avatar_url)
    │
    ├──▶ drivers (id, license_number, vehicle_*, is_available, rating, location)
    │
    └──▶ bookings (id, user_id, driver_id, addresses, status, fare, reason)
              │
              └──▶ ratings (booking_id, rated_by, rated_user, score, comment)
```

---

## ✨ Features

### User (Passenger)
- 3-step booking wizard: locations → driver selection → confirm
- Driver cards with ratings, trips, ETA
- Reason for assistance selection (fatigue, medical, etc.)
- Live trip tracking with animated map
- Trip history with stats
- Profile management

### Driver
- Online/Offline toggle (syncs to Supabase)
- Live job feed with urgency indicators
- Accept/skip jobs
- Active trip flow: en-route → start → complete
- Earnings dashboard (daily/weekly/monthly)
- Vehicle profile management

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 |
| Build Tool | Vite 5 |
| Routing | React Router v6 |
| Backend/Auth/DB | Supabase |
| Styling | Custom CSS (CSS variables) |
| Icons/Fonts | Syne + DM Sans (Google Fonts) |

---

## 📊 Power BI Integration

Connect Power BI to your Supabase PostgreSQL database:
1. Supabase → Settings → Database → copy Connection String
2. Power BI → Get Data → PostgreSQL Database
3. Useful reports: booking trends, driver performance, revenue, peak hours
