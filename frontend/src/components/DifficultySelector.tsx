import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { DIFFICULTY_CONFIGS, type DifficultyLevel } from "../types/difficulty";
import CharacterSelector from "./CharacterSelector";
import { sound } from "../utils/soundEffects";

interface DifficultySelectorProps {
	onStart: () => void;
	onShowLeaderboard: () => void;
	onShowInstructions: () => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
	onStart,
	onShowLeaderboard,
	onShowInstructions,
}) => {
	const {
		difficulty,
		setDifficulty,
		selectedCharacter,
		setSelectedCharacter,
		connectedAddress,
		connectedWalletName,
		openWalletModal,
		setConnectedAddress,
		setConnectedWalletName,
		getSavedGameSummary,
		restoreGameProgress,
		clearSavedProgress,
	} = useGameStore();

	const [isMuted, setIsMuted] = useState(sound.getMuted());
	const savedGame = getSavedGameSummary(connectedAddress || undefined);

	const handleDisconnect = () => {
		setConnectedAddress(null);
		setConnectedWalletName(null);
	};

	const handleSoundToggle = () => {
		const muted = sound.toggleMute();
		setIsMuted(muted);
	};

	const handleResume = () => {
		restoreGameProgress(connectedAddress || undefined);
	};

	const handleDiscardSaved = () => {
		clearSavedProgress(connectedAddress || undefined);
	};

	const difficultyLevels: DifficultyLevel[] = ["easy", "medium", "hard"];

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs z-30 p-2 sm:p-4 overflow-y-auto">
			<div className="bg-[#FFFDF0] border-4 border-black rounded-3xl p-4 sm:p-5 w-full max-w-lg shadow-[8px_8px_0px_#000] relative max-h-[92vh] overflow-y-auto">
				{/* Top Controls Bar */}
				<div className="flex items-center justify-between pb-2.5 border-b-3 border-black mb-3">
					<div className="flex items-center gap-1.5">
						<span className="bg-[#FFE600] border-2 border-black font-black text-[11px] sm:text-xs px-2 py-0.5 rounded shadow-[2px_2px_0px_#000]">
							STELLAR MAINNET
						</span>
					</div>

					<div className="flex items-center gap-1.5">
						<button
							onClick={handleSoundToggle}
							className="bg-white hover:bg-yellow-200 text-black border-2 border-black p-1.5 sm:p-2 rounded-xl shadow-[2px_2px_0px_#000] cursor-pointer font-bold text-xs"
							title={isMuted ? "Unmute" : "Mute"}
						>
							{isMuted ? "🔇" : "🔊"}
						</button>
						<button
							onClick={onShowInstructions}
							className="bg-[#00F0FF] hover:bg-[#80F8FF] text-black border-2 border-black px-2.5 py-1.5 rounded-xl shadow-[2px_2px_0px_#000] cursor-pointer font-black text-xs"
							title="How to Play"
						>
							HELP ❓
						</button>
					</div>
				</div>

				{/* Title */}
				<div className="text-center mb-3">
					<div className="inline-block bg-[#00F0FF] border-3 border-black shadow-[3px_3px_0px_#000] px-4 py-1 rounded-2xl -rotate-1 mb-1">
						<h1 className="text-2xl sm:text-3xl font-black uppercase text-black">
							❄️ SNOWMOTION ⚡
						</h1>
					</div>
					<p className="text-[11px] sm:text-xs font-bold text-gray-700">
						Fast-paced 3D assembly • Tamper-proof on-chain scores
					</p>
				</div>

				{/* Saved In-Progress Session Resume Banner */}
				{savedGame && (
					<div className="mb-3.5 p-3 bg-[#FFE600] border-3 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
						<div className="flex items-center justify-between mb-2">
							<span className="text-xs font-black uppercase text-black flex items-center gap-1">
								<span>💾</span> IN-PROGRESS RUN SAVED
							</span>
							<button
								type="button"
								onClick={handleDiscardSaved}
								className="text-[10px] font-black text-red-700 underline cursor-pointer hover:text-black"
							>
								Discard
							</button>
						</div>
						<div className="flex items-center justify-between text-xs font-black text-black mb-2.5 bg-white/80 p-2 rounded-xl border-2 border-black">
							<span>Score: <b className="text-[#FF007A]">{savedGame.score}</b></span>
							<span>Lives: {savedGame.lives} ❤️</span>
							<span>Time: {savedGame.timerSeconds}s ⏱️</span>
							<span className="uppercase text-[10px] bg-black text-white px-1.5 py-0.5 rounded">
								{savedGame.difficulty}
							</span>
						</div>
						<button
							type="button"
							onClick={handleResume}
							className="w-full bg-[#00FF66] hover:bg-[#33ff85] text-black border-3 border-black py-2.5 rounded-xl font-black text-sm uppercase shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer transition-all"
						>
							CONTINUE RUN WHERE YOU STOPPED ▶️
						</button>
					</div>
				)}

				{/* Character Selection */}
				<CharacterSelector
					selectedCharacter={selectedCharacter}
					onSelect={setSelectedCharacter}
				/>

				{/* Difficulty Selection (Compact) */}
				<div className="mb-3.5">
					<label className="block text-[11px] sm:text-xs font-black uppercase text-black mb-1.5 tracking-wider">
						Select Speed & Difficulty
					</label>
					<div className="grid grid-cols-3 gap-2">
						{difficultyLevels.map((level) => {
							const config = DIFFICULTY_CONFIGS[level];
							const isSelected = difficulty === level;
							const badgeColors: Record<DifficultyLevel, string> = {
								easy: "bg-[#00FF66]",
								medium: "bg-[#FFE600]",
								hard: "bg-[#FF007A] text-white",
							};

							return (
								<button
									key={level}
									type="button"
									onClick={() => setDifficulty(level)}
									className={`p-2 rounded-xl border-3 border-black text-center transition-all cursor-pointer ${
										isSelected
											? `${badgeColors[level]} shadow-[3px_3px_0px_#000] -translate-y-0.5`
											: "bg-white hover:bg-gray-50 shadow-[2px_2px_0px_#000]"
									}`}
								>
									<div className="font-black text-xs sm:text-sm uppercase leading-tight">
										{config.label}
									</div>
									<div className="text-[10px] font-bold opacity-80 mt-0.5">
										{level === "easy" ? "Casual" : level === "medium" ? "Standard" : "Hardcore"}
									</div>
								</button>
							);
						})}
					</div>
				</div>

				{/* Wallet Status Banner */}
				{!connectedAddress ? (
					<div className="mb-3.5 p-2.5 bg-[#FFF] border-3 border-black rounded-xl shadow-[3px_3px_0px_#000] flex items-center justify-between gap-2">
						<span className="text-[11px] font-black text-black">
							Connect Stellar wallet to save scores!
						</span>
						<button
							type="button"
							onClick={openWalletModal}
							className="bg-[#FFE600] hover:bg-[#fff04d] text-black px-2.5 py-1.5 rounded-lg font-black text-[11px] uppercase cursor-pointer border-2 border-black shadow-[2px_2px_0px_#000]"
						>
							CONNECT ⭐
						</button>
					</div>
				) : (
					<div className="mb-3.5 p-2 bg-[#00FF66] border-3 border-black rounded-xl shadow-[3px_3px_0px_#000] flex items-center justify-between text-xs">
						<span className="font-black text-black uppercase truncate">
							✓ {connectedWalletName || "Wallet"}: {connectedAddress.slice(0, 5)}...{connectedAddress.slice(-4)}
						</span>
						<div className="flex items-center gap-2 shrink-0">
							<button
								type="button"
								onClick={openWalletModal}
								className="text-[10px] font-black underline cursor-pointer"
							>
								Switch
							</button>
							<button
								type="button"
								onClick={handleDisconnect}
								className="text-[10px] font-black text-red-700 underline cursor-pointer"
							>
								Disconnect
							</button>
						</div>
					</div>
				)}

				{/* Action Buttons */}
				<div className="flex gap-2.5">
					<button
						type="button"
						onClick={onStart}
						className="flex-1 bg-[#00FF66] hover:bg-[#20ff79] text-black border-4 border-black py-2.5 sm:py-3 rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer transition-all"
					>
						{savedGame ? "NEW GAME 🚀" : "PLAY NOW 🚀"}
					</button>
					<button
						type="button"
						onClick={onShowLeaderboard}
						className="bg-white hover:bg-[#FFFDF0] text-black border-4 border-black px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer transition-all"
					>
						SCORES 🏆
					</button>
				</div>
			</div>
		</div>
	);
};

export default DifficultySelector;
