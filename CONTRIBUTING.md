# Contributing to SnowMotion

Thank you for your interest in contributing to SnowMotion! As an open-source Web3 arcade game built on Stellar and Soroban, we welcome contributions of all kinds: bug fixes, gameplay enhancements, new character concepts, audio effects, and documentation improvements.

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for everyone. Please be respectful and constructive in discussions and pull requests.

---

## Architecture Overview

SnowMotion is organized as a monorepo:

- **`frontend/`**: React 19 + TypeScript + Vite + Tailwind CSS.
  - State management powered by Zustand.
  - Stellar wallet detection supporting Freighter, Albedo, xBull, and LOBSTR.
  - Retro audio synthesis using the Web Audio API.
- **`backend/`**: Node.js + Express + Prisma ORM + Turso (libSQL/SQLite).
  - Anti-cheat pacing verification, session hashing, replay protection, and Soroban transaction relayer.
- **`contracts/`**: Soroban smart contracts written in Rust (`contracts/snowmotion_leaderboard`).
  - On-chain high scores, leaderboard sorting, replay guards, and verified relayer authorization.

---

## Getting Started Locally

### Prerequisites
- Node.js 20+ and `npm`
- Rust 1.84+ with target `wasm32v1-none`
- Stellar CLI (optional, for direct contract deployment and invocation)

### 1. Clone the Repository
```bash
git clone https://github.com/QreeGames/snowmotion.git
cd snowmotion
```

### 2. Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Development
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Turso credentials and Stellar testnet relayer key
npm run dev
```

### 4. Smart Contract Testing
```bash
cargo test --manifest-path contracts/Cargo.toml
cargo check --target wasm32v1-none --release --manifest-path contracts/contracts/snowmotion_leaderboard/Cargo.toml
```

---

## Submitting Pull Requests

1. **Fork the repository** on GitHub and clone your fork.
2. **Create a topic branch**: `git checkout -b feature/my-new-feature` or `git checkout -b fix/issue-description`.
3. **Commit your changes**: Follow conventional commits (e.g. `feat: ...`, `fix: ...`, `chore: ...`).
4. **Verify all checks pass**:
   ```bash
   npm --prefix frontend run lint
   npm --prefix frontend run build
   npm --prefix backend test
   cargo test --manifest-path contracts/Cargo.toml
   ```
5. **Push and open a Pull Request** against the `master` branch.

All pull requests trigger our GitHub Actions CI matrix (`frontend-check`, `backend-check`, `contract-check`).

---

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
