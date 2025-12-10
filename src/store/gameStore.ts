import { create } from "zustand";
import type { ItemType, FallingItem, GameState } from "../types/game";
import type { DifficultyLevel } from "../types/difficulty";
import { SNOWMAN_ORDER, INITIAL_LIVES, WRONG_ITEM_PENALTY } from "../types/game";

interface GameStore extends GameState {
	items: FallingItem[];
	itemIdCounter: number;
	difficulty: DifficultyLevel;
	timerSeconds: number;
	timerActive: boolean;
	lifeLossEffect: boolean;
	// Actions
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
	resetCurrentSnowman: () => void;
	updateCurrentSnowman: (
		part: keyof GameState["currentSnowman"],
		value: boolean
	) => void;
	resetGame: () => void;
	startGame: () => void;
	getNextItemId: () => string;
	getNextNeededItem: () => ItemType | null;
	startTimer: () => void;
	decrementTimer: () => void;
	resetTimer: () => void;
	setLifeLossEffect: (effect: boolean) => void;
}

const initialSnowman = {
	snowball: false,
	coal: false,
	carrot: false,
	hat: false,
	scarf: false,
};

export const useGameStore = create<GameStore>((set, get) => ({
	// Initial state
	score: 0,
	lives: INITIAL_LIVES,
	isPlaying: false,
	isGameOver: false,
	currentSnowman: { ...initialSnowman },
	combo: 0,
	items: [],
	itemIdCounter: 0,
	difficulty: "medium",
	timerSeconds: 30,
	timerActive: false,
	lifeLossEffect: false,

	// Actions
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

		// Check if item exists (prevent double collection)
		const itemExists = state.items.some((item) => item.id === itemId);
		if (!itemExists) {
			return; // Item already collected
		}

		const { currentSnowman, score, combo } = state;

		// Find what item we need next
		const expectedNextIndex = SNOWMAN_ORDER.findIndex(
			(_type, index) =>
				!currentSnowman[SNOWMAN_ORDER[index] as keyof typeof currentSnowman]
		);

		if (expectedNextIndex !== -1) {
			const expectedNextType = SNOWMAN_ORDER[expectedNextIndex];

			if (itemType === expectedNextType) {
				// Correct item!
				const newSnowman = { ...currentSnowman, [itemType]: true };
				const isComplete = SNOWMAN_ORDER.every(
					(type) => newSnowman[type as keyof typeof newSnowman]
				);

				if (isComplete) {
					// Complete snowman! Calculate score immediately
					// Base score: +1 for complete snowman
					let pointsToAdd = 1;

					// Bonus point for scarf
					const hasScarf = newSnowman.scarf;
					if (hasScarf) {
						pointsToAdd += 1; // Bonus point for scarf
						console.log("🎉 Scarf bonus applied! +1 extra point");
					}

					const newScore = score + pointsToAdd;
					const newCombo = combo + 1;

					console.log(
						`✅ Snowman complete! Score: ${score} → ${newScore} (added ${pointsToAdd} points)`
					);

					// Update all state atomically - score FIRST, then reset snowman
					set({
						score: newScore, // Update score immediately
						combo: newCombo,
						currentSnowman: { ...initialSnowman }, // Reset for next snowman
						items: state.items.filter((item) => item.id !== itemId), // Remove collected item
						timerSeconds: state.timerSeconds + 15, // Add 15 seconds
					});
				} else {
					// Partial progress - update snowman and remove item
					set({
						currentSnowman: newSnowman,
						items: state.items.filter((item) => item.id !== itemId),
					});
				}
			} else if (itemType === "scarf") {
				// Scarf can be collected anytime as bonus
				set({
					currentSnowman: { ...currentSnowman, scarf: true },
					items: state.items.filter((item) => item.id !== itemId),
				});
			} else {
				// Wrong item - subtract time and reset progress
				const newTimerSeconds = Math.max(0, state.timerSeconds - WRONG_ITEM_PENALTY);
				set({
					combo: 0,
					currentSnowman: { ...initialSnowman },
					items: state.items.filter((item) => item.id !== itemId),
					timerSeconds: newTimerSeconds,
					lifeLossEffect: true,
				});
				// Reset effect after animation
				setTimeout(() => set({ lifeLossEffect: false }), 1000);
			}
		} else {
			// All items collected but something went wrong - just remove item
			set({
				items: state.items.filter((item) => item.id !== itemId),
			});
		}
	},

	setScore: (score) => set({ score }),
	setCombo: (combo) => set({ combo }),
	setLives: (lives) => set({ lives }),
	setIsPlaying: (isPlaying) => set({ isPlaying }),
	setIsGameOver: (isGameOver) => set({ isGameOver }),
	resetCurrentSnowman: () => set({ currentSnowman: { ...initialSnowman } }),
	updateCurrentSnowman: (part, value) =>
		set((state) => ({
			currentSnowman: { ...state.currentSnowman, [part]: value },
		})),

	startTimer: () => set({ timerSeconds: 30, timerActive: true }),

	decrementTimer: () => {
		const state = get();
		if (!state.timerActive) return;

		const newSeconds = state.timerSeconds - 1;
		if (newSeconds <= 0) {
			// Timer expired - lose a life
			const newLives = state.lives - 1;
			set({
				lives: newLives,
				timerSeconds: 30,
				timerActive: newLives > 0,
				isGameOver: newLives <= 0,
				isPlaying: newLives > 0,
				lifeLossEffect: true,
			});
			// Reset effect after animation
			setTimeout(() => set({ lifeLossEffect: false }), 1000);
		} else {
			set({ timerSeconds: newSeconds });
		}
	},

	resetTimer: () => set({ timerSeconds: 30, timerActive: false }),

	resetGame: () =>
		set({
			score: 0,
			lives: 5,
			isPlaying: false,
			isGameOver: false,
			currentSnowman: { ...initialSnowman },
			combo: 0,
			items: [],
			itemIdCounter: 0,
			timerSeconds: 30,
			timerActive: false,
			lifeLossEffect: false,
		}),

	startGame: () =>
		set({
			score: 0,
			lives: 5,
			isPlaying: true,
			isGameOver: false,
			currentSnowman: { ...initialSnowman },
			combo: 0,
			items: [],
			itemIdCounter: 0,
			timerSeconds: 30,
			timerActive: true,
			lifeLossEffect: false,
		}),

	getNextItemId: () => {
		const counter = get().itemIdCounter;
		set({ itemIdCounter: counter + 1 });
		return `item-${counter}`;
	},

	getNextNeededItem: () => {
		const { currentSnowman } = get();
		const expectedNextIndex = SNOWMAN_ORDER.findIndex(
			(_type, index) =>
				!currentSnowman[SNOWMAN_ORDER[index] as keyof typeof currentSnowman]
		);

		if (expectedNextIndex !== -1) {
			return SNOWMAN_ORDER[expectedNextIndex];
		}
		return null; // All items collected
	},

	setDifficulty: (difficulty) => set({ difficulty }),

	setLifeLossEffect: (effect) => set({ lifeLossEffect: effect }),
}));
