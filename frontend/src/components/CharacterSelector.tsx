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
		<div className="w-full">
			<label className="block text-xs font-black uppercase text-black mb-2 tracking-wider">
				Choose Character
			</label>
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
				{charList.map((char) => {
					const isSelected = selectedCharacter === char.id;
					return (
						<button
							key={char.id}
							type="button"
							onClick={() => onSelect(char.id)}
							className={`relative p-3 sm:p-4 border-3 border-black text-left transition-all cursor-pointer ${
								isSelected
									? "bg-[#FFE600] shadow-[5px_5px_0px_#000] -translate-y-1"
									: "bg-white hover:bg-[#FFFDF0] shadow-[3px_3px_0px_#000]"
							}`}
						>
							{isSelected && (
								<span className="absolute -top-3 -right-1 bg-black text-[#FFE600] font-black text-[9px] px-2 py-0.5 border border-white uppercase tracking-wider">
									SELECTED
								</span>
							)}

							<div className="flex items-center justify-center h-14 mb-2">
								<Item3D type={char.requiredParts[0] as ItemType} size={48} />
							</div>

							<div className="font-black text-xs sm:text-sm text-black leading-tight uppercase truncate">
								{char.name}
							</div>
							<div className="text-[10px] font-bold text-gray-600 truncate mt-1 uppercase">
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
