# F1 Countdown Hub

A web application for Formula 1 fans to track the season in real time — with personalized profiles, live standings, and a countdown to the next Grand Prix.

---

## Features

- **Authentication** — Secure login and registration with session management via Supabase
- **Personalized Profiles** — Choose your favorite driver and team; the app tailors the experience around your picks
- **Standings Dashboard** — Up-to-date Drivers' and Constructors' Championship standings
- **Next GP Countdown** — Real-time countdown to the next race, with circuit details and location info
- **Full Season Calendar** — All rounds of the season in a clean, organized calendar view
- **Dark / Light Mode** — Toggle between themes with persistent preference

---

## Tech Stack

| Layer    | Technology            |
| -------- | --------------------- |
| Frontend | React, Tailwind CSS   |
| Backend  | Node.js, Express      |
| Database | Supabase (PostgreSQL) |
| F1 Data  | Jolpica-F1 API        |
| Auth     | Supabase Auth         |

---

## Project Structure

```
f1-countdown-hub/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
├── server/          # Node.js + Express backend
│   ├── routes/
│   └── ...
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/britzki/f1-countdown-hub.git
cd f1-countdown-hub

# Install dependencies
cd client && npm install
cd ../server && npm install
```

### Environment Variables

Create a `.env` file in `/server`:

```env
SUPABASE_URL=***
SUPABASE_KEY=***
PORT=***
```

Create a `.env` file in `/client`:

```env
VITE_SUPABASE_URL=***
VITE_SUPABASE_KEY=***
VITE_API_URL=http://localhost:3001
```

### Running Locally

```bash
# Start the backend
cd server && npm run dev

# Start the frontend (new terminal)
cd client && npm run dev
```

---

## Live Demo

[Coming soon]

---

## License

MIT
