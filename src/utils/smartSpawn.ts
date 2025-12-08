import type { ItemType } from "../types/game";

/**
 * Smart spawning algorithm that biases towards spawning the next needed item
 * for building a snowman. Uses a fixed 50% chance to spawn needed items.
 */
export const getSmartSpawnItem = (
	nextNeededItem: ItemType | null
): ItemType => {
	const random = Math.random();

	// 50% chance to spawn the needed item
	if (nextNeededItem && random < 0.5) {
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
