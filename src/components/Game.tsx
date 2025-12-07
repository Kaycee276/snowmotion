import { useEffect, useCallback, useRef, useState } from "react";
import type { FallingItem } from "../types/game";
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
		timeRemaining,
		isPlaying,
		isGameOver,
		currentSnowman,
		combo,
		difficulty,
		spawnItem,
		collectItem,
		setTimeRemaining,
		setIsPlaying,
		setIsGameOver,
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
		const nextNeededItem = state.getNextNeededItem();
		const config = DIFFICULTY_CONFIGS[difficulty];

		// Use smart spawning algorithm
		const itemType = getSmartSpawnItem(nextNeededItem, difficulty);

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
			const itemsToKeep = updatedItems.filter(
				(item) => item.y < 85 || item.y > 95
			);

			useGameStore.setState({ items: itemsToKeep });

			itemsToAutoCollect.forEach((item) => {
				collectItem(item.id, item.type);
			});
		}, 16);

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

	useEffect(() => {
		if (!isPlaying || isGameOver) return;

		const timer = setInterval(() => {
			const currentTime = useGameStore.getState().timeRemaining;
			const newTime = currentTime - 1;
			setTimeRemaining(newTime);
			if (newTime <= 0) {
				setIsPlaying(false);
				setIsGameOver(true);
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [isPlaying, isGameOver, setTimeRemaining, setIsPlaying, setIsGameOver]);

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
		<div className="relative w-full h-screen bg-linear-to-b from-blue-400 via-blue-300 to-white overflow-hidden">
			{/* Game UI */}
			<div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start gap-4">
				<div className="bg-white/90 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg">
					<div className="text-2xl font-bold text-blue-600">
						Score: <span className="transition-all duration-300">{score}</span>
					</div>
					<div className="text-lg text-gray-600">Combo: {combo}</div>
					{isPlaying && nextNeededItem && (
						<div className="text-sm text-gray-500 mt-1">
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

				<div className="flex gap-4 items-start">
					<div className="bg-white/90 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg">
						<div className="text-2xl font-bold text-red-600">
							{Math.floor(timeRemaining / 60)}:
							{(timeRemaining % 60).toString().padStart(2, "0")}
						</div>
						{isPlaying && (
							<div className="text-xs text-gray-500 mt-1">{config.label}</div>
						)}
					</div>

					<div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
						<WalletConnection />
					</div>
				</div>
			</div>

			{/* Collection Zone Indicator */}
			{isPlaying && (
				<div className="absolute bottom-10 left-0 right-0 h-12 z-5 border-t-4 border-dashed border-yellow-400 bg-yellow-200/30 backdrop-blur-sm">
					<div className="text-center text-yellow-700 font-semibold text-sm pt-2">
						Collection Zone - Items auto-collect here! (or click anywhere to
						collect)
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
			{isGameOver && <GameOverModal score={score} onRestart={handleRestart} />}

			{/* Leaderboard */}
			<Leaderboard
				isOpen={showLeaderboard}
				onClose={() => setShowLeaderboard(false)}
			/>
		</div>
	);
};

export default Game;
