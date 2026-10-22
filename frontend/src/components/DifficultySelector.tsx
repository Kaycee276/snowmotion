import React, { useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { DIFFICULTY_CONFIGS, type DifficultyLevel } from "../types/difficulty";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
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
		setConnectedAddress,
		selectedCharacter,
		setSelectedCharacter,
	} = useGameStore();
	const { open } = useAppKit();
	const { address, isConnected } = useAppKitAccount();
	const [isMuted, setIsMuted] = React.useState(sound.getMuted());

	useEffect(() => {
		setConnectedAddress(address || null);
	}, [address, setConnectedAddress]);

	const handleSoundToggle = () => {
		const muted = sound.toggleMute();
		setIsMuted(muted);
	};

	const difficultyLevels: DifficultyLevel[] = ["easy", "medium", "hard"];

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs z-30 p-2 sm:p-4 overflow-y-auto">
			<div className="bg-[#FFFDF0] border-4 border-black rounded-3xl p-4 sm:p-6 w-full max-w-xl shadow-[8px_8px_0px_#000] relative max-h-[95vh] overflow-y-auto">
				{/* Top Controls */}
				<div className="flex items-center justify-between pb-3 border-b-3 border-black mb-4">
					<div className="flex items-center gap-2">
						<span className="bg-[#FFE600] border-2 border-black font-black text-xs px-2 py-1 rounded shadow-[2px_2px_0px_#000]">
							STELLAR MAINNET
						</span>
						<span className="font-black text-xs text-black uppercase tracking-wider">
							Web3 Arcade
						</span>
					</div>

					<div className="flex items-center gap-2">
						<button
							onClick={handleSoundToggle}
							className="bg-white hover:bg-yellow-200 text-black border-2 border-black p-2 rounded-xl shadow-[2px_2px_0px_#000] cursor-pointer font-bold text-xs"
							title={isMuted ? "Unmute Sound" : "Mute Sound"}
						>
							{isMuted ? "🔇" : "🔊"}
						</button>
						<button
							onClick={onShowInstructions}
							className="bg-[#00F0FF] hover:bg-[#80F8FF] text-black border-2 border-black p-2 rounded-xl shadow-[2px_2px_0px_#000] cursor-pointer font-black text-xs"
							title="How to Play"
						>
							HELP ❓
						</button>
					</div>
				</div>

				{/* Title Banner */}
				<div className="text-center mb-4">
					<div className="inline-block bg-[#00F0FF] border-3 border-black shadow-[4px_4px_0px_#000] px-4 py-1.5 rounded-2xl -rotate-1 mb-2">
						<h1 className="text-2xl sm:text-4xl font-black tracking-tight text-black uppercase">
							❄️ SNOWMOTION ⚡
						</h1>
					</div>
					<p className="text-xs sm:text-sm font-bold text-gray-800">
						Fast-paced 3D assembly game with tamper-proof on-chain scores!
					</p>
				</div>

				{/* Character Selection */}
				<CharacterSelector
					selectedCharacter={selectedCharacter}
					onSelect={setSelectedCharacter}
				/>

				{/* Difficulty Selection */}
				<div className="mb-4">
					<label className="block text-xs sm:text-sm font-black uppercase text-black mb-2 tracking-wider">
						Select Speed & Challenge
					</label>
					<div className="grid grid-cols-3 gap-2 sm:gap-3">
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
									className={`p-2 sm:p-2.5 rounded-xl border-3 border-black text-left transition-all cursor-pointer ${
										isSelected
											? `${badgeColors[level]} shadow-[4px_4px_0px_#000] -translate-y-0.5`
											: "bg-white hover:bg-gray-50 shadow-[2px_2px_0px_#000]"
									}`}
								>
									<div className="font-black text-xs sm:text-sm uppercase leading-tight">
										{config.label}
									</div>
									<div className="text-[10px] font-bold opacity-80 mt-0.5 truncate">
										{config.description}
									</div>
								</button>
							);
						})}
					</div>
				</div>

				{/* Wallet Status Banner */}
				{!isConnected ? (
					<div className="mb-4 p-3 bg-[#FFE600] border-3 border-black rounded-xl shadow-[3px_3px_0px_#000]">
						<div className="flex items-center justify-between gap-2">
							<span className="text-xs font-black text-black">
								Connect Stellar wallet to submit scores!
							</span>
							<button
								type="button"
								onClick={() => open()}
								className="bg-black text-white hover:bg-gray-800 px-3 py-1.5 rounded-lg font-black text-xs uppercase cursor-pointer border border-white"
							>
								Connect
							</button>
						</div>
					</div>
				) : (
					<div className="mb-4 p-2.5 bg-[#00FF66] border-3 border-black rounded-xl shadow-[3px_3px_0px_#000] flex items-center justify-between">
						<span className="text-xs font-black text-black uppercase">
							✓ Wallet Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
						</span>
						<button
							type="button"
							onClick={() => open({ view: "Account" })}
							className="text-[10px] font-black underline cursor-pointer"
						>
							Change
						</button>
					</div>
				)}

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-3">
					<button
						type="button"
						onClick={onStart}
						className="flex-1 bg-[#00FF66] hover:bg-[#20ff79] text-black border-4 border-black py-3 rounded-2xl font-black text-base uppercase tracking-wider shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer transition-all"
					>
						PLAY NOW 🚀
					</button>
					<button
						type="button"
						onClick={onShowLeaderboard}
						className="bg-white hover:bg-[#FFFDF0] text-black border-4 border-black px-4 py-3 rounded-2xl font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer transition-all"
					>
						LEADERBOARD 🏆
					</button>
				</div>
			</div>
		</div>
	);
};

export default DifficultySelector;
