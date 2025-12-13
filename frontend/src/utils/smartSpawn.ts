import type { ItemType } from "../types/game";
import type { DifficultyLevel } from "../types/difficulty";

interface SmartSpawnContext {
	nextNeededItem: ItemType | null;
	currentItems: ItemType[];
	timerSeconds: number;
	combo: number;
	difficulty: DifficultyLevel;
	lives: number;
}

/**
 * Advanced smart spawning algorithm that adapts based on game state
 */
export const getSmartSpawnItem = (context: SmartSpawnContext): ItemType => {
	const {
		nextNeededItem,
		currentItems,
		timerSeconds,
		combo,
		difficulty,
		lives,
	} = context;

	// Count existing items on screen
	const itemCounts = currentItems.reduce((acc, item) => {
		acc[item] = (acc[item] || 0) + 1;
		return acc;
	}, {} as Record<ItemType, number>);

	// Base spawn chances by difficulty
	const difficultyMultipliers = {
		easy: { needed: 0.7, scarf: 0.15, wrong: 0.15 },
		medium: { needed: 0.6, scarf: 0.2, wrong: 0.2 },
		hard: { needed: 0.5, scarf: 0.25, wrong: 0.25 },
	};

	let { needed, scarf, wrong } = difficultyMultipliers[difficulty];

	// Adaptive adjustments based on game state

	// 1. Timer pressure - increase needed item chance when time is low
	if (timerSeconds <= 10) {
		needed += 0.2;
		wrong -= 0.1;
		scarf -= 0.1;
	}

	// 2. Low lives - be more helpful
	if (lives <= 2) {
		needed += 0.15;
		wrong -= 0.15;
	}

	// 3. High combo - add more challenge
	if (combo >= 3) {
		needed -= 0.1;
		wrong += 0.05;
		scarf += 0.05;
	}

	// 4. Avoid flooding screen with same item type
	if (nextNeededItem && itemCounts[nextNeededItem] >= 2) {
		needed -= 0.2;
		wrong += 0.1;
		scarf += 0.1;
	}

	// 5. Ensure scarf availability for bonus opportunities
	if ((itemCounts.scarf || 0) === 0 && Math.random() < 0.3) {
		scarf += 0.1;
		needed -= 0.05;
		wrong -= 0.05;
	}

	// Normalize probabilities
	const total = needed + scarf + wrong;
	needed /= total;
	scarf /= total;
	wrong /= total;

	const random = Math.random();

	// Spawn based on calculated probabilities
	if (nextNeededItem && random < needed) {
		return nextNeededItem;
	}

	if (random < needed + scarf) {
		return "scarf";
	}

	// Spawn wrong item - choose intelligently
	const allItems: ItemType[] = ["snowball", "carrot", "coal", "hat"];
	const wrongItems = allItems.filter((item) => item !== nextNeededItem);

	// Prefer items that aren't already flooding the screen
	const availableWrongItems = wrongItems.filter(
		(item) => (itemCounts[item] || 0) < 2
	);

	const finalWrongItems =
		availableWrongItems.length > 0 ? availableWrongItems : wrongItems;
	return finalWrongItems[Math.floor(Math.random() * finalWrongItems.length)];
};

// Legacy function for backward compatibility
export const getSmartSpawnItemLegacy = (
	nextNeededItem: ItemType | null
): ItemType => {
	return getSmartSpawnItem({
		nextNeededItem,
		currentItems: [],
		timerSeconds: 30,
		combo: 0,
		difficulty: "medium",
		lives: 5,
	});
};
