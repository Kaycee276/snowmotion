export type DifficultyLevel = "easy" | "medium" | "hard" | "expert";

export interface DifficultyConfig {
	label: string;
	fallSpeedMin: number;
	fallSpeedMax: number;
	spawnIntervalMin: number;
	spawnIntervalMax: number;
	neededItemWeight: number; // Weight for smart spawning (higher = more likely to spawn needed items)
	description: string;
}

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
	easy: {
		label: "Easy",
		fallSpeedMin: 0.1,
		fallSpeedMax: 0.3,
		spawnIntervalMin: 1500,
		spawnIntervalMax: 2500,
		neededItemWeight: 0.7, // 70% chance to spawn needed item
		description: "Slow falling items, plenty of time to build",
	},
	medium: {
		label: "Medium",
		fallSpeedMin: 0.2,
		fallSpeedMax: 0.5,
		spawnIntervalMin: 1000,
		spawnIntervalMax: 2000,
		neededItemWeight: 0.5, // 50% chance to spawn needed item
		description: "Balanced speed and spawn rate",
	},
	hard: {
		label: "Hard",
		fallSpeedMin: 0.4,
		fallSpeedMax: 0.8,
		spawnIntervalMin: 600,
		spawnIntervalMax: 1500,
		neededItemWeight: 0.3, // 30% chance to spawn needed item
		description: "Fast items, less time to think",
	},
	expert: {
		label: "Expert",
		fallSpeedMin: 0.6,
		fallSpeedMax: 1.2,
		spawnIntervalMin: 400,
		spawnIntervalMax: 1000,
		neededItemWeight: 0.15, // 15% chance to spawn needed item (more chaos!)
		description: "Extreme speed, minimal smart spawning",
	},
};
