const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const crypto = require("crypto");
const supabase = require("./services/supabase");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Validate required environment variables
const requiredEnvVars = ["GAME_SIGNING_KEY", "CONTRACT_ADDRESS", "RPC_URL"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
	throw new Error(
		`Missing required environment variables: ${missingVars.join(", ")}`
	);
}

app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "http://localhost:5173",
	})
);
app.use(express.json());

// Initialize wallet and provider
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.GAME_SIGNING_KEY, provider);

// Contract ABI (minimal)
const CONTRACT_ABI = [
	"function submitScore(address player, uint256 score, uint8 difficulty, uint256 timestamp, uint256 nonce, bytes32 gameHash, bytes signature) external",
	"function verifyBackendSigner() external view returns (address)",
];

const contract = new ethers.Contract(
	process.env.CONTRACT_ADDRESS,
	CONTRACT_ABI,
	wallet
);

// Start game session
app.post("/api/start-game", async (req, res) => {
	try {
		const { player } = req.body;

		if (!player || !ethers.isAddress(player)) {
			return res.status(400).json({ error: "Valid player address required" });
		}

		// Generate cryptographically secure game hash
		const salt = crypto.randomBytes(32).toString("hex");
		const gameHash = ethers.keccak256(
			ethers.toUtf8Bytes(`${player.toLowerCase()}-${Date.now()}-${salt}`)
		);

		// Store in database
		const { error } = await supabase.from("game_sessions").insert({
			game_hash: gameHash,
			player_address: player.toLowerCase(),
		});

		if (error) {
			console.error("Database error:", error);
			return res.status(500).json({ error: "Failed to create game session" });
		}

		res.json({ gameHash });
	} catch (error) {
		console.error("Start game error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Submit score to blockchain
app.post("/api/submit-score", async (req, res) => {
	try {
		const { player, score, difficulty, gameHash } = req.body;

		// Validate inputs
		if (
			!player ||
			!ethers.isAddress(player) ||
			score === undefined ||
			difficulty === undefined ||
			!gameHash
		) {
			return res
				.status(400)
				.json({ error: "Missing or invalid required fields" });
		}

		// Check game session in database
		const { data: session, error: fetchError } = await supabase
			.from("game_sessions")
			.select("*")
			.eq("game_hash", gameHash)
			.eq("player_address", player.toLowerCase())
			.single();

		if (fetchError || !session) {
			return res.status(400).json({ error: "Invalid game session" });
		}

		if (session.is_used) {
			return res.status(400).json({ error: "Game session already used" });
		}

		// Generate timestamp and nonce
		const timestamp = Math.floor(Date.now() / 1000);
		const nonce = crypto.randomInt(0, 2 ** 32);

		// Create message hash for signing
		const messageHash = ethers.keccak256(
			ethers.AbiCoder.defaultAbiCoder().encode(
				["address", "uint256", "uint8", "uint256", "uint256", "bytes32"],
				[player, score, difficulty, timestamp, nonce, gameHash]
			)
		);

		// Sign the message
		const signature = await wallet.signMessage(ethers.getBytes(messageHash));

		// Submit to blockchain
		const tx = await contract.submitScore(
			player,
			score,
			difficulty,
			timestamp,
			nonce,
			gameHash,
			signature
		);

		// Mark session as used in database
		await supabase
			.from("game_sessions")
			.update({
				is_used: true,
				score: score,
				difficulty: difficulty,
				submitted_at: new Date().toISOString(),
			})
			.eq("id", session.id);

		res.json({
			success: true,
			txHash: tx.hash,
			message: "Score submitted to blockchain",
		});
	} catch (error) {
		console.error("Error submitting score:", error);
		res.status(500).json({ error: "Failed to submit score" });
	}
});

// Get leaderboard from contract
app.get("/api/leaderboard", async (req, res) => {
	try {
		const leaderboard = await contract.getLeaderboard();
		const formattedLeaderboard = leaderboard.map((entry) => ({
			address: entry.player,
			score: Number(entry.score),
			difficulty: Number(entry.difficulty),
			timestamp: Number(entry.timestamp) * 1000,
		}));
		res.json(formattedLeaderboard);
	} catch (error) {
		console.error("Error fetching leaderboard:", error);
		res.status(500).json({ error: "Failed to fetch leaderboard" });
	}
});

// Health check
app.get("/api/health", (req, res) => {
	res.json({ status: "OK", timestamp: Date.now() });
});

app.listen(PORT, () => {
	console.log(`SnowMotion backend running on port ${PORT}`);
	console.log(`Signer address: ${wallet.address}`);
	console.log(`Contract address: ${process.env.CONTRACT_ADDRESS}`);
});
