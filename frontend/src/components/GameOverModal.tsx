import React, { useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import { useGameStore } from "../store/gameStore";
import { DIFFICULTY_CONFIGS, type DifficultyLevel } from "../types/difficulty";

interface GameOverModalProps {
	score: number;
	difficulty: DifficultyLevel;
	onRestart: () => void;
	onShowLeaderboard: () => void;
	onShowInstructions: () => void;
}

interface LeaderboardEntry {
	address: string;
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
		walletAddress: string,
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
		<div className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-xs z-50 p-4 sm:p-6 overflow-y-auto">
			<div className="bg-[#FFFDF0] border-4 border-black p-6 sm:p-8 max-w-md w-full text-center shadow-[8px_8px_0px_#000] relative">
				<button
					type="button"
					onClick={onShowInstructions}
					className="absolute top-4 right-4 bg-[#00F0FF] hover:bg-[#7df5ff] text-black border-2 border-black px-3 py-1 shadow-[2px_2px_0px_#000] cursor-pointer font-black text-xs uppercase active:translate-x-0.5 active:translate-y-0.5"
				>
					HELP
				</button>

				{/* Header */}
				<div className="inline-block bg-[#FF007A] text-white border-4 border-black shadow-[4px_4px_0px_#000] px-6 py-2 -rotate-1 mb-5">
					<h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider">
						GAME OVER
					</h2>
				</div>

				{/* Score Box */}
				<div className="bg-[#FFE600] border-4 border-black p-6 shadow-[5px_5px_0px_#000] mb-6">
					<div className="text-5xl sm:text-6xl font-black text-black">
						{score}
					</div>
					<div className="text-xs font-black uppercase tracking-widest text-black mt-2">
						FINAL SCORE • {DIFFICULTY_CONFIGS[difficulty].label} MODE
					</div>
				</div>

				{/* Wallet Status */}
				{!isConnected ? (
					<p className="text-xs font-black uppercase text-black mb-5 bg-[#FFE600]/30 border-2 border-black p-3">
						Connect your wallet to record this score on Stellar Mainnet!
					</p>
				) : (
					<div className="mb-5 text-xs font-black text-black flex items-center justify-center gap-3 bg-white p-2.5 border-2 border-black">
						<span>ACCOUNT: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
						<button
							type="button"
							onClick={connect}
							className="underline text-blue-700 font-black uppercase cursor-pointer"
						>
							Change
						</button>
					</div>
				)}

				{/* Submission result */}
				{!isSubmitted ? (
					<div className="mb-6">
						{error && (
							<div className="mb-4 p-3 bg-red-100 border-2 border-black text-red-800 text-xs font-black uppercase">
								{error}
							</div>
						)}
						<button
							type="button"
							onClick={handleSubmitScore}
							disabled={isSubmitting}
							className="w-full bg-[#00F0FF] hover:bg-[#6ef5ff] disabled:opacity-50 text-black border-3 border-black py-3.5 font-black text-sm uppercase shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer transition-all"
						>
							{isSubmitting
								? "VERIFYING & RECORDING..."
								: isConnected
								? "SUBMIT SCORE ON-CHAIN"
								: "CONNECT WALLET TO SUBMIT"}
						</button>
					</div>
				) : (
					<div className="mb-6 p-4 bg-[#00FF66] border-3 border-black shadow-[4px_4px_0px_#000]">
						<div className="text-sm font-black text-black uppercase mb-1.5">
							VERIFIED & RECORDED ON-CHAIN
						</div>
						{txHash && /^[a-fA-F0-9]{64}$/.test(txHash) ? (
							<a
								href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
								target="_blank"
								rel="noopener noreferrer"
								className="text-xs font-bold text-black underline break-all block mt-2"
							>
								VIEW TRANSACTION ON STELLAR EXPERT ↗
							</a>
						) : txHash ? (
							<div className="text-[11px] font-mono text-black mt-1">
								REF: {txHash}
							</div>
						) : null}
					</div>
				)}

				{/* Actions */}
				<div className="flex gap-4">
					<button
						type="button"
						onClick={onRestart}
						className="flex-1 bg-[#00FF66] hover:bg-[#52ff99] text-black border-3 border-black py-3 font-black text-sm uppercase shadow-[3px_3px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer transition-all"
					>
						PLAY AGAIN
					</button>
					<button
						type="button"
						onClick={onShowLeaderboard}
						className="flex-1 bg-white hover:bg-gray-100 text-black border-3 border-black py-3 font-black text-sm uppercase shadow-[3px_3px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer transition-all"
					>
						LEADERBOARD
					</button>
				</div>
			</div>
		</div>
	);
};

export default GameOverModal;
