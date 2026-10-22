import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { DIFFICULTY_CONFIGS, type DifficultyLevel } from "../types/difficulty";
import CharacterSelector from "./CharacterSelector";
import { sound } from "../utils/soundEffects";

interface DifficultySelectorProps {
	onStart: () => void;
	onShowLeaderboard: () => void;
	onShowInstructions: () => void;
	onHome?: () => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
	onStart,
	onShowLeaderboard,
	onShowInstructions,
	onHome,
}) => {
	const {
		difficulty,
		setDifficulty,
		selectedCharacter,
		setSelectedCharacter,
		connectedAddress,
		connectedWalletName,
		guestAddress,
		openWalletModal,
		setConnectedAddress,
		setConnectedWalletName,
		getSavedGameSummary,
		restoreGameProgress,
		clearSavedProgress,
	} = useGameStore();

	const [isMuted, setIsMuted] = useState(sound.getMuted());
	const activeAddress = connectedAddress || guestAddress;
	const savedGame = getSavedGameSummary(activeAddress || undefined);

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
		<div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-xs z-30 p-4 sm:p-6 overflow-y-auto">
			<div className="bg-[#FFFDF0] border-4 border-black p-6 sm:p-8 w-full max-w-xl shadow-[8px_8px_0px_#000] relative max-h-[92vh] overflow-y-auto">
				{/* Top Controls Bar */}
				<div className="flex items-center justify-between pb-4 border-b-3 border-black mb-6 gap-2">
					<div className="flex items-center gap-2">
						{onHome && (
							<button
								type="button"
								onClick={onHome}
								className="bg-white hover:bg-gray-100 text-black border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000] cursor-pointer font-black text-xs uppercase active:translate-x-0.5 active:translate-y-0.5"
							>
								← ABOUT
							</button>
						)}
						<span className="bg-[#FFE600] border-2 border-black font-black text-xs px-2.5 py-1 uppercase shadow-[2px_2px_0px_#000]">
							STELLAR MAINNET
						</span>
					</div>

					<div className="flex items-center gap-2 sm:gap-3">
						<button
							type="button"
							onClick={handleSoundToggle}
							className="bg-white hover:bg-yellow-200 text-black border-2 border-black px-2.5 sm:px-3 py-1 shadow-[2px_2px_0px_#000] cursor-pointer font-black text-xs uppercase active:translate-x-0.5 active:translate-y-0.5"
						>
							{isMuted ? "UNMUTE" : "MUTE"}
						</button>
						<button
							type="button"
							onClick={onShowInstructions}
							className="bg-[#00F0FF] hover:bg-[#80F8FF] text-black border-2 border-black px-2.5 sm:px-3 py-1 shadow-[2px_2px_0px_#000] cursor-pointer font-black text-xs uppercase active:translate-x-0.5 active:translate-y-0.5"
						>
							HELP
						</button>
					</div>
				</div>

				{/* Title Banner */}
				<div className="text-center mb-6">
					<div className="inline-block bg-[#00F0FF] border-4 border-black shadow-[4px_4px_0px_#000] px-6 py-2 -rotate-1 mb-2">
						<h1 className="text-3xl sm:text-4xl font-black uppercase text-black tracking-tight">
							SNOWMOTION
						</h1>
					</div>
					<p className="text-xs sm:text-sm font-bold text-gray-700 tracking-wide mt-1">
						Fast-paced 3D assembly • Tamper-proof on-chain scores
					</p>
				</div>

				{/* Saved In-Progress Session Resume Banner */}
				{savedGame && (
					<div className="mb-6 p-4 bg-[#FFE600] border-3 border-black shadow-[4px_4px_0px_#000]">
						<div className="flex items-center justify-between mb-3">
							<span className="text-xs font-black uppercase tracking-wider text-black">
								SAVED SESSION DETECTED
							</span>
							<button
								type="button"
								onClick={handleDiscardSaved}
								className="text-xs font-black text-red-700 underline uppercase cursor-pointer hover:text-black"
							>
								Discard
							</button>
						</div>
						<div className="grid grid-cols-4 gap-2 text-center text-xs font-black text-black mb-3 bg-white p-2.5 border-2 border-black">
							<div>
								<span className="block text-[10px] text-gray-500 uppercase">Score</span>
								<span className="text-[#FF007A] font-black">{savedGame.score}</span>
							</div>
							<div>
								<span className="block text-[10px] text-gray-500 uppercase">Lives</span>
								<span>{savedGame.lives}</span>
							</div>
							<div>
								<span className="block text-[10px] text-gray-500 uppercase">Time</span>
								<span>{savedGame.timerSeconds}s</span>
							</div>
							<div>
								<span className="block text-[10px] text-gray-500 uppercase">Mode</span>
								<span className="uppercase">{savedGame.difficulty}</span>
							</div>
						</div>
						<button
							type="button"
							onClick={handleResume}
							className="w-full bg-[#00FF66] hover:bg-[#33ff85] text-black border-3 border-black py-3 font-black text-sm uppercase shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer transition-all"
						>
							CONTINUE RUN
						</button>
					</div>
				)}

				{/* Character Selection */}
				<div className="mb-6">
					<CharacterSelector
						selectedCharacter={selectedCharacter}
						onSelect={setSelectedCharacter}
					/>
				</div>

				{/* Difficulty Selection */}
				<div className="mb-6">
					<label className="block text-xs font-black uppercase text-black mb-2 tracking-wider">
						Select Speed & Difficulty
					</label>
					<div className="grid grid-cols-3 gap-3">
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
									className={`p-3 border-3 border-black text-center transition-all cursor-pointer ${
										isSelected
											? `${badgeColors[level]} shadow-[4px_4px_0px_#000] -translate-y-0.5`
											: "bg-white hover:bg-gray-50 shadow-[2px_2px_0px_#000]"
									}`}
								>
									<div className="font-black text-xs sm:text-sm uppercase leading-tight">
										{config.label}
									</div>
									<div className="text-[10px] font-bold opacity-80 mt-1 uppercase">
										{level === "easy" ? "Casual" : level === "medium" ? "Standard" : "Hardcore"}
									</div>
								</button>
							);
						})}
					</div>
				</div>

				{/* Wallet Status Banner */}
				{!connectedAddress ? (
					<div className="mb-6 p-3.5 bg-[#00F0FF]/15 border-3 border-black shadow-[3px_3px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
						<div>
							<div className="flex items-center gap-2">
								<span className="bg-[#00F0FF] border-2 border-black font-black text-[10px] px-2 py-0.5 uppercase shadow-[1px_1px_0px_#000]">
									INSTANT ARCADE MODE
								</span>
								<span className="text-xs font-black text-black uppercase">
									{guestAddress ? `${guestAddress.slice(0, 6)}...${guestAddress.slice(-4)}` : "GUEST ON-CHAIN ID"}
								</span>
							</div>
							<p className="text-[10px] font-bold text-gray-700 uppercase mt-1">
								Play without wallet — scores are verified & recorded on Stellar automatically
							</p>
						</div>
						<button
							type="button"
							onClick={openWalletModal}
							className="bg-[#FFE600] hover:bg-[#fff04d] text-black px-3.5 py-1.5 font-black text-xs uppercase cursor-pointer border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 shrink-0"
						>
							CONNECT WALLET
						</button>
					</div>
				) : (
					<div className="mb-6 p-3 bg-[#00FF66] border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between text-xs">
						<span className="font-black text-black uppercase truncate">
							{connectedWalletName ? `${connectedWalletName.toUpperCase()}: ` : "ACCOUNT: "}
							{connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
						</span>
						<div className="flex items-center gap-3 shrink-0">
							<button
								type="button"
								onClick={openWalletModal}
								className="text-xs font-black underline uppercase cursor-pointer"
							>
								Switch
							</button>
							<button
								type="button"
								onClick={handleDisconnect}
								className="text-xs font-black text-red-700 underline uppercase cursor-pointer"
							>
								Disconnect
							</button>
						</div>
					</div>
				)}

				{/* Action Buttons */}
				<div className="flex gap-4">
					<button
						type="button"
						onClick={onStart}
						className="flex-1 bg-[#00FF66] hover:bg-[#20ff79] text-black border-4 border-black py-3.5 font-black text-base uppercase tracking-wider shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer transition-all"
					>
						{savedGame ? "NEW GAME" : "PLAY NOW"}
					</button>
					<button
						type="button"
						onClick={onShowLeaderboard}
						className="bg-white hover:bg-[#FFFDF0] text-black border-4 border-black px-6 py-3.5 font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer transition-all"
					>
						LEADERBOARD
					</button>
				</div>
			</div>
		</div>
	);
};

export default DifficultySelector;
