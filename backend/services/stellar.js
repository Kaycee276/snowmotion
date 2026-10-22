const StellarSdk = require("@stellar/stellar-sdk");
const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

const { rpc: SorobanRpc, Keypair, Networks, TransactionBuilder, Contract, nativeToScVal, scValToNative } = StellarSdk;

const RPC_URL = process.env.RPC_URL || "https://soroban-testnet.stellar.org";
const CONTRACT_ID = process.env.CONTRACT_ADDRESS || "CBKNJITAAMAECDIIARJVDVVEH7M5UKD7NKBCZYYDZQVEZUY7OPQ4ZIYZ";
const NETWORK_PASSPHRASE = process.env.STELLAR_NETWORK === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;

function getCleanSecretKey() {
	const raw = (process.env.STELLAR_SECRET_KEY || process.env.GAME_SIGNING_KEY || "SDVZOLWJ3D2RBCDB3JJ3FT4S75BUDM7MJ3WN7G3JNI2HWI4S77JSGA7H").trim();
	return raw.replace(/^0x/, "");
}

function getKeypair() {
	return Keypair.fromSecret(getCleanSecretKey());
}

function getRelayerAddress() {
	try {
		return getKeypair().publicKey();
	} catch (e) {
		return null;
	}
}

function isValidStellarAddress(addr) {
	return typeof addr === "string" && /^G[A-Z2-7]{55}$/.test(addr);
}

function parseGameHash(gameHash) {
	const clean = (gameHash || "").replace(/^0x/, "");
	if (clean.length === 64 && /^[0-9a-fA-F]{64}$/.test(clean)) {
		return Buffer.from(clean, "hex");
	}
	// Fallback 32-byte deterministic buffer
	const buf = Buffer.alloc(32);
	Buffer.from(clean || "snowmotion").copy(buf);
	return buf;
}

/**
 * Submit verified score directly to Soroban smart contract on Stellar.
 * Returns the true 64-character hex Stellar transaction hash.
 */
async function submitScoreOnChain({ player, score, difficulty, gameHash }) {
	const safePlayer = isValidStellarAddress(player)
		? player
		: "GBELXTVUSO745SBIL6OINE3FR3YB4BTXKOL5BY7LK6GC5AOQJCZOVMBX";

	const safeDifficulty = Math.max(0, Math.min(Number(difficulty) || 0, 2));
	const safeScore = Math.max(0, Math.floor(Number(score) || 0));
	const hashBuffer = parseGameHash(gameHash);

	// Attempt 1: Direct Soroban RPC via @stellar/stellar-sdk
	try {
		const keypair = getKeypair();
		const server = new SorobanRpc.Server(RPC_URL);
		const contract = new Contract(CONTRACT_ID);

		const account = await server.getAccount(keypair.publicKey());

		const op = contract.call(
			"submit_score",
			nativeToScVal(safePlayer, { type: "address" }),
			nativeToScVal(safeScore, { type: "u32" }),
			nativeToScVal(safeDifficulty, { type: "u32" }),
			nativeToScVal(hashBuffer, { type: "bytes" })
		);

		const tx = new TransactionBuilder(account, {
			fee: "100000",
			networkPassphrase: NETWORK_PASSPHRASE,
		})
			.addOperation(op)
			.setTimeout(30)
			.build();

		const preparedTx = await server.prepareTransaction(tx);
		preparedTx.sign(keypair);

		const sendResult = await server.sendTransaction(preparedTx);

		if (sendResult.status === "ERROR") {
			throw new Error(`Soroban RPC submission error: ${JSON.stringify(sendResult.errorResultXdr || sendResult)}`);
		}

		const txHash = sendResult.hash;

		// Poll for confirmation
		if (sendResult.status === "PENDING") {
			let getResponse = await server.getTransaction(txHash);
			let attempts = 0;
			while (getResponse.status === "NOT_FOUND" && attempts < 15) {
				await new Promise((r) => setTimeout(r, 1000));
				getResponse = await server.getTransaction(txHash);
				attempts++;
			}
		}

		return {
			txHash,
			status: "SUCCESS",
		};
	} catch (sdkError) {
		console.warn("Stellar SDK submit failed, trying CLI fallback:", sdkError.message);

		// Attempt 2: CLI invocation fallback if stellar CLI is present
		try {
			const hashHex = hashBuffer.toString("hex");
			const cmd = `stellar contract invoke --id ${CONTRACT_ID} --source alice --network testnet -- submit_score --player ${safePlayer} --score ${safeScore} --difficulty ${safeDifficulty} --game_hash ${hashHex}`;
			const { stdout, stderr } = await execAsync(cmd, { timeout: 25000 });
			const combined = `${stdout}\n${stderr}`;
			const match = combined.match(/Signing transaction:\s*([a-fA-F0-9]{64})/);

			if (match && match[1]) {
				return {
					txHash: match[1].toLowerCase(),
					status: "SUCCESS",
				};
			}
		} catch (cliError) {
			console.error("Stellar CLI invoke also failed:", cliError.message);
		}

		throw sdkError;
	}
}

/**
 * Fetch leaderboard from on-chain Soroban contract storage.
 */
async function getOnChainLeaderboard() {
	try {
		const server = new SorobanRpc.Server(RPC_URL);
		const contract = new Contract(CONTRACT_ID);
		const keypair = getKeypair();
		const account = await server.getAccount(keypair.publicKey());

		const op = contract.call("get_leaderboard");
		const tx = new TransactionBuilder(account, {
			fee: "100",
			networkPassphrase: NETWORK_PASSPHRASE,
		})
			.addOperation(op)
			.setTimeout(30)
			.build();

		const simResult = await server.simulateTransaction(tx);
		if (simResult.result && simResult.result.retval) {
			const parsed = scValToNative(simResult.result.retval);
			if (Array.isArray(parsed)) {
				return parsed.map((item) => ({
					address: item.player,
					score: Number(item.score),
					difficulty: Number(item.difficulty),
					timestamp: Number(item.timestamp) * 1000,
				}));
			}
		}
	} catch (err) {
		console.warn("Could not fetch leaderboard directly via Soroban RPC:", err.message);
	}
	return null;
}

module.exports = {
	submitScoreOnChain,
	getOnChainLeaderboard,
	isValidStellarAddress,
	getRelayerAddress,
};
