export type DifficultyLevel = "easy" | "medium" | "hard";

export interface DifficultyConfig {
	label: string;
	fallSpeedMin: number;
	fallSpeedMax: number;
	spawnIntervalMin: number;
	spawnIntervalMax: number;
	description: string;
}

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
	easy: {
		label: "Easy",
		fallSpeedMin: 0.1,
		fallSpeedMax: 0.3,
		spawnIntervalMin: 1500,
		spawnIntervalMax: 2500,
		description: "Slow falling items, plenty of time to build",
	},
	medium: {
		label: "Medium",
		fallSpeedMin: 0.2,
		fallSpeedMax: 0.5,
		spawnIntervalMin: 1000,
		spawnIntervalMax: 2000,
		description: "Balanced speed and spawn rate",
	},
	hard: {
		label: "Hard",
		fallSpeedMin: 0.4,
		fallSpeedMax: 0.8,
		spawnIntervalMin: 800,
		spawnIntervalMax: 1500,
		description: "Fast items, less time to think",
	},
};
