import React, { useEffect, useCallback, useRef, useState } from "react";
import type { FallingItem, ItemType } from "../types/game";
import { MAX_ITEMS_ON_SCREEN, MIN_ITEMS_ON_SCREEN } from "../types/game";
import FallingItemComponent from "./FallingItem";
import CharacterDisplay from "./CharacterDisplay";
import GameOverModal from "./GameOverModal";
import Leaderboard from "./Leaderboard";
import DifficultySelector from "./DifficultySelector";
import Timer from "./Timer";
import GameInstructions from "./GameInstructions";
import StellarWalletModal from "./StellarWalletModal";
import Item3D from "./Item3D";
import { useGameStore } from "../store/gameStore";
import { getSmartSpawnItem } from "../utils/smartSpawn";
import { DIFFICULTY_CONFIGS } from "../types/difficulty";
import { sound } from "../utils/soundEffects";

const Game: React.FC = () => {
	const {
		items,
		score,
		lives,
		isPlaying,
		isGameOver,
		combo,
		difficulty,
		timerSeconds,
		timerActive,
		isBlizzardActive,
		powerupMessage,
		lifeLossEffect,
		connectedAddress,
		isWalletModalOpen,
		openWalletModal,
		closeWalletModal,
		setConnectedAddress,
		setConnectedWalletName,
		spawnItem,
		collectItem,
		startGame,
		resetGame,
		getNextItemId,
		getNextNeededItem,
		decrementTimer,
		tickBlizzard,
	} = useGameStore();

	const spawnTimerRef = useRef<number | null>(null);
	const animFrameRef = useRef<number | null>(null);
	const lastTickTimeRef = useRef<number>(0);
	const countdownTimerRef = useRef<number | null>(null);
	const [showLeaderboard, setShowLeaderboard] = useState(false);
	const [showInstructions, setShowInstructions] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isMuted, setIsMuted] = useState(sound.getMuted());

	const handleSoundToggle = () => {
		const muted = sound.toggleMute();
		setIsMuted(muted);
	};

	const createAndSpawnItem = useCallback(() => {
		const state = useGameStore.getState();
		if (state.items.length >= MAX_ITEMS_ON_SCREEN) return;

		const nextNeededItem = state.getNextNeededItem();
		const config = DIFFICULTY_CONFIGS[difficulty];

		const itemType = getSmartSpawnItem({
			characterId: state.selectedCharacter,
			nextNeededItem,
			currentItems: state.items.map((i) => i.type),
			timerSeconds: state.timerSeconds,
			combo: state.combo,
			difficulty: state.difficulty,
			lives: state.lives,
		});

		// Dynamic speed based on score and combo
		const speedMultiplier = 1 + state.score * 0.015 + state.combo * 0.03;
		const difficultySpeedBoost = {
			easy: 0.9,
			medium: 1.15,
			hard: 1.45,
		}[difficulty];

		const baseSpeed =
			Math.random() * (config.fallSpeedMax - config.fallSpeedMin) +
			config.fallSpeedMin;
		const finalSpeed = Math.min(
			baseSpeed * speedMultiplier * difficultySpeedBoost,
			1.8
		);

		const newItem: FallingItem = {
			id: getNextItemId(),
			type: itemType,
			x: Math.random() * 76 + 12, // Keep within 12% - 88% width
			y: -8,
			speed: finalSpeed,
		};
		spawnItem(newItem);
	}, [spawnItem, getNextItemId, difficulty]);

	// Smooth requestAnimationFrame Game Loop
	useEffect(() => {
		if (!isPlaying || isGameOver) {
			if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
			return;
		}

		lastTickTimeRef.current = performance.now();

		const tick = (now: number) => {
			const dt = Math.min((now - lastTickTimeRef.current) / 16.666, 2.5); // normalize to ~60fps
			lastTickTimeRef.current = now;

			const state = useGameStore.getState();
			const blizzardFactor = state.isBlizzardActive ? 0.45 : 1.0;

			// Advance positions
			const updatedItems = state.items.map((item) => ({
				...item,
				y: item.y + item.speed * dt * blizzardFactor,
			}));

			// Remove items that fell completely off screen (> 108%)
			// Missed items simply despawn WITHOUT triggering false wrong-item penalties!
			const itemsToKeep = updatedItems.filter((item) => item.y <= 108);

			if (itemsToKeep.length !== state.items.length || updatedItems.some((it, i) => it.y !== state.items[i]?.y)) {
				useGameStore.setState({ items: itemsToKeep });
			}

			animFrameRef.current = requestAnimationFrame(tick);
		};

		animFrameRef.current = requestAnimationFrame(tick);

		return () => {
			if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
		};
	}, [isPlaying, isGameOver]);

	// Item spawning loop
	useEffect(() => {
		if (!isPlaying || isGameOver) return;

		const config = DIFFICULTY_CONFIGS[difficulty];

		const spawnNext = () => {
			const state = useGameStore.getState();
			createAndSpawnItem();

			const isLowItems = state.items.length < MIN_ITEMS_ON_SCREEN;
			const intervalMultiplier = isLowItems ? 0.35 : 1.0;

			const nextInterval =
				(Math.random() * (config.spawnIntervalMax - config.spawnIntervalMin) +
					config.spawnIntervalMin) *
				intervalMultiplier;

			spawnTimerRef.current = window.setTimeout(spawnNext, nextInterval);
		};

		spawnNext();

		return () => {
			if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
		};
	}, [isPlaying, isGameOver, difficulty, createAndSpawnItem]);

	// Second-based timer countdown effect
	useEffect(() => {
		if (!timerActive || !isPlaying) {
			if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
			return;
		}

		countdownTimerRef.current = window.setInterval(() => {
			decrementTimer();
			tickBlizzard();
		}, 1000);

		return () => {
			if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
		};
	}, [timerActive, isPlaying, decrementTimer, tickBlizzard]);

	const handleStartGame = async () => {
		setErrorMessage(null);
		try {
			await startGame();
		} catch {
			setErrorMessage("Failed to start game. Please connect your wallet first.");
			setTimeout(() => setErrorMessage(null), 4000);
		}
	};

	const handleRestart = async () => {
		setErrorMessage(null);
		resetGame();
		try {
			await startGame();
		} catch {
			setErrorMessage("Failed to restart game. Please connect your wallet first.");
			setTimeout(() => setErrorMessage(null), 4000);
		}
	};

	const nextNeededItem = getNextNeededItem();
	const config = DIFFICULTY_CONFIGS[difficulty];

	return (
		<div
			className={`fixed inset-0 w-full h-full overflow-hidden select-none bg-[#E0F7FA] ${
				lifeLossEffect ? "ring-8 ring-red-600 animate-shake" : ""
			}`}
			style={{
				backgroundImage: `radial-gradient(#000 1px, transparent 1px), radial-gradient(#000 1px, #E0F7FA 1px)`,
				backgroundSize: "40px 40px",
				backgroundPosition: "0 0, 20px 20px",
			}}
		>
			{/* Blizzard Active Overlay Effect */}
			{isBlizzardActive && (
				<div className="absolute inset-0 pointer-events-none z-10 bg-cyan-400/15 border-8 border-[#00E5FF] animate-pulse" />
			)}

			{/* Error Banner */}
			{errorMessage && (
				<div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-[#FF007A] border-3 border-black text-white px-4 py-2 rounded-xl shadow-[4px_4px_0px_#000] font-black text-xs sm:text-sm">
					{errorMessage}
				</div>
			)}

			{/* Power-up Floating Toast Message */}
			{powerupMessage && (
				<div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-40 bg-[#FFE600] border-4 border-black text-black px-5 py-2.5 rounded-2xl shadow-[6px_6px_0px_#000] font-black text-sm sm:text-lg uppercase tracking-wide animate-bounce">
					{powerupMessage}
				</div>
			)}

			{/* Top Game HUD */}
			<div className="absolute top-2 left-2 right-2 z-20 flex justify-between items-start gap-2">
				{/* Score, Combo & Next Item Badge */}
				<div className="bg-[#FFFDF0] border-3 border-black shadow-[4px_4px_0px_#000] rounded-2xl p-2 sm:p-3 flex items-center gap-3">
					<div>
						<div className="font-black text-sm sm:text-lg text-black uppercase leading-tight">
							Score: <span className="text-[#FF007A]">{score}</span>
						</div>
						<div className="font-bold text-[11px] sm:text-xs text-gray-700">
							Combo: <span className="text-black font-black">x{combo}</span>
						</div>
					</div>

					{isPlaying && nextNeededItem && (
						<div className="pl-3 border-l-2 border-black flex items-center gap-2">
							<div className="text-[10px] sm:text-xs font-black uppercase text-gray-700">
								NEXT:
							</div>
							<div className="w-8 h-8 sm:w-10 sm:h-10 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#000]">
								<Item3D type={nextNeededItem as ItemType} size={30} />
							</div>
						</div>
					)}
				</div>

				{/* Right Side: Wallet, Lives, Audio & Help Controls */}
				<div className="flex items-center gap-1.5 sm:gap-2">
					{/* Stellar Wallet Button */}
					<button
						type="button"
						onClick={openWalletModal}
						className={`border-3 border-black rounded-2xl px-2.5 py-1.5 font-black text-xs uppercase cursor-pointer shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1 ${
							connectedAddress
								? "bg-[#00FF66] text-black"
								: "bg-[#FFE600] text-black hover:bg-[#fff04d]"
						}`}
						title={connectedAddress || "Connect Stellar Wallet"}
					>
						<span>⭐</span>
						<span className="hidden sm:inline">
							{connectedAddress
								? `${connectedAddress.slice(0, 4)}...${connectedAddress.slice(-4)}`
								: "Connect"}
						</span>
					</button>

					{/* Lives */}
					<div className="bg-[#FFFDF0] border-3 border-black shadow-[4px_4px_0px_#000] rounded-2xl px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5">
						<span className="text-sm sm:text-base">❤️</span>
						<span className="font-black text-sm sm:text-base text-black">
							{lives}
						</span>
						<span className="hidden sm:inline bg-black text-white text-[10px] font-black uppercase px-1.5 py-0.5 rounded ml-1">
							{config.label}
						</span>
					</div>

					{/* Sound Toggle */}
					<button
						onClick={handleSoundToggle}
						className="bg-[#FFE600] hover:bg-[#fff04d] text-black border-3 border-black p-2 rounded-2xl shadow-[3px_3px_0px_#000] cursor-pointer font-black text-xs active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
						title={isMuted ? "Unmute" : "Mute"}
					>
						{isMuted ? "🔇" : "🔊"}
					</button>

					{/* Help */}
					<button
						onClick={() => setShowInstructions(true)}
						className="bg-[#00F0FF] hover:bg-[#80f8ff] text-black border-3 border-black p-2 rounded-2xl shadow-[3px_3px_0px_#000] cursor-pointer font-black text-xs active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
						title="Instructions"
					>
						❓
					</button>
				</div>
			</div>

			{/* Timer Display */}
			<Timer seconds={timerSeconds} isActive={timerActive} />

			{/* Falling Items Area */}
			<div
				className="absolute inset-0 w-full h-full overflow-hidden"
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

			{/* Character Assembly Progress Display */}
			{isPlaying && <CharacterDisplay />}

			{/* Instructions Modal */}
			{showInstructions && (
				<GameInstructions
					onClose={() => setShowInstructions(false)}
					showStartButton={false}
				/>
			)}

			{/* Start / Difficulty & Character Selection Modal */}
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

			{/* Leaderboard Modal */}
			<Leaderboard
				isOpen={showLeaderboard}
				onClose={() => setShowLeaderboard(false)}
			/>

			{/* Stellar Wallet Modal (Freighter, Albedo, Mobile) */}
			<StellarWalletModal
				isOpen={isWalletModalOpen}
				onClose={closeWalletModal}
				onConnected={(addr, name) => {
					setConnectedAddress(addr);
					setConnectedWalletName(name);
				}}
			/>
		</div>
	);
};

export default Game;
