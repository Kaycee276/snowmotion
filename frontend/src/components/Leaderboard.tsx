import React, { useState, useEffect } from "react";
import { gameApi } from "../services/gameApi";
import { useGameStore } from "../store/gameStore";
import type { Address } from "viem";
import type { DifficultyLevel } from "../types/difficulty";

interface LeaderboardEntry {
	address: Address;
	score: number;
	timestamp: number;
	difficulty: DifficultyLevel;
}

interface LeaderboardProps {
	isOpen: boolean;
	onClose: () => void;
}

// Difficulty multipliers for fair ranking
const getDifficultyMultiplier = (difficulty: DifficultyLevel): number => {
	switch (difficulty) {
		case "easy":
			return 1;
		case "medium":
			return 1.5;
		case "hard":
			return 2;
		default:
			return 1;
	}
};

const getNormalizedScore = (entry: LeaderboardEntry): number => {
	return Math.round(entry.score * getDifficultyMultiplier(entry.difficulty));
};

const Leaderboard: React.FC<LeaderboardProps> = ({ isOpen, onClose }) => {
	const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
	const [filteredEntries, setFilteredEntries] = useState<LeaderboardEntry[]>([]);
	const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | "all">("all");
	const [isLoading, setIsLoading] = useState(false);
	const { connectedAddress } = useGameStore();

	const loadLeaderboard = async () => {
		setIsLoading(true);
		try {
			const data = await gameApi.getLeaderboard();
			const formattedEntries: LeaderboardEntry[] = data.map((entry) => ({
				...entry,
				address: entry.address as Address,
				difficulty: (["easy", "medium", "hard"][entry.difficulty] || "medium") as DifficultyLevel,
			}));
			setEntries(formattedEntries);
		} catch (error) {
			console.error("Error loading leaderboard:", error);
			// Fallback to localStorage
			try {
				const savedScores = localStorage.getItem("snowmotion-scores");
				if (savedScores) {
					setEntries(JSON.parse(savedScores));
				}
			} catch (localError) {
				console.error("Error loading local scores:", localError);
			}
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			loadLeaderboard();
			const interval = setInterval(loadLeaderboard, 10000);
			return () => clearInterval(interval);
		}
	}, [isOpen]);

	useEffect(() => {
		if (selectedDifficulty === "all") {
			const normalized = [...entries].sort(
				(a, b) => getNormalizedScore(b) - getNormalizedScore(a)
			);
			setFilteredEntries(normalized);
		} else {
			const filtered = entries
				.filter((entry) => entry.difficulty === selectedDifficulty)
				.sort((a, b) => b.score - a.score);
			setFilteredEntries(filtered);
		}
	}, [entries, selectedDifficulty]);

	if (!isOpen) return null;

	const formatAddress = (address: string) => {
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-xs z-50 p-2 sm:p-4 overflow-y-auto">
			<div className="bg-[#FFFDF0] border-4 border-black rounded-3xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[8px_8px_0px_#000] relative">
				{/* Header */}
				<div className="flex items-start justify-between pb-3 border-b-3 border-black mb-3">
					<div>
						<div className="inline-block bg-[#FFE600] border-2 border-black px-3 py-1 rounded-xl shadow-[2px_2px_0px_#000] mb-1">
							<h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
								🏆 STELLAR LEADERBOARD
							</h2>
						</div>
						<p className="text-xs font-bold text-gray-700">
							Verified scores submitted to the Stellar smart contract
						</p>
					</div>
					<button
						onClick={onClose}
						className="bg-black text-white hover:bg-red-600 border-2 border-black w-8 h-8 rounded-xl font-black text-lg flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#000]"
					>
						✕
					</button>
				</div>

				{/* Filter Tabs */}
				<div className="flex flex-wrap gap-2 mb-3">
					{(["all", "easy", "medium", "hard"] as const).map((diff) => {
						const isSelected = selectedDifficulty === diff;
						return (
							<button
								key={diff}
								onClick={() => setSelectedDifficulty(diff)}
								className={`px-3 py-1 rounded-xl font-black text-xs uppercase border-2 border-black cursor-pointer transition-all ${
									isSelected
										? "bg-[#00F0FF] shadow-[3px_3px_0px_#000] -translate-y-0.5 text-black"
										: "bg-white hover:bg-gray-100 shadow-[1px_1px_0px_#000] text-gray-800"
								}`}
							>
								{diff === "all" ? "⭐ All Difficulties" : diff}
							</button>
						);
					})}
				</div>

				{/* Notice */}
				{selectedDifficulty === "all" && (
					<div className="mb-3 px-3 py-1.5 bg-[#00FF66]/30 border-2 border-black rounded-xl text-[11px] font-bold text-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000]">
						<span>💡</span>
						<span>Scores are normalized (Easy: 1x, Medium: 1.5x, Hard: 2x) for competitive fairness!</span>
					</div>
				)}

				{/* Table / List */}
				<div className="flex-1 overflow-y-auto space-y-2 pr-1">
					{isLoading ? (
						<div className="text-center py-12 font-black text-sm text-gray-600">
							LOADING BLOCKCHAIN SCORES...
						</div>
					) : filteredEntries.length === 0 ? (
						<div className="text-center py-12 font-black text-sm text-gray-600">
							NO SCORES YET. BE THE FIRST TO BUILD!
						</div>
					) : (
						filteredEntries.map((entry, idx) => {
							const isMe =
								connectedAddress &&
								entry.address.toLowerCase() === connectedAddress.toLowerCase();

							const medalBg =
								idx === 0
									? "bg-[#FFE600]"
									: idx === 1
									? "bg-[#E0E0E0]"
									: idx === 2
									? "bg-[#FFAB91]"
									: "bg-white";

							return (
								<div
									key={`${entry.address}-${entry.timestamp}-${idx}`}
									className={`flex items-center justify-between p-3 rounded-2xl border-3 border-black shadow-[3px_3px_0px_#000] transition-all ${medalBg} ${
										isMe ? "ring-2 ring-[#FF007A]" : ""
									}`}
								>
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 rounded-xl bg-black text-white font-black text-sm flex items-center justify-center">
											#{idx + 1}
										</div>
										<div>
											<div className="font-black text-xs sm:text-sm text-black flex items-center gap-1.5">
												<span>{formatAddress(entry.address)}</span>
												{isMe && (
													<span className="bg-[#FF007A] text-white text-[9px] font-black px-1.5 rounded border border-black">
														YOU
													</span>
												)}
											</div>
											<div className="text-[10px] font-bold uppercase text-gray-600">
												{entry.difficulty} mode • {new Date(entry.timestamp).toLocaleDateString()}
											</div>
										</div>
									</div>

									<div className="text-right">
										<div className="font-black text-lg sm:text-xl text-black">
											{selectedDifficulty === "all" ? getNormalizedScore(entry) : entry.score}
										</div>
										<div className="text-[9px] font-bold text-gray-600 uppercase">
											{selectedDifficulty === "all" ? "Normalized" : "Points"}
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
};

export default Leaderboard;
