import { useGameStore } from "../store/gameStore";
import { DIFFICULTY_CONFIGS, type DifficultyLevel } from "../types/difficulty";

interface DifficultySelectorProps {
	onStart: () => void;
	onShowLeaderboard: () => void;
}

const DifficultySelector = ({
	onStart,
	onShowLeaderboard,
}: DifficultySelectorProps) => {
	const { difficulty, setDifficulty } = useGameStore();

	const difficultyLevels: DifficultyLevel[] = ["easy", "medium", "hard"];

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20 overflow-hidden">
			<div className="bg-white rounded-2xl p-4 sm:p-6 gap-3 flex flex-col max-w-sm sm:max-w-2xl max-h-[95vh] mx-2 text-center shadow-2xl overflow-hidden">
				<h1 className="text-2xl sm:text-4xl font-bold mb-2 text-blue-600">
					❄️ SnowMotion
				</h1>
				<p className="text-gray-700 mb-3 sm:mb-6 text-xs sm:text-base">
					Collect items in order to build snowmen!
					<br />
					❄️ → ⚫ → 🥕 → 🎩 (+ 🧣 for bonus)
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
											: "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
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

				<div className="flex flex-col gap-2">
					<button
						onClick={onStart}
						className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-base sm:text-xl font-semibold hover:bg-blue-700 transition-colors"
					>
						Start Game
					</button>
					<button
						onClick={onShowLeaderboard}
						className="bg-gray-200 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-base sm:text-xl font-semibold hover:bg-gray-300 transition-colors"
					>
						View Leaderboard 🏆
					</button>
				</div>
			</div>
		</div>
	);
};

export default DifficultySelector;
