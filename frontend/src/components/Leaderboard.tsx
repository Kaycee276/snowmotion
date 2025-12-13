import { useState, useEffect } from "react";
import type { Address } from "viem";
import type { DifficultyLevel } from "../types/difficulty";
import { useAppKitAccount } from "@reown/appkit/react";
import { gameApi } from "../services/gameApi";

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

const Leaderboard = ({ isOpen, onClose }: LeaderboardProps) => {
	const { address: connectedAddress } = useAppKitAccount();
	const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
	const [filteredEntries, setFilteredEntries] = useState<LeaderboardEntry[]>(
		[]
	);
	const [selectedDifficulty, setSelectedDifficulty] = useState<
		DifficultyLevel | "all"
	>("all");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isOpen) {
			loadLeaderboard();
			// Auto-refresh every 10 seconds
			const interval = setInterval(loadLeaderboard, 10000);
			return () => clearInterval(interval);
		}
	}, [isOpen]);

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

	useEffect(() => {
		if (selectedDifficulty === "all") {
			// Sort by normalized score for fair comparison across difficulties
			const normalizedEntries = [...entries].sort(
				(a, b) => getNormalizedScore(b) - getNormalizedScore(a)
			);
			setFilteredEntries(normalizedEntries);
		} else {
			// Sort by raw score within same difficulty
			const filtered = entries
				.filter((entry) => entry.difficulty === selectedDifficulty)
				.sort((a, b) => b.score - a.score);
			setFilteredEntries(filtered);
		}
	}, [entries, selectedDifficulty]);

	const loadLeaderboard = async () => {
		setIsLoading(true);
		try {
			const data = await gameApi.getLeaderboard();
			const formattedEntries: LeaderboardEntry[] = data.map(entry => ({
				...entry,
				address: entry.address as Address,
				difficulty: ['easy', 'medium', 'hard'][entry.difficulty] as DifficultyLevel
			}));
			setEntries(formattedEntries);
		} catch (error) {
			console.error("Error loading leaderboard:", error);
			// Fallback to localStorage
			const savedScores = localStorage.getItem("snowmotion-scores");
			if (savedScores) {
				const scores: LeaderboardEntry[] = JSON.parse(savedScores);
				setEntries(scores);
			} else {
				setEntries([]);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const formatAddress = (addr: Address) => {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-110">
			<div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
				<div className="flex justify-between items-start mb-6">
					<div>
						<h2 className="text-3xl font-bold text-blue-600">🏆 Leaderboard</h2>
						<div className="flex gap-2 mt-4">
							{(["all", "easy", "medium", "hard"] as const).map(
								(difficulty) => (
									<button
										key={difficulty}
										onClick={() => setSelectedDifficulty(difficulty)}
										className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
											selectedDifficulty === difficulty
												? "bg-blue-600 text-white"
												: "bg-gray-200 text-gray-700 hover:bg-gray-300"
										}`}
									>
										{difficulty === "all"
											? "All"
											: difficulty.charAt(0).toUpperCase() +
											  difficulty.slice(1)}
									</button>
								)
							)}
						</div>
						{selectedDifficulty === "all" && (
							<div className="mt-2 p-2 bg-blue-50 rounded-lg text-xs text-blue-700">
								💡 <strong>Fair Ranking:</strong> Scores are normalized (Easy:
								1x, Medium: 1.5x, Hard: 2x) for equal competition across
								difficulties
							</div>
						)}
					</div>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
					>
						×
					</button>
				</div>

				{isLoading ? (
					<div className="text-center py-12 text-gray-500">
						Loading leaderboard...
					</div>
				) : filteredEntries.length === 0 ? (
					<div className="text-center py-12 text-gray-500">
						No scores yet. Be the first to submit!
					</div>
				) : (
					<div className="overflow-y-auto flex-1">
						<div className="space-y-2">
							{filteredEntries.slice(0, 10).map((entry, index) => {
								const isMe =
									connectedAddress &&
									entry.address.toLowerCase() ===
										connectedAddress.toLowerCase();
								return (
									<div
										key={`${entry.address}-${entry.timestamp}`}
										className={`flex items-center justify-between p-4 rounded-lg ${
											index === 0
												? "bg-yellow-100 border-2 border-yellow-400"
												: index === 1
												? "bg-gray-100 border-2 border-gray-300"
												: index === 2
												? "bg-orange-100 border-2 border-orange-300"
												: "bg-gray-50 border border-gray-200"
										}`}
									>
										<div className="flex items-center gap-4">
											<div
												className={`text-2xl font-bold ${
													index === 0
														? "text-yellow-600"
														: index === 1
														? "text-gray-600"
														: index === 2
														? "text-orange-600"
														: "text-gray-400"
												}`}
											>
												{index === 0
													? "🥇"
													: index === 1
													? "🥈"
													: index === 2
													? "🥉"
													: `#${index + 1}`}
											</div>
											<div>
												<div className="font-mono text-sm text-gray-700 flex items-center gap-2">
													{formatAddress(entry.address)}
													{isMe && (
														<span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
															ME
														</span>
													)}
												</div>
												<div className="flex items-center gap-2 text-xs text-gray-500">
													<span>
														{new Date(entry.timestamp).toLocaleDateString()}
													</span>
													<span
														className={`px-2 py-0.5 rounded text-xs font-medium ${
															entry.difficulty === "easy"
																? "bg-green-100 text-green-700"
																: entry.difficulty === "medium"
																? "bg-yellow-100 text-yellow-700"
																: "bg-red-100 text-red-700"
														}`}
													>
														{entry.difficulty?.toUpperCase()}
													</span>
												</div>
											</div>
										</div>
										<div className="text-right">
											<div className="text-2xl font-bold text-blue-600">
												{selectedDifficulty === "all"
													? getNormalizedScore(entry)
													: entry.score}
											</div>
											{selectedDifficulty === "all" && (
												<div className="text-xs text-gray-500">
													Raw: {entry.score}
												</div>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}

				<div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
					<p className="text-sm text-gray-500 text-center">
						Scores are stored on-chain. Connect your wallet to see your ranking!
					</p>
					<div className="text-xs text-gray-400 text-center">
						<strong>Scoring:</strong> Easy (1x) • Medium (1.5x) • Hard (2x
						multiplier)
					</div>
				</div>
			</div>
		</div>
	);
};

export default Leaderboard;
