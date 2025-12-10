import { useEffect, useCallback, useRef, useState } from "react";
import type { FallingItem } from "../types/game";
import { MAX_ITEMS_ON_SCREEN } from "../types/game";
import FallingItemComponent from "./FallingItem";
import SnowmanDisplay from "./SnowmanDisplay";
import GameOverModal from "./GameOverModal";
import WalletConnection from "./WalletConnection";
import Leaderboard from "./Leaderboard";
import DifficultySelector from "./DifficultySelector";
import { useGameStore } from "../store/gameStore";
import { getSmartSpawnItem } from "../utils/smartSpawn";
import { DIFFICULTY_CONFIGS } from "../types/difficulty";

const Game = () => {
	const {
		items,
		score,
		lives,
		isPlaying,
		isGameOver,
		currentSnowman,
		combo,
		difficulty,
		spawnItem,
		collectItem,
		startGame,
		resetGame,
		getNextItemId,
		getNextNeededItem,
	} = useGameStore();

	const spawnTimerRef = useRef<number | null>(null);
	const gameLoopRef = useRef<number | null>(null);
	const [showLeaderboard, setShowLeaderboard] = useState(false);

	const createAndSpawnItem = useCallback(() => {
		const state = useGameStore.getState();

		// Don't spawn if too many items on screen
		if (state.items.length >= MAX_ITEMS_ON_SCREEN) return;

		const nextNeededItem = state.getNextNeededItem();
		const config = DIFFICULTY_CONFIGS[difficulty];

		// Use smart spawning algorithm
		const itemType = getSmartSpawnItem(nextNeededItem);

		const newItem: FallingItem = {
			id: getNextItemId(),
			type: itemType,
			x: Math.random() * 80 + 10,
			y: -10,
			speed:
				Math.random() * (config.fallSpeedMax - config.fallSpeedMin) +
				config.fallSpeedMin,
		};
		spawnItem(newItem);
	}, [spawnItem, getNextItemId, difficulty]);

	useEffect(() => {
		if (!isPlaying) return;

		gameLoopRef.current = window.setInterval(() => {
			const state = useGameStore.getState();

			const updatedItems = state.items.map((item) => ({
				...item,
				y: item.y + item.speed,
			}));

			const itemsToAutoCollect = updatedItems.filter(
				(item) => item.y >= 85 && item.y <= 95
			);

			// Remove items that fell off screen (y > 110) and items in collection zone
			const itemsToKeep = updatedItems.filter(
				(item) => item.y < 85 && item.y <= 110
			);

			useGameStore.setState({ items: itemsToKeep });

			itemsToAutoCollect.forEach((item) => {
				collectItem(item.id, item.type);
			});
		}, 32);

		return () => {
			if (gameLoopRef.current) {
				clearInterval(gameLoopRef.current);
			}
		};
	}, [isPlaying, collectItem]);

	useEffect(() => {
		if (!isPlaying || isGameOver) return;

		const config = DIFFICULTY_CONFIGS[difficulty];

		const spawnNext = () => {
			createAndSpawnItem();
			const nextInterval =
				Math.random() * (config.spawnIntervalMax - config.spawnIntervalMin) +
				config.spawnIntervalMin;
			spawnTimerRef.current = window.setTimeout(spawnNext, nextInterval);
		};

		spawnNext();

		return () => {
			if (spawnTimerRef.current) {
				clearTimeout(spawnTimerRef.current);
			}
		};
	}, [isPlaying, isGameOver, difficulty, createAndSpawnItem]);

	const handleStartGame = () => {
		startGame();
	};

	const handleRestart = () => {
		resetGame();
		startGame();
	};

	const nextNeededItem = getNextNeededItem();
	const config = DIFFICULTY_CONFIGS[difficulty];

	return (
		<div
			className="fixed inset-0 w-full h-full bg-linear-to-b from-blue-400 via-blue-300 to-white overflow-hidden"
			style={{
				backgroundImage: "url(/snow-bg-2.jpg)",
				backgroundSize: "cover",
				backgroundPosition: "center",
				height: "100vh",
			}}
		>
			{/* Game UI - Responsive */}
			<div className="absolute top-1 sm:top-2 left-1 sm:left-2 right-1 sm:right-2 z-10 flex flex-col sm:flex-row justify-between items-start gap-1 sm:gap-2">
				{/* Score & Combo */}
				<div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1 sm:py-2 shadow-lg w-full sm:w-auto">
					<div className="text-sm sm:text-xl font-bold text-blue-600">
						Score: <span className="transition-all duration-300">{score}</span>
					</div>
					<div className="text-xs sm:text-base text-gray-600">
						Combo: {combo}
					</div>
					{isPlaying && nextNeededItem && (
						<div className="text-xs sm:text-sm text-gray-500 mt-1">
							Next:{" "}
							{nextNeededItem === "snowball"
								? "❄️"
								: nextNeededItem === "coal"
								? "⚫"
								: nextNeededItem === "carrot"
								? "🥕"
								: "🎩"}
						</div>
					)}
				</div>

				{/* Lives & Wallet - Right side */}
				<div className="flex flex-row sm:flex-row gap-1 sm:gap-2 items-start w-full sm:w-auto">
					{/* Lives */}
					<div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1 sm:py-2 shadow-lg shrink-0">
						<div className="text-sm sm:text-xl font-bold text-red-600">
							❤️ {lives}
						</div>
						{isPlaying && (
							<div className="text-xs text-gray-500 mt-1">{config.label}</div>
						)}
					</div>

					{/* Wallet Connection */}
					<div className="bg-white/90 backdrop-blur-sm rounded-lg px-1 sm:px-2 py-1 sm:py-2 shadow-lg flex-1 sm:flex-initial">
						<WalletConnection />
					</div>
				</div>
			</div>

			{/* Collection Zone Indicator */}
			{isPlaying && (
				<div className="absolute bottom-8 sm:bottom-10 left-0 right-0 h-8 sm:h-10 z-5 border-t-4 border-dashed border-yellow-400 bg-yellow-200/30 backdrop-blur-sm">
					<div className="text-center text-yellow-700 font-semibold text-xs pt-1 px-2">
						Collection Zone - Items auto-collect here!
					</div>
				</div>
			)}

			{/* Snowman Display */}
			<SnowmanDisplay currentSnowman={currentSnowman} />

			{/* Game Area */}
			<div
				className="absolute inset-0 w-full h-full"
				style={{ touchAction: "none" }}
			>
				{items.map((item) => (
					<FallingItemComponent
						key={item.id}
						item={item}
						onCollect={() => collectItem(item.id, item.type)}
					/>
				))}
			</div>

			{/* Difficulty Selector / Start Screen */}
			{!isPlaying && !isGameOver && (
				<DifficultySelector
					onStart={handleStartGame}
					onShowLeaderboard={() => setShowLeaderboard(true)}
				/>
			)}

			{/* Game Over Modal */}
			{isGameOver && (
				<GameOverModal
					score={score}
					onRestart={handleRestart}
					difficulty={difficulty}
				/>
			)}

			{/* Leaderboard */}
			<Leaderboard
				isOpen={showLeaderboard}
				onClose={() => setShowLeaderboard(false)}
			/>
		</div>
	);
};

export default Game;
