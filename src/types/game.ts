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
	lives: number;
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
export const INITIAL_LIVES = 5;
export const MAX_ITEMS_ON_SCREEN = 15;
