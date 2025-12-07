export type ItemType = "snowball" | "carrot" | "coal" | "hat" | "scarf";

export interface FallingItem {
	id: string;
	type: ItemType;
	x: number; // Position as percentage (0-100)
	y: number; // Current vertical position
	speed: number;
}

export interface SnowmanPart {
	type: ItemType;
	collected: boolean;
}

export interface GameState {
	score: number;
	timeRemaining: number;
	isPlaying: boolean;
	isGameOver: boolean;
	currentSnowman: {
		snowball: boolean;
		coal: boolean;
		carrot: boolean;
		hat: boolean;
		scarf: boolean;
	};
	combo: number;
}

export const ITEM_EMOJIS: Record<ItemType, string> = {
	snowball: "❄️",
	carrot: "🥕",
	coal: "⚫",
	hat: "🎩",
	scarf: "🧣",
};

export const SNOWMAN_ORDER: ItemType[] = ["snowball", "coal", "carrot", "hat"];
export const GAME_DURATION = 60; // seconds
export const ITEM_FALL_SPEED_MIN = 0.1;
export const ITEM_FALL_SPEED_MAX = 0.3;
export const ITEM_SPAWN_INTERVAL_MIN = 800;
export const ITEM_SPAWN_INTERVAL_MAX = 2000;
