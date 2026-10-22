import type { CharacterId } from "./character";

export type CharacterItemType =
	// Snowman
	| "snowball"
	| "carrot"
	| "coal"
	| "hat"
	| "scarf"
	// Robot
	| "bot_chassis"
	| "bot_battery"
	| "bot_visor"
	| "bot_antenna"
	| "bot_jetpack"
	// Yeti
	| "yeti_fur"
	| "yeti_fangs"
	| "yeti_horns"
	| "yeti_club"
	| "yeti_amulet"
	// Gingerbread
	| "cookie_body"
	| "cookie_buttons"
	| "cookie_smile"
	| "cookie_hat"
	| "cookie_cane";

export type SpecialItemType =
	| "power_cocoa"    // +5s time or +1 life
	| "power_blizzard" // Slows falling items for 5s
	| "power_star"     // Bonus points + combo boost
	| "hazard_spike";  // Danger! Avoid clicking

export type ItemType = CharacterItemType | SpecialItemType;

export interface FallingItem {
	id: string;
	type: ItemType;
	x: number; // Position as percentage (0-100)
	y: number; // Current vertical position
	speed: number;
}

export interface GameState {
	score: number;
	lives: number;
	isPlaying: boolean;
	isGameOver: boolean;
	selectedCharacter: CharacterId;
	collectedParts: Record<string, boolean>;
	combo: number;
	isBlizzardActive: boolean;
	blizzardTimeLeft: number;
}

export const INITIAL_LIVES = 3;
export const MIN_ITEMS_ON_SCREEN = 8;
export const MAX_ITEMS_ON_SCREEN = 14;
export const TIMER_DURATION = 35;
export const WRONG_ITEM_PENALTY = 8;
