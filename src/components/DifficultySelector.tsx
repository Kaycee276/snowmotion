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
		<div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
			<div className="bg-white rounded-2xl p-6 sm:p-8 gap-4 flex flex-col max-w-2xl max-h-[90vh] overflow-y-auto mx-4 text-center shadow-2xl">
				<h1 className="text-3xl sm:text-4xl font-bold mb-4 text-blue-600">
					❄️ SnowMotion
				</h1>
				<p className="text-gray-700 mb-4 sm:mb-8 text-sm sm:text-base">
					Collect items in order to build snowmen!
					<br />
					❄️ → ⚫ → 🥕 → 🎩 (+ 🧣 for bonus)
				</p>

				<div className="mb-6 sm:mb-8">
					<h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
						Select Difficulty
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
						{difficultyLevels.map((level) => {
							const config = DIFFICULTY_CONFIGS[level];
							const isSelected = difficulty === level;
							return (
								<button
									key={level}
									onClick={() => setDifficulty(level)}
									className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
										isSelected
											? "border-blue-600 bg-blue-50 scale-105"
											: "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
									}`}
								>
									<div className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
										{config.label}
									</div>
									<div className="text-xs sm:text-sm text-gray-600 mb-2">
										{config.description}
									</div>
									<div className="text-xs text-gray-500 space-y-1">
										<div>
											Speed: {config.fallSpeedMin.toFixed(1)}x -{" "}
											{config.fallSpeedMax.toFixed(1)}x
										</div>
									</div>
								</button>
							);
						})}
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<button
						onClick={onStart}
						className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg text-lg sm:text-xl font-semibold hover:bg-blue-700 transition-colors"
					>
						Start Game
					</button>
					<button
						onClick={onShowLeaderboard}
						className="bg-gray-200 text-gray-700 px-6 sm:px-8 py-3 rounded-lg text-lg sm:text-xl font-semibold hover:bg-gray-300 transition-colors"
					>
						View Leaderboard 🏆
					</button>
				</div>
			</div>
		</div>
	);
};

export default DifficultySelector;
