import React, { useState, useEffect } from "react";
import { gameApi } from "../services/gameApi";
import { useGameStore } from "../store/gameStore";
import type { DifficultyLevel } from "../types/difficulty";

interface LeaderboardEntry {
	address: string;
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
				address: String(entry.address),
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
		<div className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-xs z-50 p-4 sm:p-6 overflow-y-auto">
			<div className="bg-[#FFFDF0] border-4 border-black p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[8px_8px_0px_#000] relative">
				{/* Header */}
				<div className="flex items-start justify-between pb-4 border-b-3 border-black mb-5">
					<div>
						<div className="inline-block bg-[#FFE600] border-3 border-black px-4 py-1.5 shadow-[3px_3px_0px_#000] mb-2">
							<h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
								STELLAR LEADERBOARD
							</h2>
						</div>
						<p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
							Verified scores submitted to the Stellar smart contract
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="bg-black text-white hover:bg-red-600 border-2 border-black w-9 h-9 font-black text-lg flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
					>
						✕
					</button>
				</div>

				{/* Filter Tabs */}
				<div className="flex flex-wrap gap-2.5 mb-5">
					{(["all", "easy", "medium", "hard"] as const).map((diff) => {
						const isSelected = selectedDifficulty === diff;
						return (
							<button
								key={diff}
								type="button"
								onClick={() => setSelectedDifficulty(diff)}
								className={`px-4 py-2 font-black text-xs uppercase border-2 border-black cursor-pointer transition-all ${
									isSelected
										? "bg-[#00F0FF] shadow-[3px_3px_0px_#000] -translate-y-0.5 text-black"
										: "bg-white hover:bg-gray-100 shadow-[2px_2px_0px_#000] text-gray-800"
								}`}
							>
								{diff === "all" ? "ALL DIFFICULTIES" : diff}
							</button>
						);
					})}
				</div>

				{/* Notice */}
				{selectedDifficulty === "all" && (
					<div className="mb-5 px-4 py-2.5 bg-[#00FF66]/20 border-2 border-black text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000]">
						Scores are normalized (Easy: 1x, Medium: 1.5x, Hard: 2x) for competitive fairness
					</div>
				)}

				{/* Table / List */}
				<div className="flex-1 overflow-y-auto space-y-3 pr-1">
					{isLoading ? (
						<div className="text-center py-16 font-black text-sm text-gray-600 uppercase tracking-wider">
							Loading blockchain scores...
						</div>
					) : filteredEntries.length === 0 ? (
						<div className="text-center py-16 font-black text-sm text-gray-600 uppercase tracking-wider">
							No scores yet. Be the first to build!
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
									className={`flex items-center justify-between p-4 border-3 border-black shadow-[3px_3px_0px_#000] transition-all ${medalBg} ${
										isMe ? "ring-3 ring-[#FF007A]" : ""
									}`}
								>
									<div className="flex items-center gap-4">
										<div className="w-9 h-9 bg-black text-white font-black text-sm flex items-center justify-center shrink-0">
											#{idx + 1}
										</div>
										<div>
											<div className="font-black text-xs sm:text-sm text-black flex items-center gap-2">
												<span>{formatAddress(entry.address)}</span>
												{isMe && (
													<span className="bg-[#FF007A] text-white text-[9px] font-black px-2 py-0.5 border border-black uppercase">
														YOU
													</span>
												)}
											</div>
											<div className="text-[10px] font-black uppercase text-gray-600 mt-0.5">
												{entry.difficulty} mode • {new Date(entry.timestamp).toLocaleDateString()}
											</div>
										</div>
									</div>

									<div className="text-right">
										<div className="font-black text-xl sm:text-2xl text-black">
											{selectedDifficulty === "all" ? getNormalizedScore(entry) : entry.score}
										</div>
										<div className="text-[9px] font-black text-gray-600 uppercase">
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
