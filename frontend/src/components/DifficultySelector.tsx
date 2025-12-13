import { useGameStore } from "../store/gameStore";
import { DIFFICULTY_CONFIGS, type DifficultyLevel } from "../types/difficulty";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useEffect } from "react";

interface DifficultySelectorProps {
	onStart: () => void;
	onShowLeaderboard: () => void;
	onShowInstructions: () => void;
}

const DifficultySelector = ({
	onStart,
	onShowLeaderboard,
	onShowInstructions,
}: DifficultySelectorProps) => {
	const { difficulty, setDifficulty, setConnectedAddress } = useGameStore();
	const { open } = useAppKit();
	const { address, isConnected } = useAppKitAccount();

	// Update global connected address when wallet connection changes
	useEffect(() => {
		setConnectedAddress(address || null);
	}, [address, setConnectedAddress]);

	const difficultyLevels: DifficultyLevel[] = ["easy", "medium", "hard"];

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20 overflow-hidden">
			<div className="bg-white rounded-2xl p-4 sm:p-6 gap-3 flex flex-col max-w-sm sm:max-w-2xl max-h-[95vh] mx-2 text-center shadow-2xl overflow-hidden relative">
				<button
					onClick={onShowInstructions}
					className="absolute top-2 right-2 bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-xl transition-colors"
					title="View Instructions"
				>
					❓
				</button>
				<h1 className="text-2xl sm:text-4xl font-bold mb-2 text-blue-600">
					❄️ SnowMotion
				</h1>
				<p className="text-gray-700 mb-3 sm:mb-6 text-xs sm:text-base">
					Collect items in order to build snowmen!
					<br />
					❄️ → ⚫ → 🥕 → 🎩 (+ 🧣 for bonus) <br /> View Instructions at top
					right corner
				</p>

				<div className="mb-4 sm:mb-6">
					<h2 className="text-lg sm:text-2xl font-bold mb-3 text-gray-800">
						Select Difficulty
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
						{difficultyLevels.map((level) => {
							const config = DIFFICULTY_CONFIGS[level];
							const isSelected = difficulty === level;
							return (
								<button
									key={level}
									onClick={() => setDifficulty(level)}
									className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
										isSelected
											? "border-blue-600 bg-blue-50 scale-105"
											: "border-gray-300 border-dotted hover:border-blue-300 hover:bg-gray-50"
									}`}
								>
									<div className="text-sm sm:text-lg font-bold text-gray-800 mb-1">
										{config.label}
									</div>
									<div className="text-xs text-gray-600 mb-1">
										{config.description}
									</div>
								</button>
							);
						})}
					</div>
				</div>

				{/* Wallet Connection */}
				{!isConnected ? (
					<div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
						<p className="text-sm text-yellow-800 mb-2">
							Connect your wallet to play and submit scores
						</p>
						<button
							onClick={() => open()}
							className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
						>
							Connect Wallet
						</button>
					</div>
				) : (
					<div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
						<p className="text-sm text-green-800">
							✓ Wallet Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
						</p>
					</div>
				)}

				<div className="flex flex-col gap-2">
					<button
						onClick={onStart}
						disabled={!isConnected}
						className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-base sm:text-xl font-semibold transition-colors ${
							isConnected
								? "bg-blue-600 text-white hover:bg-blue-700"
								: "bg-gray-300 text-gray-500 cursor-not-allowed"
						}`}
					>
						Start Game
					</button>

					<button
						onClick={onShowLeaderboard}
						className="bg-gray-200 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-base sm:text-xl font-semibold hover:bg-gray-300 transition-colors flex-1"
					>
						View Leaderboard 🏆
					</button>
				</div>
			</div>
		</div>
	);
};

export default DifficultySelector;
