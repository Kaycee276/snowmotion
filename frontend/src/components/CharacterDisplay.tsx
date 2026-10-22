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
			<div className="bg-[#FFFDF0] border-4 border-black shadow-[6px_6px_0px_#000] p-4 sm:p-5 text-center">
				{/* Header */}
				<div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b-2 border-black">
					<div className="flex items-center gap-2">
						<span className="w-3.5 h-3.5 border-2 border-black inline-block" style={{ backgroundColor: charConfig.themeColor }} />
						<span className="font-black text-sm sm:text-base uppercase tracking-wider text-black">
							{charConfig.name}
						</span>
					</div>

					{isBlizzardActive && (
						<div className="bg-[#00E5FF] text-black font-black text-xs px-2.5 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000] uppercase tracking-wider animate-pulse">
							BLIZZARD: {blizzardTimeLeft}S
						</div>
					)}

					<span className="text-xs font-black uppercase text-gray-800 bg-white border-2 border-black px-2.5 py-0.5 shadow-[1px_1px_0px_#000]">
						{Object.keys(collectedParts).filter((k) => charConfig.requiredParts.includes(k)).length} / {charConfig.requiredParts.length} PARTS
					</span>
				</div>

				{/* Parts Row */}
				<div className="flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto py-2">
					{charConfig.parts.map((part) => {
						const isCollected = Boolean(collectedParts[part.id]);
						return (
							<div
								key={part.id}
								className={`relative flex flex-col items-center justify-center p-2.5 sm:p-3 border-3 border-black transition-all min-w-[64px] sm:min-w-[76px] shrink-0 ${
									isCollected
										? "bg-[#00FF66] shadow-[3px_3px_0px_#000] -translate-y-0.5"
										: "bg-white/80 opacity-40 shadow-[2px_2px_0px_#000]"
								}`}
							>
								<div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center">
									<Item3D type={part.id as ItemType} size={38} />
								</div>
								<span className="text-[10px] sm:text-xs font-black uppercase text-black mt-1 truncate max-w-[60px] sm:max-w-none">
									{part.label}
								</span>
								{part.isBonus && (
									<span className="absolute -top-2.5 -right-1 bg-[#FF007A] text-white text-[9px] font-black px-1.5 py-0.2 border border-black uppercase">
										BONUS
									</span>
								)}
								{isCollected && (
									<span className="absolute -bottom-2 bg-black text-[#00FF66] text-[10px] font-black px-2 py-0.2 border border-white">
										READY
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
