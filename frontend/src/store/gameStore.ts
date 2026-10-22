import { create } from "zustand";
import type { ItemType, FallingItem, GameState } from "../types/game";
import type { DifficultyLevel } from "../types/difficulty";
import type { CharacterId } from "../types/character";
import { CHARACTERS } from "../types/character";
import { INITIAL_LIVES, WRONG_ITEM_PENALTY, TIMER_DURATION } from "../types/game";
import { gameApi } from "../services/gameApi";
import { sound } from "../utils/soundEffects";

const getSaveKey = (addr?: string | null) => `snowmotion_saved_game_${addr || "guest"}`;

interface SavedGameData {
	score: number;
	lives: number;
	timerSeconds: number;
	collectedParts: Record<string, boolean>;
	combo: number;
	selectedCharacter: CharacterId;
	difficulty: DifficultyLevel;
	gameHash: string | null;
	isBlizzardActive: boolean;
	blizzardTimeLeft: number;
	savedAt: number;
}

interface GameStore extends GameState {
	items: FallingItem[];
	itemIdCounter: number;
	difficulty: DifficultyLevel;
	timerSeconds: number;
	timerActive: boolean;
	lifeLossEffect: boolean;
	powerupMessage: string | null;
	gameHash: string | null;
	playerNonce: number;
	connectedAddress: string | null;
	connectedWalletName: string | null;
	isWalletModalOpen: boolean;

	// Actions
	openWalletModal: () => void;
	closeWalletModal: () => void;
	setConnectedWalletName: (name: string | null) => void;
	setSelectedCharacter: (characterId: CharacterId) => void;
	spawnItem: (item: FallingItem) => void;
	removeItem: (id: string) => void;
	updateItemPosition: (id: string, y: number) => void;
	collectItem: (itemId: string, itemType: ItemType) => void;
	setScore: (score: number) => void;
	setCombo: (combo: number) => void;
	setLives: (lives: number) => void;
	setIsPlaying: (isPlaying: boolean) => void;
	setIsGameOver: (isGameOver: boolean) => void;
	pauseGame: () => void;
	resumeGame: () => void;
	togglePause: () => void;
	setDifficulty: (difficulty: DifficultyLevel) => void;
	resetCharacterAssembly: () => void;
	resetGame: () => void;
	startGame: (walletAddress?: string) => Promise<void>;
	saveGameProgress: () => void;
	restoreGameProgress: (address?: string) => boolean;
	clearSavedProgress: (address?: string) => void;
	hasSavedGame: (address?: string) => boolean;
	getSavedGameSummary: (address?: string) => SavedGameData | null;
	getNextItemId: () => string;
	getNextNeededItem: () => string | null;
	startTimer: () => void;
	decrementTimer: () => void;
	resetTimer: () => void;
	setLifeLossEffect: (effect: boolean) => void;
	setConnectedAddress: (address: string | null) => void;
	tickBlizzard: () => void;

	// Backwards compatibility helpers
	currentSnowman: {
		snowball: boolean;
		coal: boolean;
		carrot: boolean;
		hat: boolean;
		scarf: boolean;
	};
}

export const useGameStore = create<GameStore>((set, get) => ({
	// Initial state
	score: 0,
	lives: INITIAL_LIVES,
	isPlaying: false,
	isGameOver: false,
	isPaused: false,
	selectedCharacter: "snowman",
	collectedParts: {},
	combo: 0,
	isBlizzardActive: false,
	blizzardTimeLeft: 0,
	items: [],
	itemIdCounter: 0,
	difficulty: "medium",
	timerSeconds: TIMER_DURATION,
	timerActive: false,
	lifeLossEffect: false,
	powerupMessage: null,
	gameHash: null,
	playerNonce: 0,
	connectedAddress:
		typeof window !== "undefined"
			? localStorage.getItem("snowmotion_stellar_address")
			: null,
	connectedWalletName:
		typeof window !== "undefined"
			? localStorage.getItem("snowmotion_stellar_wallet")
			: null,
	isWalletModalOpen: false,

	openWalletModal: () => set({ isWalletModalOpen: true }),
	closeWalletModal: () => set({ isWalletModalOpen: false }),
	setConnectedWalletName: (name: string | null) => {
		set({ connectedWalletName: name });
		if (typeof window !== "undefined") {
			if (name) localStorage.setItem("snowmotion_stellar_wallet", name);
			else localStorage.removeItem("snowmotion_stellar_wallet");
		}
	},

	get currentSnowman() {
		const parts = get().collectedParts;
		return {
			snowball: Boolean(parts.snowball),
			coal: Boolean(parts.coal),
			carrot: Boolean(parts.carrot),
			hat: Boolean(parts.hat),
			scarf: Boolean(parts.scarf),
		};
	},

	setSelectedCharacter: (characterId: CharacterId) => {
		set({ selectedCharacter: characterId, collectedParts: {} });
	},

	pauseGame: () => set({ isPaused: true }),
	resumeGame: () => set({ isPaused: false }),
	togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

	saveGameProgress: () => {
		const state = get();
		if (!state.isPlaying || state.isGameOver) return;
		const key = getSaveKey(state.connectedAddress);
		const data: SavedGameData = {
			score: state.score,
			lives: state.lives,
			timerSeconds: state.timerSeconds,
			collectedParts: state.collectedParts,
			combo: state.combo,
			selectedCharacter: state.selectedCharacter,
			difficulty: state.difficulty,
			gameHash: state.gameHash,
			isBlizzardActive: state.isBlizzardActive,
			blizzardTimeLeft: state.blizzardTimeLeft,
			savedAt: Date.now(),
		};
		try {
			localStorage.setItem(key, JSON.stringify(data));
		} catch {
			// ignore storage quotas
		}
	},

	hasSavedGame: (address?: string) => {
		const key = getSaveKey(address || get().connectedAddress);
		try {
			const raw = localStorage.getItem(key);
			if (!raw) return false;
			const data = JSON.parse(raw);
			return Date.now() - (data.savedAt || 0) < 25 * 60 * 1000;
		} catch {
			return false;
		}
	},

	getSavedGameSummary: (address?: string) => {
		const key = getSaveKey(address || get().connectedAddress);
		try {
			const raw = localStorage.getItem(key);
			if (!raw) return null;
			const data = JSON.parse(raw);
			if (Date.now() - (data.savedAt || 0) > 25 * 60 * 1000) return null;
			return data as SavedGameData;
		} catch {
			return null;
		}
	},

	restoreGameProgress: (address?: string) => {
		const targetAddress = address || get().connectedAddress;
		const key = getSaveKey(targetAddress);
		try {
			const raw = localStorage.getItem(key);
			if (!raw) return false;
			const data: SavedGameData = JSON.parse(raw);
			if (Date.now() - (data.savedAt || 0) > 25 * 60 * 1000) {
				localStorage.removeItem(key);
				return false;
			}

			set({
				score: data.score || 0,
				lives: data.lives || INITIAL_LIVES,
				timerSeconds: data.timerSeconds || TIMER_DURATION,
				collectedParts: data.collectedParts || {},
				combo: data.combo || 0,
				selectedCharacter: data.selectedCharacter || "snowman",
				difficulty: data.difficulty || "medium",
				gameHash: data.gameHash || null,
				isBlizzardActive: Boolean(data.isBlizzardActive),
				blizzardTimeLeft: data.blizzardTimeLeft || 0,
				items: [],
				isPlaying: true,
				isGameOver: false,
				isPaused: true, // Start paused to give player a moment
				timerActive: true,
				powerupMessage: "WELCOME BACK! GAME RESUMED",
			});
			setTimeout(() => set({ powerupMessage: null }), 3000);
			return true;
		} catch {
			return false;
		}
	},

	clearSavedProgress: (address?: string) => {
		const key = getSaveKey(address || get().connectedAddress);
		try {
			localStorage.removeItem(key);
		} catch {
			// ignore
		}
	},

	spawnItem: (item) =>
		set((state) => ({
			items: [...state.items, item],
		})),

	removeItem: (id) =>
		set((state) => ({
			items: state.items.filter((item) => item.id !== id),
		})),

	updateItemPosition: (id, y) =>
		set((state) => ({
			items: state.items.map((item) =>
				item.id === id ? { ...item, y } : item
			),
		})),

	collectItem: (itemId, itemType) => {
		const state = get();
		if (state.isPaused) return; // Do not allow collecting while paused

		const itemExists = state.items.some((item) => item.id === itemId);
		if (!itemExists) return;

		// 1. Handle Special Power-ups & Hazards
		if (itemType === "power_cocoa") {
			sound.playPowerup();
			const newTime = Math.min(state.timerSeconds + 8, 60);
			const newLives = state.lives < INITIAL_LIVES ? state.lives + 1 : state.lives;
			set({
				timerSeconds: newTime,
				lives: newLives,
				powerupMessage: "+8s TIME BOOST",
				items: state.items.filter((item) => item.id !== itemId),
			});
			setTimeout(() => set({ powerupMessage: null }), 2000);
			get().saveGameProgress();
			return;
		}

		if (itemType === "power_blizzard") {
			sound.playPowerup();
			set({
				isBlizzardActive: true,
				blizzardTimeLeft: 6,
				powerupMessage: "BLIZZARD FREEZE - SLOWDOWN",
				items: state.items.filter((item) => item.id !== itemId),
			});
			setTimeout(() => set({ powerupMessage: null }), 2000);
			get().saveGameProgress();
			return;
		}

		if (itemType === "power_star") {
			sound.playPowerup();
			const newScore = state.score + 3;
			const newCombo = state.combo + 1;
			sound.playCombo(newCombo);
			set({
				score: newScore,
				combo: newCombo,
				powerupMessage: "+3 POINTS - GOLDEN STAR",
				items: state.items.filter((item) => item.id !== itemId),
			});
			setTimeout(() => set({ powerupMessage: null }), 2000);
			get().saveGameProgress();
			return;
		}

		if (itemType === "hazard_spike") {
			sound.playHazard();
			const newLives = state.lives - 1;
			const isOver = newLives <= 0;
			if (isOver) {
				sound.playGameOver();
				get().clearSavedProgress();
			} else {
				get().saveGameProgress();
			}
			set({
				lives: newLives,
				combo: 0,
				lifeLossEffect: true,
				powerupMessage: "HAZARD HIT! -1 LIFE",
				items: state.items.filter((item) => item.id !== itemId),
				isGameOver: isOver,
				isPlaying: !isOver,
			});
			setTimeout(() => {
				set({ lifeLossEffect: false, powerupMessage: null });
			}, 1500);
			return;
		}

		// 2. Handle Character Parts
		const charConfig = CHARACTERS[state.selectedCharacter] || CHARACTERS.snowman;
		const { requiredParts, bonusPart } = charConfig;
		const nextNeeded = state.getNextNeededItem();

		if (itemType === nextNeeded) {
			sound.playCatch();
			const updatedCollected = { ...state.collectedParts, [itemType]: true };
			const isComplete = requiredParts.every((part) => updatedCollected[part]);

			if (isComplete) {
				sound.playComplete();
				let pointsToAdd = 2;
				if (updatedCollected[bonusPart]) {
					pointsToAdd += 2;
				}
				const newCombo = state.combo + 1;
				sound.playCombo(newCombo);

				set({
					score: state.score + pointsToAdd,
					combo: newCombo,
					collectedParts: {},
					items: state.items.filter((item) => item.id !== itemId),
					timerSeconds: Math.min(state.timerSeconds + 12, 60),
					powerupMessage: `${charConfig.name.toUpperCase()} COMPLETED! +${pointsToAdd} POINTS`,
				});
				setTimeout(() => set({ powerupMessage: null }), 2000);
			} else {
				set({
					collectedParts: updatedCollected,
					items: state.items.filter((item) => item.id !== itemId),
				});
			}
			get().saveGameProgress();
		} else if (itemType === bonusPart) {
			sound.playCatch();
			set({
				collectedParts: { ...state.collectedParts, [bonusPart]: true },
				powerupMessage: "BONUS ACCESSORY EQUIPPED!",
				items: state.items.filter((item) => item.id !== itemId),
			});
			setTimeout(() => set({ powerupMessage: null }), 2000);
			get().saveGameProgress();
		} else {
			sound.playWrong();
			const newTimerSeconds = Math.max(0, state.timerSeconds - WRONG_ITEM_PENALTY);
			set({
				combo: 0,
				collectedParts: {},
				items: state.items.filter((item) => item.id !== itemId),
				timerSeconds: newTimerSeconds,
				lifeLossEffect: true,
				powerupMessage: `WRONG ITEM! -${WRONG_ITEM_PENALTY}s PENALTY`,
			});
			setTimeout(() => {
				set({ lifeLossEffect: false, powerupMessage: null });
			}, 1000);
			get().saveGameProgress();
		}
	},

	setScore: (score) => set({ score }),
	setCombo: (combo) => set({ combo }),
	setLives: (lives) => set({ lives }),
	setIsPlaying: (isPlaying) => set({ isPlaying }),
	setIsGameOver: (isGameOver) => set({ isGameOver }),
	setDifficulty: (difficulty) => set({ difficulty }),
	resetCharacterAssembly: () => set({ collectedParts: {} }),

	startTimer: () => set({ timerSeconds: TIMER_DURATION, timerActive: true }),

	decrementTimer: () => {
		const state = get();
		if (!state.timerActive || state.isPaused) return;

		if (state.timerSeconds <= 5 && state.timerSeconds > 0) {
			sound.playTick();
		}

		const newSeconds = state.timerSeconds - 1;
		if (newSeconds <= 0) {
			sound.playHazard();
			const newLives = state.lives - 1;
			const isOver = newLives <= 0;
			if (isOver) {
				sound.playGameOver();
				get().clearSavedProgress();
			} else {
				get().saveGameProgress();
			}
			set({
				lives: newLives,
				timerSeconds: TIMER_DURATION,
				timerActive: !isOver,
				isGameOver: isOver,
				isPlaying: !isOver,
				lifeLossEffect: true,
				collectedParts: {},
			});
			setTimeout(() => set({ lifeLossEffect: false }), 1000);
		} else {
			set({ timerSeconds: newSeconds });
		}
	},

	tickBlizzard: () => {
		const state = get();
		if (state.isPaused) return;
		if (state.isBlizzardActive) {
			const nextTime = state.blizzardTimeLeft - 1;
			if (nextTime <= 0) {
				set({ isBlizzardActive: false, blizzardTimeLeft: 0 });
			} else {
				set({ blizzardTimeLeft: nextTime });
			}
		}
	},

	resetTimer: () => set({ timerSeconds: TIMER_DURATION, timerActive: false }),

	resetGame: () => {
		get().clearSavedProgress();
		set({
			score: 0,
			lives: INITIAL_LIVES,
			isPlaying: false,
			isGameOver: false,
			isPaused: false,
			collectedParts: {},
			combo: 0,
			items: [],
			itemIdCounter: 0,
			timerSeconds: TIMER_DURATION,
			timerActive: false,
			lifeLossEffect: false,
			isBlizzardActive: false,
			blizzardTimeLeft: 0,
			powerupMessage: null,
			gameHash: null,
		});
	},

	startGame: async (walletAddress?: string) => {
		try {
			const address = walletAddress || get().connectedAddress;
			if (!address) {
				throw new Error("Wallet address required to start game");
			}

			const session = await gameApi.startGame(address);

			set({
				score: 0,
				lives: INITIAL_LIVES,
				isPlaying: true,
				isGameOver: false,
				isPaused: false,
				collectedParts: {},
				combo: 0,
				items: [],
				itemIdCounter: 0,
				timerSeconds: TIMER_DURATION,
				timerActive: true,
				lifeLossEffect: false,
				isBlizzardActive: false,
				blizzardTimeLeft: 0,
				powerupMessage: null,
				gameHash: session.gameHash,
			});
			get().saveGameProgress();
		} catch (error) {
			console.error("Failed to start game:", error);
			throw error;
		}
	},

	getNextItemId: () => {
		const counter = get().itemIdCounter;
		set({ itemIdCounter: counter + 1 });
		return `item-${counter}`;
	},

	getNextNeededItem: () => {
		const { selectedCharacter, collectedParts } = get();
		const charConfig = CHARACTERS[selectedCharacter] || CHARACTERS.snowman;
		const next = charConfig.requiredParts.find((part) => !collectedParts[part]);
		return next || null;
	},

	setLifeLossEffect: (effect) => set({ lifeLossEffect: effect }),
	setConnectedAddress: (address) => {
		set({ connectedAddress: address });
		if (typeof window !== "undefined") {
			if (address) localStorage.setItem("snowmotion_stellar_address", address);
			else localStorage.removeItem("snowmotion_stellar_address");
		}
	},
}));
