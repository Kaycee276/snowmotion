# ❄️ SnowMotion - Web3 Neo-Brutalist Arcade

A high-performance, tamper-proof Web3 arcade game built on **Somnia Mainnet** with server-side score verification, multi-character selection, 3D neo-brutalist visual items, and a built-in retro Web Audio synthesizer.

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
- **Cryptographic Anti-Cheat & Rate Limiting:**
  - Server-side game session hashing and duration pacing validation.
  - Rate-limited API endpoints protecting relayer gas wallets from drain attacks.
  - EIP-712-style cryptographic signatures verified by the smart contract on Somnia L1.

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
│   │   └── utils/          # Smart spawning & Web Audio engine
│   └── package.json
├── backend/                # Node.js + Express API server
│   ├── services/           # Supabase & Contract ABI services
│   ├── database/           # PostgreSQL schema
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
echo "GAME_SIGNING_KEY=your_private_key_here" >> .env
echo "CONTRACT_ADDRESS=your_contract_address" >> .env
echo "RPC_URL=https://api.infra.mainnet.somnia.network" >> .env
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
- Backend syntax verification (`node --check server.js`)

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Zustand, Reown AppKit / viem.
- **Backend:** Node.js, Express, ethers.js, Supabase.
- **Blockchain:** Somnia Mainnet (Chain ID `5031`).
- **Audio:** Web Audio API (native hardware-accelerated synthesis).
