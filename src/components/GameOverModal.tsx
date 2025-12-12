import { useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import { useGameStore } from "../store/gameStore";
import { DIFFICULTY_CONFIGS } from "../types/difficulty";
import type { Address } from "viem";
import type { DifficultyLevel } from "../types/difficulty";

interface GameOverModalProps {
	score: number;
	difficulty: DifficultyLevel;
	onRestart: () => void;
	onShowLeaderboard: () => void;
	onShowInstructions: () => void;
}

interface LeaderboardEntry {
	address: Address;
	score: number;
	timestamp: number;
	difficulty: DifficultyLevel;
}

const GameOverModal = ({
	score,
	difficulty,
	onRestart,
	onShowLeaderboard,
	onShowInstructions,
}: GameOverModalProps) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [txHash, setTxHash] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const { submitScore, isConnected, connect, address } = useWeb3();

	const saveScoreLocally = (
		walletAddress: Address,
		scoreValue: number,
		difficultyLevel: DifficultyLevel
	) => {
		try {
			const savedScores = localStorage.getItem("snowmotion-scores");
			const scores: LeaderboardEntry[] = savedScores
				? JSON.parse(savedScores)
				: [];

			scores.push({
				address: walletAddress,
				score: scoreValue,
				timestamp: Date.now(),
				difficulty: difficultyLevel,
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
			saveScoreLocally(address, score, difficulty);

			setIsSubmitted(true);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to submit score";
			setError(errorMessage);
			// Still save locally even if blockchain submission fails
			if (address) {
				saveScoreLocally(address, score, difficulty);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-100 overflow-hidden">
			<div className="bg-white rounded-2xl p-4 sm:p-6 max-w-sm sm:max-w-md mx-2 text-center shadow-2xl max-h-[95vh] overflow-hidden relative">
				<button
					onClick={onShowInstructions}
					className="absolute top-2 right-2 bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-xl transition-colors"
					title="View Instructions"
				>
					❓
				</button>
				<h2 className="text-2xl sm:text-4xl font-bold mb-3 text-blue-600">
					Game Over! 🎉
				</h2>

				<div className="text-4xl sm:text-6xl font-bold text-gray-800 mb-4">
					{score}
				</div>
				<p className="text-gray-700 mb-4">Final Score</p>

				{!isConnected && (
					<p className="text-red-500">
						Connect wallet to submit score to leader board
					</p>
				)}

				{isConnected && (
					<div className="mb-3 text-sm text-gray-600">
						Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
						<button
							onClick={connect}
							className="ml-2 text-blue-600 hover:text-blue-800 underline"
						>
							Change Wallet
						</button>
					</div>
				)}

				{!isSubmitted ? (
					<>
						{error && (
							<div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg mb-3 text-xs sm:text-sm">
								{error}
							</div>
						)}
						<button
							onClick={handleSubmitScore}
							disabled={isSubmitting}
							className="w-full bg-blue-600 text-white px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
						>
							{isSubmitting
								? "Submitting..."
								: !isConnected
								? "Connect Wallet"
								: "Submit Score"}
						</button>
					</>
				) : (
					<>
						<div className="bg-green-100 text-green-700 px-3 py-2 rounded-lg mb-3">
							<div className="font-semibold text-sm">✓ Score submitted!</div>
							{txHash && (
								<div className="text-xs mt-1 break-all">
									Tx: {txHash.slice(0, 8)}...{txHash.slice(-6)}
								</div>
							)}
						</div>
					</>
				)}

				{isSubmitted && (
					<div className="mb-4">
						<p className="text-sm text-gray-600 mb-2">Change Difficulty:</p>
						<div className="flex gap-1 justify-center">
							{Object.entries(DIFFICULTY_CONFIGS).map(([key, config]) => (
								<button
									key={key}
									onClick={() =>
										useGameStore
											.getState()
											.setDifficulty(key as DifficultyLevel)
									}
									className={`px-2 py-1 text-xs rounded ${
										difficulty === key
											? "bg-blue-600 text-white"
											: "bg-gray-200 text-gray-700"
									}`}
								>
									{config.label}
								</button>
							))}
						</div>
					</div>
				)}

				<div className="flex gap-2 ">
					<button
						onClick={onRestart}
						disabled={isSubmitting}
						className=" bg-gray-300 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-lg font-semibold hover:bg-gray-400 transition-colors disabled:opacity-50 "
					>
						Play Again
					</button>

					<button
						onClick={onShowLeaderboard}
						className="bg-gray-300 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-lg font-semibold hover:bg-gray-400 transition-colors"
					>
						View Leaderboard 🏆
					</button>
				</div>
			</div>
		</div>
	);
};

export default GameOverModal;
