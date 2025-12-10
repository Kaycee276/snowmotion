import { useState, useEffect } from "react";
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

const Leaderboard = ({ isOpen, onClose }: LeaderboardProps) => {
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
		}
	}, [isOpen]);

	useEffect(() => {
		if (selectedDifficulty === "all") {
			setFilteredEntries(entries);
		} else {
			setFilteredEntries(
				entries.filter((entry) => entry.difficulty === selectedDifficulty)
			);
		}
	}, [entries, selectedDifficulty]);

	const loadLeaderboard = async () => {
		setIsLoading(true);
		try {
			// TODO: Fetch from smart contract or backend
			// For now, use mock data or localStorage
			const savedScores = localStorage.getItem("snowmotion-scores");
			if (savedScores) {
				const scores: LeaderboardEntry[] = JSON.parse(savedScores);
				setEntries(scores.sort((a, b) => b.score - a.score));
			} else {
				setEntries([]);
			}
		} catch (error) {
			console.error("Error loading leaderboard:", error);
			setEntries([]);
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
			<div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
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
							{filteredEntries.slice(0, 10).map((entry, index) => (
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
											<div className="font-mono text-sm text-gray-700">
												{formatAddress(entry.address)}
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
									<div className="text-2xl font-bold text-blue-600">
										{entry.score}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				<div className="mt-6 pt-6 border-t border-gray-200">
					<p className="text-sm text-gray-500 text-center">
						Scores are stored on-chain. Connect your wallet to see your ranking!
					</p>
				</div>
			</div>
		</div>
	);
};

export default Leaderboard;
