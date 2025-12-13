# ❄️ SnowMotion - Web3 Hackathon Game

A tamper-proof, blockchain-based snowman-building game with server-side score verification.

## 🏗️ Project Structure

```
snowmotion/
├── frontend/          # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Node.js API server
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
# Add your private key to .env file
echo "GAME_SIGNING_KEY=your_private_key_here" >> .env
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Smart Contract
Deploy the SnowMotionLeaderboard contract to your blockchain and update the contract address in the frontend.

## 🔐 Security Features

- **Server-side signature verification**
- **Unique game session hashes**
- **Time-window validation**
- **Nonce-based replay protection**
- **Tamper-proof score submission**

## 🎮 How It Works

1. Player connects wallet and starts game
2. Backend creates unique game session hash
3. Player plays game with lives-based system
4. On game over, backend signs the score
5. Frontend submits signed score to smart contract
6. Contract verifies signature and stores score

## 📝 Environment Variables

### Backend (.env)
```
PORT=3001
GAME_SIGNING_KEY=your_private_key_here
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, viem
- **Backend**: Node.js, Express, ethers.js
- **Blockchain**: Solidity smart contract
- **Security**: Cryptographic signatures, session management