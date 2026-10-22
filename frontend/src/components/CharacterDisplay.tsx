import React from "react";
import { useGameStore } from "../store/gameStore";
import { CHARACTERS } from "../types/character";
import Item3D from "./Item3D";
import type { ItemType } from "../types/game";

export const CharacterDisplay: React.FC = () => {
	const { selectedCharacter, collectedParts, isBlizzardActive, blizzardTimeLeft } = useGameStore();
	const charConfig = CHARACTERS[selectedCharacter] || CHARACTERS.snowman;

	return (
		<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 w-[95%] max-w-xl">
			<div className="bg-[#FFFDF0] border-4 border-black shadow-[6px_6px_0px_#000] rounded-2xl p-3 sm:p-4 text-center">
				{/* Header */}
				<div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b-2 border-black">
					<div className="flex items-center gap-2">
						<span className="w-3 h-3 rounded-full border border-black" style={{ backgroundColor: charConfig.themeColor }} />
						<span className="font-black text-sm sm:text-base uppercase tracking-wider text-black">
							{charConfig.name}
						</span>
					</div>

					{isBlizzardActive && (
						<div className="bg-[#00E5FF] text-black font-black text-xs px-2 py-0.5 border-2 border-black rounded shadow-[2px_2px_0px_#000] animate-pulse">
							❄️ BLIZZARD: {blizzardTimeLeft}s
						</div>
					)}

					<span className="text-xs font-bold text-gray-700 bg-white border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_#000]">
						{Object.keys(collectedParts).filter(k => charConfig.requiredParts.includes(k)).length} / {charConfig.requiredParts.length} Parts
					</span>
				</div>

				{/* Parts Row */}
				<div className="flex items-center justify-center gap-2 sm:gap-4">
					{charConfig.parts.map((part) => {
						const isCollected = Boolean(collectedParts[part.id]);
						return (
							<div
								key={part.id}
								className={`relative flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl border-3 border-black transition-all ${
									isCollected
										? "bg-[#00FF66] shadow-[3px_3px_0px_#000] scale-105"
										: "bg-white/80 opacity-40 shadow-[2px_2px_0px_#000]"
								}`}
							>
								<div className="w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center">
									<Item3D type={part.id as ItemType} size={42} />
								</div>
								<span className="text-[10px] sm:text-xs font-black uppercase text-black mt-1">
									{part.label}
								</span>
								{part.isBonus && (
									<span className="absolute -top-2 -right-2 bg-[#FF007A] text-white text-[9px] font-black px-1 rounded-sm border border-black">
										BONUS
									</span>
								)}
								{isCollected && (
									<span className="absolute -bottom-2 bg-black text-[#00FF66] text-[10px] font-black px-1.5 rounded-full border border-white">
										✓
									</span>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default CharacterDisplay;
