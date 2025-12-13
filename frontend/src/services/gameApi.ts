export interface GameSession {
	gameHash: string;
}

export interface SubmitScoreRequest {
	player: string;
	score: number;
	difficulty: number; // 0=easy, 1=medium, 2=hard
	gameHash: string;
}

export interface SubmitScoreResponse {
	success: boolean;
	txHash: string;
	message: string;
}

export interface LeaderboardEntry {
	address: string;
	score: number;
	difficulty: number;
	timestamp: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const gameApi = {
	async startGame(player: string): Promise<GameSession> {
		const response = await fetch(`${API_BASE_URL}/api/start-game`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ player }),
		});

		if (!response.ok) {
			throw new Error("Failed to start game session");
		}

		return response.json();
	},

	async submitScore(request: SubmitScoreRequest): Promise<SubmitScoreResponse> {
		const response = await fetch(`${API_BASE_URL}/api/submit-score`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to submit score");
		}

		return response.json();
	},

	async getLeaderboard(): Promise<LeaderboardEntry[]> {
		const response = await fetch(`${API_BASE_URL}/api/leaderboard`);
		if (!response.ok) {
			throw new Error("Failed to fetch leaderboard");
		}
		return response.json();
	},
};
