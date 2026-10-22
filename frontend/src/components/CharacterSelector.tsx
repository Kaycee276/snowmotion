import React from "react";
import { CHARACTERS, type CharacterId } from "../types/character";
import Item3D from "./Item3D";
import type { ItemType } from "../types/game";

interface CharacterSelectorProps {
	selectedCharacter: CharacterId;
	onSelect: (id: CharacterId) => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
	selectedCharacter,
	onSelect,
}) => {
	const charList = Object.values(CHARACTERS);

	return (
		<div className="w-full my-4">
			<label className="block text-xs sm:text-sm font-black uppercase text-black mb-2 tracking-wider">
				Choose Your Champion
			</label>
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
				{charList.map((char) => {
					const isSelected = selectedCharacter === char.id;
					return (
						<button
							key={char.id}
							type="button"
							onClick={() => onSelect(char.id)}
							className={`relative p-2.5 sm:p-3 rounded-xl border-3 border-black text-left transition-all cursor-pointer ${
								isSelected
									? "bg-[#FFE600] shadow-[5px_5px_0px_#000] -translate-y-1"
									: "bg-white/90 hover:bg-[#FFFDF0] shadow-[3px_3px_0px_#000]"
							}`}
						>
							{isSelected && (
								<span className="absolute -top-2.5 -right-2 bg-black text-[#FFE600] font-black text-[10px] px-1.5 py-0.5 rounded border border-white">
									ACTIVE
								</span>
							)}

							<div className="flex items-center justify-center h-12 mb-2">
								<Item3D type={char.requiredParts[0] as ItemType} size={44} />
							</div>

							<div className="font-black text-xs sm:text-sm text-black leading-tight truncate">
								{char.name}
							</div>
							<div className="text-[10px] font-bold text-gray-600 truncate mt-0.5">
								{char.title}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default CharacterSelector;
