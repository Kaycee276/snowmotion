# ❄️ SnowMotion

[![CI Pipeline](https://github.com/Kaycee276/snowmotion/actions/workflows/ci.yml/badge.svg)](https://github.com/Kaycee276/snowmotion/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stellar](https://img.shields.io/badge/Blockchain-Stellar%20Soroban-black?logo=stellar)](https://stellar.org)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-blue?logo=react)](https://react.dev)

A fast-paced, tamper-proof Web3 arcade game built on the **Stellar blockchain** using **Soroban smart contracts**, gasless backend score attestation, Turso SQLite database persistence via Prisma ORM, multi-character selection, neo-brutalist visuals, and a hardware-accelerated Web Audio synthesizer.

---

## 🎮 Key Features

- **Multi-Character Selection:** Choose between **Frosty Snowman**, **Cyber Bot-3000**, **Yeti the Savage**, and **Ginger Defender**, each with unique part-collection sequences and visual accessories.
- **Neo-Brutalist Aesthetic:** High-contrast color blocks, sharp borders, hard offset shadows, responsive mobile/desktop layouts, and zero visual clutter.
- **Gasless Web3 Experience:** Players connect their Stellar wallet (Freighter, Albedo, xBull, LOBSTR) and play seamlessly without paying gas or signing transaction popups after every session.
- **Tamper-Proof On-Chain Leaderboard:** Soroban smart contract records top verified scores directly on the Stellar ledger with replay protection and server attestation.
- **Server-Side Anti-Cheat & Rate Limiting:** Duration verification, physics-bounded score pacing validation, unique cryptographic session salt hashes, and IP-based rate limiting.
- **Turso / SQLite via Prisma ORM:** Resilient serverless database caching sessions, user scores, and instant leaderboard fallbacks.
- **Built-in Retro Audio Synthesizer:** Zero-dependency sound effects powered by native Web Audio API (chimes, fanfare combos, retro buzzers, and persistent mute controls).
- **Session Persistence & Reload Guard:** Automatically auto-saves gameplay in local storage and guards against accidental browser reload.

---

## 🏗️ Project Architecture

```
snowmotion/
├── .github/
│   └── workflows/
│       └── ci.yml          # Automated CI (Frontend, Backend, Rust Soroban contracts)
├── frontend/               # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/     # Game canvas, Leaderboard, Wallet Modal, UI
│   │   ├── hooks/          # useStellarWallet, useWeb3
│   │   ├── store/          # Zustand game store & state persistence
│   │   └── utils/          # Native Stellar wallet connectors & sound synth
│   └── package.json
├── backend/                # Node.js + Express API server
│   ├── prisma/             # Prisma schema for Turso / SQLite (libSQL)
│   ├── services/           # Soroban RPC submission & Prisma client
│   ├── server.js           # Anti-cheat verification, session hashing, API routes
│   └── package.json
├── contracts/              # Soroban smart contracts in Rust
│   └── contracts/snowmotion_leaderboard/
│       ├── src/lib.rs      # Leaderboard contract with replay guards & relayer auth
│       ├── src/test.rs     # Rust unit tests
│       └── Cargo.toml
├── vercel.json             # Vercel deployment configuration
├── CONTRIBUTING.md         # Open-source contributor guide
├── LICENSE                 # MIT License
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20 or higher
- **Rust**: 1.84+ with target `wasm32v1-none` (`rustup target add wasm32v1-none`)
- **Stellar CLI**: (optional, for contract deployment)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, and STELLAR_SECRET_KEY
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL to your backend (defaults to http://localhost:3001)
npm run dev
```

### 4. Smart Contract Compilation & Tests
```bash
cargo test --manifest-path contracts/Cargo.toml
cargo check --target wasm32v1-none --release --manifest-path contracts/contracts/snowmotion_leaderboard/Cargo.toml
```

---

## 🛡️ Smart Contract Details (Stellar Testnet)

- **Contract ID:** [`CCDANXNV2JNHTVJLTUMAPM77KQHNIYON7TKDXH3J7YYWLTH6NPRHSBK7`](https://stellar.expert/explorer/testnet/contract/CCDANXNV2JNHTVJLTUMAPM77KQHNIYON7TKDXH3J7YYWLTH6NPRHSBK7)
- **Functions:**
  - `submit_score(player, score, difficulty, game_hash)` - Records verified score (relayer-attested).
  - `get_leaderboard()` - Returns top global scores sorted descending.
  - `get_player_best(player)` - Returns high score for a specific wallet address.
  - `is_game_recorded(game_hash)` - Checks replay protection status.

---

## 🤝 Contributing

Contributions are welcome! Please check out [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions and contribution guidelines.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
