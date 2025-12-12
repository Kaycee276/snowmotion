import { useEffect, useCallback, useRef, useState } from "react";
import type { FallingItem } from "../types/game";
import { MAX_ITEMS_ON_SCREEN, MIN_ITEMS_ON_SCREEN } from "../types/game";
import FallingItemComponent from "./FallingItem";
import SnowmanDisplay from "./SnowmanDisplay";
import GameOverModal from "./GameOverModal";
import Leaderboard from "./Leaderboard";
import DifficultySelector from "./DifficultySelector";
import Timer from "./Timer";
import GameInstructions from "./GameInstructions";
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
		timerSeconds,
		timerActive,
		spawnItem,
		collectItem,
		startGame,
		resetGame,
		getNextItemId,
		getNextNeededItem,
		decrementTimer,
	} = useGameStore();

	const spawnTimerRef = useRef<number | null>(null);
	const gameLoopRef = useRef<number | null>(null);
	const countdownTimerRef = useRef<number | null>(null);
	const [showLeaderboard, setShowLeaderboard] = useState(false);
	const [showInstructions, setShowInstructions] = useState(false);

	const createAndSpawnItem = useCallback(() => {
		const state = useGameStore.getState();

		if (state.items.length >= MAX_ITEMS_ON_SCREEN) return;

		const nextNeededItem = state.getNextNeededItem();
		const config = DIFFICULTY_CONFIGS[difficulty];

		// Use advanced smart spawning algorithm with game context
		const itemType = getSmartSpawnItem({
			nextNeededItem,
			currentItems: state.items.map((item) => item.type),
			timerSeconds: state.timerSeconds,
			combo: state.combo,
			difficulty: state.difficulty,
			lives: state.lives,
		});

		// Calculate dynamic speed based on score and difficulty
		const speedMultiplier = 1 + state.score * 0.02 + state.combo * 0.05;
		const difficultySpeedBoost = {
			easy: 1,
			medium: 1.2,
			hard: 1.5,
		}[difficulty];

		const baseSpeed =
			Math.random() * (config.fallSpeedMax - config.fallSpeedMin) +
			config.fallSpeedMin;
		const finalSpeed = Math.min(
			baseSpeed * speedMultiplier * difficultySpeedBoost,
			2.0
		);

		const newItem: FallingItem = {
			id: getNextItemId(),
			type: itemType,
			x: Math.random() * 80 + 10,
			y: -10,
			speed: finalSpeed,
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
			const state = useGameStore.getState();
			createAndSpawnItem();

			// Spawn faster if below minimum items
			const isLowItems = state.items.length < MIN_ITEMS_ON_SCREEN;
			const intervalMultiplier = isLowItems ? 0.3 : 1;

			const nextInterval =
				(Math.random() * (config.spawnIntervalMax - config.spawnIntervalMin) +
					config.spawnIntervalMin) *
				intervalMultiplier;
			spawnTimerRef.current = window.setTimeout(spawnNext, nextInterval);
		};

		spawnNext();

		return () => {
			if (spawnTimerRef.current) {
				clearTimeout(spawnTimerRef.current);
			}
		};
	}, [isPlaying, isGameOver, difficulty, createAndSpawnItem]);

	// Timer countdown effect
	useEffect(() => {
		if (!timerActive || !isPlaying) {
			if (countdownTimerRef.current) {
				clearInterval(countdownTimerRef.current);
			}
			return;
		}

		countdownTimerRef.current = window.setInterval(() => {
			decrementTimer();
		}, 1000);

		return () => {
			if (countdownTimerRef.current) {
				clearInterval(countdownTimerRef.current);
			}
		};
	}, [timerActive, isPlaying, decrementTimer]);

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
			className={`fixed inset-0 w-full h-full bg-linear-to-b from-blue-400 via-blue-300 to-white overflow-hidden transition-all duration-1000 `}
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
				<div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1 sm:py-2 shadow-lg w-full sm:text-center md:w-1/6 tracking-widest">
					<div className="text-lg font-bold text-blue-600">
						Score: <span className="transition-all duration-300">{score}</span>
					</div>
					<div className="text-base text-gray-600">Combo: {combo}</div>

					{isPlaying && nextNeededItem && (
						<div className="text-lg text-gray-500  ">
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

				<div className="flex flex-row sm:flex-row gap-1 sm:gap-2 items-start w-full sm:w-auto justify-between sm:justify-end">
					{/* Lives */}
					<div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1 sm:py-2 shadow-lg shrink-0">
						<div className="text-sm sm:text-xl font-bold text-red-600">
							❤️ {lives}
						</div>
						{isPlaying && (
							<div className="text-xs text-gray-500 mt-1">{config.label}</div>
						)}
					</div>
				</div>
			</div>

			{isPlaying && (
				<div className="absolute bottom-8 left-0 right-0 h-8 sm:h-10 z-5 border-t-4 border-dashed border-yellow-400 "></div>
			)}

			{/* Timer Display */}
			<Timer seconds={timerSeconds} isActive={timerActive} />

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

			{/* Game Instructions */}
			{showInstructions && (
				<GameInstructions 
					onClose={() => setShowInstructions(false)}
					showStartButton={false}
				/>
			)}

			{/* Difficulty Selector / Start Screen */}
			{!isPlaying && !isGameOver && (
				<DifficultySelector
					onStart={handleStartGame}
					onShowLeaderboard={() => setShowLeaderboard(true)}
					onShowInstructions={() => setShowInstructions(true)}
				/>
			)}

			{/* Game Over Modal */}
			{isGameOver && (
				<GameOverModal
					score={score}
					onRestart={handleRestart}
					difficulty={difficulty}
					onShowLeaderboard={() => setShowLeaderboard(true)}
					onShowInstructions={() => setShowInstructions(true)}
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
