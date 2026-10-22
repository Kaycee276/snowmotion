const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const crypto = require("crypto");
const prisma = require("./services/prisma");
const { CONTRACT_ABI } = require("./services/abi");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Validate required environment variables (optional during tests, required in production)
const requiredEnvVars = ["GAME_SIGNING_KEY", "CONTRACT_ADDRESS", "RPC_URL"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
	console.warn(
		`Warning: Missing environment variables: ${missingVars.join(", ")}. Mock/fallback mode enabled if applicable.`
	);
}

app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "http://localhost:5173",
	})
);
app.use(express.json());

// Initialize wallet and provider if configured
let provider = null;
let wallet = null;
let contract = null;

if (process.env.RPC_URL && process.env.GAME_SIGNING_KEY && process.env.CONTRACT_ADDRESS) {
	try {
		provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
		wallet = new ethers.Wallet(process.env.GAME_SIGNING_KEY, provider);
		contract = new ethers.Contract(
			process.env.CONTRACT_ADDRESS,
			CONTRACT_ABI,
			wallet
		);
	} catch (err) {
		console.error("Error initializing ethers wallet/contract:", err.message);
	}
}

// In-memory rate limiting to prevent spam and relayer gas drain
const rateLimits = new Map();

const rateLimitMiddleware = (limit = 10, windowMs = 60000) => (req, res, next) => {
	const ip = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
	const key = `${req.path}:${ip}`;
	const now = Date.now();

	const record = rateLimits.get(key) || { count: 0, resetTime: now + windowMs };
	if (now > record.resetTime) {
		record.count = 1;
		record.resetTime = now + windowMs;
	} else {
		record.count += 1;
	}
	rateLimits.set(key, record);

	if (record.count > limit) {
		return res.status(429).json({
			error: "Too many requests. Please slow down.",
			retryAfterMs: record.resetTime - now,
		});
	}
	next();
};

// Start game session
app.post("/api/start-game", rateLimitMiddleware(20, 60000), async (req, res) => {
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

		// Store in database using Prisma (Neon PostgreSQL)
		await prisma.gameSession.create({
			data: {
				gameHash,
				playerAddress: player.toLowerCase(),
			},
		});

		res.json({ gameHash });
	} catch (error) {
		console.error("Start game error:", error);
		res.status(500).json({ error: "Failed to create game session" });
	}
});

// Submit score with server-side anti-cheat verification
app.post("/api/submit-score", rateLimitMiddleware(10, 60000), async (req, res) => {
	try {
		const { player, score, difficulty, gameHash } = req.body;

		// 1. Strict input validation
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

		const parsedScore = Number(score);
		const parsedDifficulty = Number(difficulty);

		if (!Number.isInteger(parsedScore) || parsedScore < 0) {
			return res.status(400).json({ error: "Score must be a non-negative integer" });
		}

		if (![0, 1, 2].includes(parsedDifficulty)) {
			return res.status(400).json({ error: "Difficulty must be 0 (easy), 1 (medium), or 2 (hard)" });
		}

		// 2. Check game session in database via Prisma (Neon PostgreSQL)
		const session = await prisma.gameSession.findUnique({
			where: { gameHash },
		});

		if (!session || session.playerAddress.toLowerCase() !== player.toLowerCase()) {
			return res.status(400).json({ error: "Invalid game session" });
		}

		if (session.isUsed) {
			return res.status(400).json({ error: "Game session already used" });
		}

		// 3. Anti-cheat: Duration and score pacing validation
		const createdAtMs = new Date(session.createdAt).getTime();
		const nowMs = Date.now();
		const elapsedSeconds = Math.max(1, Math.floor((nowMs - createdAtMs) / 1000));

		// Expire sessions older than 30 minutes (1800s)
		if (elapsedSeconds > 1800) {
			return res.status(400).json({ error: "Game session has expired (max 30 minutes allowed)" });
		}

		// Enforce minimum time bounds: building snowmen takes physical time
		// e.g., you cannot achieve score > 10 in under 4 seconds
		if (elapsedSeconds < 4 && parsedScore > 5) {
			return res.status(400).json({ error: "Suspiciously rapid score submission detected" });
		}

		// Max realistic score rate: at maximum pace, 1 snowman (score 1-2 + combo) takes ~1.5s
		// Absolute ceiling: parsedScore / elapsedSeconds should not exceed 6 points/sec
		if (parsedScore > 10 && parsedScore / elapsedSeconds > 6) {
			return res.status(400).json({ error: "Score rate exceeds maximum realistic gameplay bounds" });
		}

		// Absolute cap safety
		if (parsedScore > 500) {
			return res.status(400).json({ error: "Score exceeds maximum allowed threshold" });
		}

		if (!wallet || !contract) {
			return res.status(500).json({ error: "Blockchain signing service unavailable" });
		}

		// 4. Generate timestamp and nonce for replay protection
		const timestamp = Math.floor(Date.now() / 1000);
		const nonce = crypto.randomInt(0, 2 ** 32);

		// Create message hash for signing
		const messageHash = ethers.keccak256(
			ethers.AbiCoder.defaultAbiCoder().encode(
				["address", "uint256", "uint8", "uint256", "uint256", "bytes32"],
				[player, parsedScore, parsedDifficulty, timestamp, nonce, gameHash]
			)
		);

		// Sign the message
		const signature = await wallet.signMessage(ethers.getBytes(messageHash));

		// Submit to blockchain via relayer
		const tx = await contract.submitScore(
			player,
			parsedScore,
			parsedDifficulty,
			timestamp,
			nonce,
			gameHash,
			signature
		);

		// Mark session as used in database using Prisma (Neon PostgreSQL)
		await prisma.gameSession.update({
			where: { id: session.id },
			data: {
				isUsed: true,
				score: parsedScore,
				difficulty: parsedDifficulty,
				submittedAt: new Date(),
			},
		});

		res.json({
			success: true,
			txHash: tx.hash,
			signature,
			timestamp,
			nonce,
			message: "Score verified and submitted to blockchain",
		});
	} catch (error) {
		console.error("Error submitting score:", error);
		res.status(500).json({ error: "Failed to verify or submit score" });
	}
});

// Get leaderboard from contract (with Neon/Prisma fallback)
app.get("/api/leaderboard", async (req, res) => {
	try {
		if (contract) {
			try {
				const leaderboard = await contract.getLeaderboard();
				const formattedLeaderboard = leaderboard.map((entry) => ({
					address: entry.player,
					score: Number(entry.score),
					difficulty: Number(entry.difficulty),
					timestamp: Number(entry.timestamp) * 1000,
				}));
				return res.json(formattedLeaderboard);
			} catch (contractErr) {
				console.warn("Contract call failed, falling back to database leaderboard:", contractErr.message);
			}
		}

		// Fallback to Neon PostgreSQL via Prisma
		const sessions = await prisma.gameSession.findMany({
			where: { isUsed: true, score: { not: null } },
			orderBy: { score: "desc" },
			take: 50,
		});

		const formatted = sessions.map((s) => ({
			address: s.playerAddress,
			score: s.score || 0,
			difficulty: s.difficulty ?? 1,
			timestamp: s.submittedAt ? new Date(s.submittedAt).getTime() : Date.now(),
		}));

		res.json(formatted);
	} catch (error) {
		console.error("Error fetching leaderboard:", error);
		res.status(500).json({ error: "Failed to fetch leaderboard" });
	}
});

// Health check
app.get("/api/health", (req, res) => {
	res.json({ status: "OK", timestamp: Date.now() });
});

if (require.main === module) {
	app.listen(PORT, () => {
		console.log(`SnowMotion backend running on port ${PORT}`);
		if (wallet) console.log(`Signer address: ${wallet.address}`);
		if (process.env.CONTRACT_ADDRESS) console.log(`Contract address: ${process.env.CONTRACT_ADDRESS}`);
	});
}

module.exports = app;
