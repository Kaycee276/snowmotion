# ❄️ SnowMotion - Web3 Neo-Brutalist Arcade

A high-performance, tamper-proof Web3 arcade game built on **Stellar Mainnet** with server-side score verification, Turso / SQLite persistence via Prisma ORM, multi-character selection, 3D neo-brutalist visual items, and a built-in retro Web Audio synthesizer.

---

## 🎮 Key Features

- **Multi-Character Selection:** Choose between **Frosty Snowman**, **Cyber Bot-3000**, **Yeti the Savage**, and **Ginger Defender**, each with unique part-collection sequences and bonus accessories.
- **Neo-Brutalist Aesthetic:** Vibrant high-contrast pop colors, bold black borders, hard offset shadows, and stylized 3D vector SVG item assets.
- **60 FPS Physics Engine:** Powered by `requestAnimationFrame` with delta-time smoothing and zero-jitter GPU positioning.
- **Interactive Power-ups & Hazards:**
  - ☕ **Hot Cocoa:** Adds $+8\text{s}$ time boost or restores life.
  - 🧊 **Blizzard Freeze:** Freezes the field and slows down falling items by 55% for 6 seconds.
  - ⭐ **Golden Star:** Grants $+3$ points and boosts combo streak.
  - 💥 **Spike Hazard:** Dangerous mine to dodge (clicking costs $-1$ life).
- **Zero-Dependency Sound Synthesizer:** Built-in Web Audio API sound effects for chime catches, fanfare combos, retro error buzzers, and a persistent mute toggle.
- **Serverless Database & Anti-Cheat:**
  - **Neon PostgreSQL & Prisma ORM:** High-performance serverless database for tracking game sessions, score validation, and fallback leaderboards.
  - **Cryptographic Attestation:** Server-side game session hashing, duration pacing validation, and rate-limited API endpoints.
  - **Stellar Mainnet Ledger:** Cryptographically attested scores verified and recorded on-chain.

---

## 🏗️ Project Structure

```
snowmotion/
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI for PRs and pushes
├── frontend/               # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/     # Neo-brutalist UI components & 3D assets
│   │   ├── store/          # Zustand game store
│   │   ├── types/          # Character & game interfaces
│   │   └── utils/          # Smart spawning & Stellar network config
│   └── package.json
├── backend/                # Node.js + Express API server
│   ├── prisma/             # Prisma ORM schema for Neon PostgreSQL
│   ├── services/           # Prisma client & Contract ABI services
│   ├── server.js           # Server with anti-cheat & rate limiting
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
# Configure your .env file
echo "DATABASE_URL=postgresql://user:password@ep-cool-snowflake-123456.us-east-2.aws.neon.tech/neondb?sslmode=require" >> .env
echo "GAME_SIGNING_KEY=your_private_key_here" >> .env
echo "CONTRACT_ADDRESS=your_contract_address" >> .env
echo "RPC_URL=https://mainnet.sorobanrpc.com" >> .env
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. CI Checks
GitHub Actions runs automatically on pushes and pull requests targeting the default branch:
- Type checking (`tsc -b`)
- Production build (`vite build`)
- Linting (`eslint .`)
- Prisma client generation (`npx prisma generate`)
- Backend syntax verification (`node --check server.js`)

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Zustand, Reown AppKit / viem.
- **Backend:** Node.js, Express, Prisma ORM, Turso / SQLite (libSQL).
- **Blockchain:** Stellar Mainnet (`XLM`).
- **Audio:** Web Audio API (native hardware-accelerated synthesis).
