import { create } from "zustand";
import type { ItemType, FallingItem, GameState } from "../types/game";
import type { DifficultyLevel } from "../types/difficulty";
import type { CharacterId } from "../types/character";
import { CHARACTERS } from "../types/character";
import { INITIAL_LIVES, WRONG_ITEM_PENALTY, TIMER_DURATION } from "../types/game";
import { gameApi } from "../services/gameApi";
import { sound } from "../utils/soundEffects";

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
	setDifficulty: (difficulty: DifficultyLevel) => void;
	resetCharacterAssembly: () => void;
	resetGame: () => void;
	startGame: (walletAddress?: string) => Promise<void>;
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
				powerupMessage: "+8s TIME BOOST! ☕",
				items: state.items.filter((item) => item.id !== itemId),
			});
			setTimeout(() => set({ powerupMessage: null }), 2000);
			return;
		}

		if (itemType === "power_blizzard") {
			sound.playPowerup();
			set({
				isBlizzardActive: true,
				blizzardTimeLeft: 6,
				powerupMessage: "BLIZZARD FREEZE! 🧊",
				items: state.items.filter((item) => item.id !== itemId),
			});
			setTimeout(() => set({ powerupMessage: null }), 2000);
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
				powerupMessage: "+3 GOLDEN STAR! ⭐",
				items: state.items.filter((item) => item.id !== itemId),
			});
			setTimeout(() => set({ powerupMessage: null }), 2000);
			return;
		}

		if (itemType === "hazard_spike") {
			sound.playHazard();
			const newLives = state.lives - 1;
			set({
				lives: newLives,
				combo: 0,
				lifeLossEffect: true,
				powerupMessage: "HAZARD HIT! -1 LIFE 💥",
				items: state.items.filter((item) => item.id !== itemId),
				isGameOver: newLives <= 0,
				isPlaying: newLives > 0,
			});
			if (newLives <= 0) sound.playGameOver();
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
				// Completed the full character!
				sound.playComplete();
				let pointsToAdd = 2;
				if (updatedCollected[bonusPart]) {
					pointsToAdd += 2; // Bonus points for equipped accessory
				}
				const newCombo = state.combo + 1;
				sound.playCombo(newCombo);

				set({
					score: state.score + pointsToAdd,
					combo: newCombo,
					collectedParts: {},
					items: state.items.filter((item) => item.id !== itemId),
					timerSeconds: Math.min(state.timerSeconds + 12, 60),
					powerupMessage: `${charConfig.name} COMPLETED! +${pointsToAdd} 🏆`,
				});
				setTimeout(() => set({ powerupMessage: null }), 2000);
			} else {
				set({
					collectedParts: updatedCollected,
					items: state.items.filter((item) => item.id !== itemId),
				});
			}
		} else if (itemType === bonusPart) {
			// Collected the optional bonus part
			sound.playCatch();
			set({
				collectedParts: { ...state.collectedParts, [bonusPart]: true },
				powerupMessage: `BONUS ACCESSORY EQUIPPED! ✨`,
				items: state.items.filter((item) => item.id !== itemId),
			});
			setTimeout(() => set({ powerupMessage: null }), 2000);
		} else {
			// Wrong item clicked!
			sound.playWrong();
			const newTimerSeconds = Math.max(0, state.timerSeconds - WRONG_ITEM_PENALTY);
			set({
				combo: 0,
				collectedParts: {},
				items: state.items.filter((item) => item.id !== itemId),
				timerSeconds: newTimerSeconds,
				lifeLossEffect: true,
				powerupMessage: `WRONG ITEM! -${WRONG_ITEM_PENALTY}s ❌`,
			});
			setTimeout(() => {
				set({ lifeLossEffect: false, powerupMessage: null });
			}, 1000);
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
		if (!state.timerActive) return;

		// Play tick sound in final 5 seconds
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

	resetGame: () =>
		set({
			score: 0,
			lives: INITIAL_LIVES,
			isPlaying: false,
			isGameOver: false,
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
		}),

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
