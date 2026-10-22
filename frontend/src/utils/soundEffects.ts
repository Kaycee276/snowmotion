// Web Audio API Synthesizer for SnowMotion
// Neo-brutalist / arcade sound effects with zero external asset dependencies

class SoundEffectsEngine {
	private ctx: AudioContext | null = null;
	private isMuted: boolean = false;

	constructor() {
		// Restore user mute preference if saved
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("snowmotion_sound_muted");
			this.isMuted = saved === "true";
		}
	}

	private getContext(): AudioContext | null {
		if (typeof window === "undefined") return null;
		if (!this.ctx) {
			const AudioContextClass =
				window.AudioContext ||
				(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
			if (AudioContextClass) {
				this.ctx = new AudioContextClass();
			}
		}
		if (this.ctx && this.ctx.state === "suspended") {
			this.ctx.resume();
		}
		return this.ctx;
	}

	public toggleMute(): boolean {
		this.isMuted = !this.isMuted;
		if (typeof window !== "undefined") {
			localStorage.setItem("snowmotion_sound_muted", String(this.isMuted));
		}
		return this.isMuted;
	}

	public getMuted(): boolean {
		return this.isMuted;
	}

	// Catch correct item: crisp high bell / pop
	public playCatch(): void {
		if (this.isMuted) return;
		const ctx = this.getContext();
		if (!ctx) return;

		const now = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = "sine";
		osc.frequency.setValueAtTime(587.33, now); // D5
		osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5

		gain.gain.setValueAtTime(0.15, now);
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(now);
		osc.stop(now + 0.12);
	}

	// Complete character: joyful arpeggio fanfare
	public playComplete(): void {
		if (this.isMuted) return;
		const ctx = this.getContext();
		if (!ctx) return;

		const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
		const now = ctx.currentTime;

		notes.forEach((freq, idx) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			const startTime = now + idx * 0.07;

			osc.type = "triangle";
			osc.frequency.setValueAtTime(freq, startTime);

			gain.gain.setValueAtTime(0.18, startTime);
			gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

			osc.connect(gain);
			gain.connect(ctx.destination);

			osc.start(startTime);
			osc.stop(startTime + 0.25);
		});
	}

	// Combo streak: pitched tone scaled by combo
	public playCombo(combo: number): void {
		if (this.isMuted) return;
		const ctx = this.getContext();
		if (!ctx) return;

		const now = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		const baseFreq = Math.min(440 + combo * 60, 1600);
		osc.type = "sine";
		osc.frequency.setValueAtTime(baseFreq, now);
		osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.12);

		gain.gain.setValueAtTime(0.14, now);
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(now);
		osc.stop(now + 0.14);
	}

	// Wrong item collected: retro error buzz
	public playWrong(): void {
		if (this.isMuted) return;
		const ctx = this.getContext();
		if (!ctx) return;

		const now = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = "sawtooth";
		osc.frequency.setValueAtTime(160, now);
		osc.frequency.exponentialRampToValueAtTime(90, now + 0.2);

		gain.gain.setValueAtTime(0.2, now);
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(now);
		osc.stop(now + 0.2);
	}

	// Power-up collected: energetic sparkle
	public playPowerup(): void {
		if (this.isMuted) return;
		const ctx = this.getContext();
		if (!ctx) return;

		const now = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = "square";
		osc.frequency.setValueAtTime(440, now);
		osc.frequency.exponentialRampToValueAtTime(1320, now + 0.2);

		gain.gain.setValueAtTime(0.12, now);
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(now);
		osc.stop(now + 0.22);
	}

	// Hazard hit: heavy crunch
	public playHazard(): void {
		if (this.isMuted) return;
		const ctx = this.getContext();
		if (!ctx) return;

		const now = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = "sawtooth";
		osc.frequency.setValueAtTime(120, now);
		osc.frequency.linearRampToValueAtTime(40, now + 0.25);

		gain.gain.setValueAtTime(0.25, now);
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(now);
		osc.stop(now + 0.25);
	}

	// Timer tick (last 5 seconds)
	public playTick(): void {
		if (this.isMuted) return;
		const ctx = this.getContext();
		if (!ctx) return;

		const now = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = "sine";
		osc.frequency.setValueAtTime(987.77, now); // B5

		gain.gain.setValueAtTime(0.1, now);
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(now);
		osc.stop(now + 0.05);
	}

	// Game Over: descending sad tones
	public playGameOver(): void {
		if (this.isMuted) return;
		const ctx = this.getContext();
		if (!ctx) return;

		const notes = [440, 392, 349.23, 293.66]; // A4, G4, F4, D4
		const now = ctx.currentTime;

		notes.forEach((freq, idx) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			const startTime = now + idx * 0.12;

			osc.type = "triangle";
			osc.frequency.setValueAtTime(freq, startTime);

			gain.gain.setValueAtTime(0.2, startTime);
			gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

			osc.connect(gain);
			gain.connect(ctx.destination);

			osc.start(startTime);
			osc.stop(startTime + 0.3);
		});
	}
}

export const sound = new SoundEffectsEngine();
