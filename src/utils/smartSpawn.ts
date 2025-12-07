import type { ItemType } from "../types/game";
import type { DifficultyLevel } from "../types/difficulty";
import { DIFFICULTY_CONFIGS } from "../types/difficulty";

/**
 * Smart spawning algorithm that biases towards spawning the next needed item
 * for building a snowman, based on difficulty level.
 */
export const getSmartSpawnItem = (
	nextNeededItem: ItemType | null,
	difficulty: DifficultyLevel
): ItemType => {
	const config = DIFFICULTY_CONFIGS[difficulty];
	const random = Math.random();

	// If we have a needed item and random is within the weight threshold
	if (nextNeededItem && random < config.neededItemWeight) {
		return nextNeededItem;
	}

	// Otherwise, spawn a random item (can include scarf for bonus)
	// Slightly reduce chance of scarf to keep it special
	const nonScarfTypes: ItemType[] = ["snowball", "carrot", "coal", "hat"];
	if (Math.random() < 0.8) {
		return nonScarfTypes[Math.floor(Math.random() * nonScarfTypes.length)];
	}
	return "scarf";
};
