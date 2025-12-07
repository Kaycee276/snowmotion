# ❄️ SnowMotion - Web3 Hackathon Game

A fun, interactive snowman-building game where players collect falling items to build complete snowmen. Scores are stored on-chain for a decentralized leaderboard.

## 🎮 Game Concept

Items fall from the sky:

- ❄️ **Snowball** (body)
- 🥕 **Carrot** (nose)
- ⚫ **Coal** (eyes/buttons)
- 🎩 **Hat** (top)
- 🧣 **Scarf** (optional bonus)

Your job is to collect items in the correct order to build a complete snowman!

### Building Order

1. ❄️ Snowball
2. ⚫ Coal
3. 🥕 Carrot
4. 🎩 Hat
5. 🧣 Scarf (optional bonus)

### Scoring

- 🎯 **+1 point** for each complete snowman built
- 🎯 **+1 bonus point** if snowman includes scarf
- ❌ **-1 point** for wrong item (resets snowman progress)

### Game Duration

60 seconds per round

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or compatible Ethereum wallet (for web3 features)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The game will be available at `http://localhost:5173`

## 🌐 Web3 Integration

### Current Setup

- Wallet connection using viem (supports MetaMask and other EIP-1193 wallets)
- Score submission interface (ready for smart contract integration)
- Local leaderboard storage (for demo/testing)

### To Connect Your Smart Contract

1. Update the contract address in `src/hooks/useWeb3.ts`
2. Add your contract ABI
3. Implement the `submitScore` function to call your contract

Example:

```typescript
const hash = await walletClient.writeContract({
	address: "YOUR_CONTRACT_ADDRESS",
	abi: YOUR_CONTRACT_ABI,
	functionName: "submitScore",
	args: [score],
	account: state.address,
});
```

### Smart Contract Requirements

Your contract should have a function like:

```solidity
function submitScore(uint256 score) external {
    // Store score with player address and timestamp
    // Update leaderboard
}
```

## 🎯 How to Play

1. **Connect Wallet** - Click "Connect Wallet" in the top right
2. **Start Game** - Click "Start Game" on the home screen
3. **Collect Items** - Items automatically collect when they reach the collection zone at the bottom
   - You can also click/tap items to collect them manually
4. **Build Snowmen** - Collect items in the correct order:
   - ❄️ → ⚫ → 🥕 → 🎩
   - Add 🧣 anytime for bonus points!
5. **Submit Score** - After 60 seconds, submit your score to the blockchain leaderboard

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **viem** - Ethereum interaction library

## 📁 Project Structure

```
src/
├── components/
│   ├── Game.tsx              # Main game component
│   ├── FallingItem.tsx       # Individual falling item
│   ├── SnowmanDisplay.tsx    # Snowman progress display
│   ├── GameOverModal.tsx     # End game screen
│   ├── WalletConnection.tsx  # Web3 wallet UI
│   └── Leaderboard.tsx       # Leaderboard display
├── hooks/
│   └── useWeb3.ts            # Web3 wallet hook
└── types/
    └── game.ts               # Game type definitions
```

## 🎨 Features

- ✅ Falling items animation
- ✅ Automatic item collection
- ✅ Snowman building logic
- ✅ Score system with combo tracking
- ✅ 60-second timer
- ✅ Wallet connection (MetaMask)
- ✅ Score submission interface
- ✅ Leaderboard (local storage demo)
- ✅ Responsive design
- ✅ Beautiful UI with animations

## 🔮 Future Enhancements

- [ ] Deploy smart contract for on-chain scores
- [ ] Real-time leaderboard from blockchain
- [ ] NFT rewards for high scores
- [ ] Power-ups and special items
- [ ] Multiplayer mode
- [ ] Sound effects and music
- [ ] Mobile optimizations

## 📝 License

MIT

## 🤝 Contributing

This is a hackathon project! Feel free to fork and improve.

---

Built with ❄️ for Web3 Hackathon
