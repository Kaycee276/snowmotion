import { useState, useEffect } from "react";
import type { Address } from "viem";

interface LeaderboardEntry {
	address: Address;
	score: number;
	timestamp: number;
}

interface LeaderboardProps {
	isOpen: boolean;
	onClose: () => void;
}

const Leaderboard = ({ isOpen, onClose }: LeaderboardProps) => {
	const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isOpen) {
			loadLeaderboard();
		}
	}, [isOpen]);

	const loadLeaderboard = async () => {
		setIsLoading(true);
		try {
			// TODO: Fetch from smart contract or backend
			// For now, use mock data or localStorage
			const savedScores = localStorage.getItem("snowmotion-scores");
			if (savedScores) {
				const scores: LeaderboardEntry[] = JSON.parse(savedScores);
				setEntries(scores.sort((a, b) => b.score - a.score).slice(0, 10));
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
		<div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-40">
			<div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-3xl font-bold text-blue-600">🏆 Leaderboard</h2>
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
				) : entries.length === 0 ? (
					<div className="text-center py-12 text-gray-500">
						No scores yet. Be the first to submit!
					</div>
				) : (
					<div className="overflow-y-auto flex-1">
						<div className="space-y-2">
							{entries.map((entry, index) => (
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
											<div className="text-xs text-gray-500">
												{new Date(entry.timestamp).toLocaleDateString()}
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
