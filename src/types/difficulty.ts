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
		spawnIntervalMin: 400,
		spawnIntervalMax: 800,
		description: "Slow falling items, plenty of time to build",
	},
	medium: {
		label: "Medium",
		fallSpeedMin: 0.2,
		fallSpeedMax: 0.5,
		spawnIntervalMin: 300,
		spawnIntervalMax: 600,
		description: "Balanced speed and spawn rate",
	},
	hard: {
		label: "Hard",
		fallSpeedMin: 0.4,
		fallSpeedMax: 0.8,
		spawnIntervalMin: 200,
		spawnIntervalMax: 400,
		description: "Fast items, less time to think",
	},
};
