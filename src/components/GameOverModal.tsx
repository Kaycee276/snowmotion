import { useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import type { Address } from "viem";

interface GameOverModalProps {
	score: number;
	onRestart: () => void;
}

interface LeaderboardEntry {
	address: Address;
	score: number;
	timestamp: number;
}

const GameOverModal = ({ score, onRestart }: GameOverModalProps) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [txHash, setTxHash] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const { submitScore, isConnected, connect, address } = useWeb3();

	const saveScoreLocally = (walletAddress: Address, scoreValue: number) => {
		try {
			const savedScores = localStorage.getItem("snowmotion-scores");
			const scores: LeaderboardEntry[] = savedScores
				? JSON.parse(savedScores)
				: [];

			scores.push({
				address: walletAddress,
				score: scoreValue,
				timestamp: Date.now(),
			});

			localStorage.setItem("snowmotion-scores", JSON.stringify(scores));
		} catch (error) {
			console.error("Error saving score locally:", error);
		}
	};

	const handleSubmitScore = async () => {
		if (!isConnected) {
			await connect();
			return;
		}

		if (!address) {
			setError("Wallet address not available");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const hash = await submitScore(score);
			setTxHash(hash);

			// Save to localStorage as backup/for demo
			saveScoreLocally(address, score);

			setIsSubmitted(true);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to submit score";
			setError(errorMessage);
			// Still save locally even if blockchain submission fails
			if (address) {
				saveScoreLocally(address, score);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-100">
			<div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
				<h2 className="text-4xl font-bold mb-4 text-blue-600">Game Over! 🎉</h2>
				<div className="text-6xl font-bold text-gray-800 mb-6">{score}</div>
				<p className="text-gray-700 mb-6">Final Score</p>

				{!isSubmitted ? (
					<>
						{error && (
							<div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
								{error}
							</div>
						)}
						<button
							onClick={handleSubmitScore}
							disabled={isSubmitting}
							className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
						>
							{isSubmitting
								? "Submitting to Blockchain..."
								: !isConnected
								? "Connect Wallet to Submit"
								: "Submit Score to Leaderboard"}
						</button>
						<button
							onClick={onRestart}
							disabled={isSubmitting}
							className="w-full bg-gray-300 text-gray-700 px-8 py-3 rounded-lg text-xl font-semibold hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Play Again
						</button>
					</>
				) : (
					<>
						<div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-4">
							<div className="font-semibold">
								✓ Score submitted to blockchain!
							</div>
							{txHash && (
								<div className="text-xs mt-2 break-all">
									Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}
								</div>
							)}
						</div>
						<button
							onClick={onRestart}
							className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-colors"
						>
							Play Again
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default GameOverModal;
