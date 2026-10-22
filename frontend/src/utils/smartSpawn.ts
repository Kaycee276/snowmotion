import type { ItemType } from "../types/game";
import type { DifficultyLevel } from "../types/difficulty";
import type { CharacterId } from "../types/character";
import { CHARACTERS } from "../types/character";

interface SmartSpawnContext {
	characterId: CharacterId;
	nextNeededItem: string | null;
	currentItems: ItemType[];
	timerSeconds: number;
	combo: number;
	difficulty: DifficultyLevel;
	lives: number;
}

/**
 * Smart spawning algorithm that adapts based on selected character and game state
 */
export const getSmartSpawnItem = (context: SmartSpawnContext): ItemType => {
	const {
		characterId,
		nextNeededItem,
		currentItems,
		timerSeconds,
		combo,
		difficulty,
		lives,
	} = context;

	const charConfig = CHARACTERS[characterId] || CHARACTERS.snowman;
	const requiredParts = charConfig.requiredParts;
	const bonusPart = charConfig.bonusPart;

	// Count existing items on screen
	const itemCounts = currentItems.reduce((acc, item) => {
		acc[item] = (acc[item] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	// Base spawn chances by difficulty
	const difficultyMultipliers = {
		easy: { needed: 0.55, bonus: 0.15, wrong: 0.2, special: 0.1 },
		medium: { needed: 0.45, bonus: 0.15, wrong: 0.25, special: 0.15 },
		hard: { needed: 0.38, bonus: 0.15, wrong: 0.3, special: 0.17 },
	};

	let { needed, bonus, wrong, special } = difficultyMultipliers[difficulty];

	// Dynamic adjustments based on pressure
	if (timerSeconds <= 8) {
		needed += 0.15;
		special += 0.05;
	}

	if (lives <= 1) {
		needed += 0.1;
		special += 0.08;
	}

	if (combo >= 4) {
		wrong += 0.1;
	}

	// Avoid excessive duplicates of the needed item
	if (nextNeededItem && (itemCounts[nextNeededItem] || 0) >= 2) {
		needed -= 0.2;
		wrong += 0.15;
	}

	const total = needed + bonus + wrong + special;
	needed /= total;
	bonus /= total;
	wrong /= total;
	special /= total;

	const rand = Math.random();

	// 1. Needed Character Part
	if (nextNeededItem && rand < needed) {
		return nextNeededItem as ItemType;
	}

	// 2. Bonus Character Part
	if (rand < needed + bonus) {
		return bonusPart as ItemType;
	}

	// 3. Special Power-up or Hazard
	if (rand < needed + bonus + special) {
		const specialRoll = Math.random();
		// If low time or low life, favor Hot Cocoa
		if (timerSeconds < 10 || lives <= 1) {
			if (specialRoll < 0.5) return "power_cocoa";
			if (specialRoll < 0.75) return "power_blizzard";
			return "power_star";
		}

		if (specialRoll < 0.3) return "power_cocoa";
		if (specialRoll < 0.55) return "power_blizzard";
		if (specialRoll < 0.8) return "power_star";
		return "hazard_spike"; // 20% of specials is a hazard
	}

	// 4. Other parts (wrong items from this or other characters)
	const candidateWrongItems = requiredParts.filter((p) => p !== nextNeededItem);
	if (candidateWrongItems.length > 0) {
		const unflooded = candidateWrongItems.filter((p) => (itemCounts[p] || 0) < 2);
		const pool = unflooded.length > 0 ? unflooded : candidateWrongItems;
		return pool[Math.floor(Math.random() * pool.length)] as ItemType;
	}

	return (nextNeededItem as ItemType) || (requiredParts[0] as ItemType);
};
