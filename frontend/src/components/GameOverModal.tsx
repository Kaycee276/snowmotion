import React, { useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import { useGameStore } from "../store/gameStore";
import { DIFFICULTY_CONFIGS, type DifficultyLevel } from "../types/difficulty";
import type { Address } from "viem";

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

const GameOverModal: React.FC<GameOverModalProps> = ({
	score,
	difficulty,
	onRestart,
	onShowLeaderboard,
	onShowInstructions,
}) => {
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
		} catch (err) {
			console.error("Error saving score locally:", err);
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
			const gameHash = useGameStore.getState().gameHash;
			if (!gameHash) {
				throw new Error("No game session found");
			}

			const difficultyMap: Record<DifficultyLevel, number> = { easy: 0, medium: 1, hard: 2 };
			const hash = await submitScore(score, difficultyMap[difficulty], gameHash);
			setTxHash(hash);

			saveScoreLocally(address, score, difficulty);
			setIsSubmitted(true);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to submit score";
			setError(errorMessage);
			if (address) {
				saveScoreLocally(address, score, difficulty);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-xs z-50 p-3 overflow-y-auto">
			<div className="bg-[#FFFDF0] border-4 border-black rounded-3xl p-5 sm:p-7 max-w-md w-full text-center shadow-[8px_8px_0px_#000] relative">
				<button
					onClick={onShowInstructions}
					className="absolute top-3 right-3 bg-[#00F0FF] hover:bg-[#7df5ff] text-black border-2 border-black p-1.5 rounded-xl shadow-[2px_2px_0px_#000] cursor-pointer font-black text-xs"
					title="View Instructions"
				>
					❓
				</button>

				{/* Header */}
				<div className="inline-block bg-[#FF007A] text-white border-3 border-black shadow-[4px_4px_0px_#000] px-4 py-1 rounded-xl -rotate-2 mb-3">
					<h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
						GAME OVER! 💥
					</h2>
				</div>

				{/* Score Box */}
				<div className="bg-[#FFE600] border-4 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] mb-4">
					<div className="text-5xl sm:text-6xl font-black text-black">
						{score}
					</div>
					<div className="text-xs font-black uppercase tracking-widest text-black mt-1">
						Final Score • {DIFFICULTY_CONFIGS[difficulty].label} Mode
					</div>
				</div>

				{/* Wallet Status */}
				{!isConnected ? (
					<p className="text-xs font-bold text-red-600 mb-3 bg-red-50 border border-black p-2 rounded-lg">
						Connect your wallet to record this score on Stellar Mainnet!
					</p>
				) : (
					<div className="mb-3 text-xs font-bold text-black flex items-center justify-center gap-2">
						<span>Account: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
						<button
							onClick={connect}
							className="underline text-blue-700 font-black cursor-pointer"
						>
							Change
						</button>
					</div>
				)}

				{/* Submission result */}
				{!isSubmitted ? (
					<div className="mb-4">
						{error && (
							<div className="mb-3 p-2 bg-red-100 border-2 border-black text-red-800 text-xs font-bold rounded-lg">
								{error}
							</div>
						)}
						<button
							onClick={handleSubmitScore}
							disabled={isSubmitting}
							className="w-full bg-[#00F0FF] hover:bg-[#6ef5ff] disabled:opacity-50 text-black border-3 border-black py-2.5 rounded-xl font-black text-sm uppercase shadow-[3px_3px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer transition-all"
						>
							{isSubmitting
								? "VERIFYING & RECORDING..."
								: isConnected
								? "SUBMIT SCORE ON-CHAIN ⚡"
								: "CONNECT WALLET TO SUBMIT"}
						</button>
					</div>
				) : (
					<div className="mb-4 p-3 bg-[#00FF66] border-3 border-black rounded-xl shadow-[3px_3px_0px_#000]">
						<div className="text-sm font-black text-black uppercase mb-1">
							✓ VERIFIED & RECORDED ON-CHAIN!
						</div>
						{txHash && (
							<a
								href={`https://stellar.expert/explorer/public/tx/${txHash}`}
								target="_blank"
								rel="noopener noreferrer"
								className="text-[11px] font-bold text-black underline break-all block"
							>
								View Stellar Expert ↗
							</a>
						)}
					</div>
				)}

				{/* Actions */}
				<div className="flex gap-2">
					<button
						onClick={onRestart}
						className="flex-1 bg-[#00FF66] hover:bg-[#52ff99] text-black border-3 border-black py-2.5 rounded-xl font-black text-sm uppercase shadow-[3px_3px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer transition-all"
					>
						PLAY AGAIN 🔄
					</button>
					<button
						onClick={onShowLeaderboard}
						className="flex-1 bg-white hover:bg-gray-100 text-black border-3 border-black py-2.5 rounded-xl font-black text-sm uppercase shadow-[3px_3px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer transition-all"
					>
						LEADERBOARD 🏆
					</button>
				</div>
			</div>
		</div>
	);
};

export default GameOverModal;
