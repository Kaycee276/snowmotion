import React from "react";
import { CHARACTERS } from "../types/character";
import Item3D from "./Item3D";
import type { ItemType } from "../types/game";

interface GameInstructionsProps {
	onStart?: () => void;
	onClose?: () => void;
	showStartButton?: boolean;
}

export const GameInstructions: React.FC<GameInstructionsProps> = ({
	onStart,
	onClose,
	showStartButton = true,
}) => {
	const charList = Object.values(CHARACTERS);

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-xs z-50 p-2 sm:p-4 overflow-y-auto">
			<div className="bg-[#FFFDF0] border-4 border-black rounded-3xl p-4 sm:p-6 w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-[8px_8px_0px_#000] relative">
				{/* Header */}
				<div className="flex items-center justify-between pb-3 border-b-3 border-black mb-4">
					<div className="inline-block bg-[#00F0FF] border-2 border-black px-3 py-1 rounded-xl shadow-[2px_2px_0px_#000]">
						<h1 className="text-xl sm:text-2xl font-black uppercase text-black">
							📖 HOW TO PLAY SNOWMOTION
						</h1>
					</div>
					{onClose && (
						<button
							onClick={onClose}
							className="bg-black text-white hover:bg-red-600 border-2 border-black w-8 h-8 rounded-xl font-black text-lg flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#000]"
						>
							✕
						</button>
					)}
				</div>

				<div className="space-y-4">
					{/* 1. Core Rule */}
					<div className="bg-[#FFE600] border-3 border-black p-3 sm:p-4 rounded-2xl shadow-[4px_4px_0px_#000]">
						<h2 className="text-sm sm:text-base font-black uppercase text-black mb-1">
							🎯 1. Catch Parts in Strict Sequence
						</h2>
						<p className="text-xs sm:text-sm font-bold text-gray-900">
							Falling parts rain down from the sky. Look at the <strong>NEXT</strong> item indicator at the top left. Click or tap only the required part to assemble your character! Missing unclicked items that fall off the bottom is okay, but clicking the <strong>wrong item</strong> costs an 8-second time penalty!
						</p>
					</div>

					{/* 2. Champions List */}
					<div className="border-3 border-black p-3 sm:p-4 rounded-2xl bg-white shadow-[4px_4px_0px_#000]">
						<h2 className="text-sm sm:text-base font-black uppercase text-black mb-2">
							👾 2. The 4 Buildable Champions
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{charList.map((char) => (
								<div
									key={char.id}
									className="p-2.5 rounded-xl border-2 border-black bg-[#FFFDF0]"
								>
									<div className="font-black text-xs sm:text-sm text-black mb-1">
										{char.name} ({char.title})
									</div>
									<div className="flex items-center gap-1.5 flex-wrap">
										{char.parts.map((p, idx) => (
											<div
												key={p.id}
												className="flex items-center gap-1 bg-white border border-black px-1.5 py-0.5 rounded text-[10px] font-bold"
											>
												<Item3D type={p.id as ItemType} size={18} />
												<span>{idx + 1}. {p.label}</span>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</div>

					{/* 3. Power-ups & Hazards */}
					<div className="border-3 border-black p-3 sm:p-4 rounded-2xl bg-[#00FF66]/20 shadow-[4px_4px_0px_#000]">
						<h2 className="text-sm sm:text-base font-black uppercase text-black mb-2">
							⭐ 3. Power-ups & Hazards
						</h2>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
							<div className="p-2 bg-white rounded-xl border-2 border-black text-center shadow-[2px_2px_0px_#000]">
								<div className="flex justify-center mb-1">
									<Item3D type="power_cocoa" size={32} />
								</div>
								<div className="font-black text-xs text-black">Hot Cocoa</div>
								<div className="text-[10px] font-bold text-gray-700">+8s Time Boost</div>
							</div>

							<div className="p-2 bg-white rounded-xl border-2 border-black text-center shadow-[2px_2px_0px_#000]">
								<div className="flex justify-center mb-1">
									<Item3D type="power_blizzard" size={32} />
								</div>
								<div className="font-black text-xs text-black">Blizzard</div>
								<div className="text-[10px] font-bold text-gray-700">Freeze / Slow items</div>
							</div>

							<div className="p-2 bg-white rounded-xl border-2 border-black text-center shadow-[2px_2px_0px_#000]">
								<div className="flex justify-center mb-1">
									<Item3D type="power_star" size={32} />
								</div>
								<div className="font-black text-xs text-black">Golden Star</div>
								<div className="text-[10px] font-bold text-gray-700">+3 Pts & Combo</div>
							</div>

							<div className="p-2 bg-white rounded-xl border-2 border-black text-center shadow-[2px_2px_0px_#000]">
								<div className="flex justify-center mb-1">
									<Item3D type="hazard_spike" size={32} />
								</div>
								<div className="font-black text-xs text-red-600">Spike Mine</div>
								<div className="text-[10px] font-bold text-red-600">DANGER! -1 Life</div>
							</div>
						</div>
					</div>

					{/* 4. On-chain Verification */}
					<div className="border-3 border-black p-3 sm:p-4 rounded-2xl bg-[#00F0FF]/20 shadow-[4px_4px_0px_#000]">
						<h2 className="text-sm sm:text-base font-black uppercase text-black mb-1">
							🔐 4. Cryptographic Proof on Somnia L1
						</h2>
						<p className="text-xs font-bold text-gray-800">
							Each game session hash is generated server-side. Scores are cryptographically attested and signed before being recorded on the Somnia Mainnet smart contract leaderboard.
						</p>
					</div>
				</div>

				{/* Start Button */}
				{showStartButton && onStart && (
					<div className="mt-4 pt-3 border-t-3 border-black">
						<button
							onClick={onStart}
							className="w-full bg-[#00FF66] hover:bg-[#52ff99] text-black border-4 border-black py-3 rounded-2xl font-black text-base uppercase shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer transition-all"
						>
							LET'S GO! 🚀
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default GameInstructions;
