import React from "react";
import type { ItemType } from "../types/game";

interface Item3DProps {
	type: ItemType;
	size?: number;
	className?: string;
}

export const Item3D: React.FC<Item3DProps> = ({ type, size = 64, className = "" }) => {
	const renderContent = () => {
		switch (type) {
			// ================= SNOWMAN ITEMS =================
			case "snowball":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						<circle cx="50" cy="50" r="42" fill="#E0F7FA" stroke="#000" strokeWidth="4" />
						<path d="M 28 32 Q 50 18 72 32" stroke="#B2EBF2" strokeWidth="6" fill="none" strokeLinecap="round" />
						<circle cx="38" cy="40" r="12" fill="#FFFFFF" />
						<circle cx="62" cy="62" r="5" fill="#80DEEA" />
						<path d="M 50 12 L 50 20 M 78 40 L 86 40 M 22 60 L 14 60" stroke="#000" strokeWidth="3" strokeLinecap="round" />
					</svg>
				);

			case "coal":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						<polygon points="20,40 50,15 80,30 85,70 55,90 15,75" fill="#212121" stroke="#000" strokeWidth="4" />
						<polygon points="50,15 80,30 55,55 35,45" fill="#424242" stroke="#000" strokeWidth="2" />
						<polygon points="55,55 85,70 55,90" fill="#151515" stroke="#000" strokeWidth="2" />
						<circle cx="42" cy="35" r="4" fill="#9E9E9E" />
					</svg>
				);

			case "carrot":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						{/* Leaves */}
						<path d="M 20 20 Q 35 15 45 30" stroke="#00FF66" strokeWidth="6" fill="none" strokeLinecap="round" />
						<path d="M 15 30 Q 30 25 40 38" stroke="#00C853" strokeWidth="6" fill="none" strokeLinecap="round" />
						{/* Carrot Body */}
						<polygon points="35,28 85,75 78,85 28,40" fill="#FF6D00" stroke="#000" strokeWidth="4" />
						<path d="M 45 42 L 55 46 M 58 55 L 68 60 M 70 68 L 76 72" stroke="#E65100" strokeWidth="3" strokeLinecap="round" />
						<circle cx="42" cy="36" r="3" fill="#FFD180" />
					</svg>
				);

			case "hat":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						{/* Crown */}
						<rect x="30" y="18" width="40" height="48" rx="4" fill="#263238" stroke="#000" strokeWidth="4" />
						{/* Red Ribbon */}
						<rect x="30" y="52" width="40" height="12" fill="#FF1744" stroke="#000" strokeWidth="3" />
						{/* Brim */}
						<ellipse cx="50" cy="72" rx="42" ry="12" fill="#37474F" stroke="#000" strokeWidth="4" />
						<ellipse cx="50" cy="70" rx="36" ry="8" fill="#455A64" />
						{/* Highlight */}
						<path d="M 38 25 L 38 50" stroke="#90A4AE" strokeWidth="3" strokeLinecap="round" />
					</svg>
				);

			case "scarf":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						<path d="M 20 40 Q 50 60 80 40 Q 50 70 20 40 Z" fill="#FF007A" stroke="#000" strokeWidth="4" />
						<rect x="58" y="48" width="16" height="38" rx="2" fill="#FF007A" stroke="#000" strokeWidth="3" transform="rotate(10 66 67)" />
						<line x1="60" y1="60" x2="74" y2="62" stroke="#FFE600" strokeWidth="3" />
						<line x1="62" y1="72" x2="76" y2="74" stroke="#FFE600" strokeWidth="3" />
					</svg>
				);

			// ================= ROBOT ITEMS =================
			case "bot_chassis":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						<rect x="18" y="22" width="64" height="58" rx="6" fill="#ECEFF1" stroke="#000" strokeWidth="4" />
						<circle cx="30" cy="34" r="3" fill="#000" />
						<circle cx="70" cy="34" r="3" fill="#000" />
						<circle cx="30" cy="68" r="3" fill="#000" />
						<circle cx="70" cy="68" r="3" fill="#000" />
						<rect x="34" y="40" width="32" height="22" rx="4" fill="#00E5FF" stroke="#000" strokeWidth="3" />
						<path d="M 40 51 L 60 51" stroke="#004D40" strokeWidth="3" strokeLinecap="round" />
					</svg>
				);

			case "bot_battery":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						<rect x="42" y="16" width="16" height="8" rx="2" fill="#78909C" stroke="#000" strokeWidth="3" />
						<rect x="26" y="24" width="48" height="58" rx="6" fill="#263238" stroke="#000" strokeWidth="4" />
						<rect x="32" y="32" width="36" height="42" rx="3" fill="#00FF66" stroke="#000" strokeWidth="2" />
						<polygon points="52,38 42,54 50,54 46,68 58,50 50,50" fill="#FFE600" stroke="#000" strokeWidth="2" />
					</svg>
				);

			case "bot_visor":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						<path d="M 15 40 Q 50 25 85 40 L 80 65 Q 50 55 20 65 Z" fill="#FF007A" stroke="#000" strokeWidth="4" />
						<path d="M 22 45 Q 50 35 78 45" stroke="#FFE600" strokeWidth="4" fill="none" strokeLinecap="round" />
						<line x1="12" y1="52" x2="22" y2="52" stroke="#000" strokeWidth="4" />
						<line x1="78" y1="52" x2="88" y2="52" stroke="#000" strokeWidth="4" />
					</svg>
				);

			case "bot_antenna":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						<circle cx="50" cy="22" r="12" fill="#FFE600" stroke="#000" strokeWidth="4" />
						<circle cx="50" cy="22" r="4" fill="#FF007A" />
						<line x1="50" y1="34" x2="50" y2="76" stroke="#000" strokeWidth="5" strokeLinecap="round" />
						<ellipse cx="50" cy="78" rx="24" ry="8" fill="#78909C" stroke="#000" strokeWidth="3" />
						<path d="M 32 16 Q 50 4 68 16" stroke="#00FF66" strokeWidth="3" fill="none" strokeDasharray="3,3" />
					</svg>
				);

			case "bot_jetpack":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						<rect x="22" y="24" width="22" height="42" rx="4" fill="#37474F" stroke="#000" strokeWidth="3" />
						<rect x="56" y="24" width="22" height="42" rx="4" fill="#37474F" stroke="#000" strokeWidth="3" />
						<rect x="42" y="34" width="16" height="20" fill="#78909C" stroke="#000" strokeWidth="3" />
						{/* Thruster Flames */}
						<polygon points="26,66 33,88 40,66" fill="#00E5FF" stroke="#000" strokeWidth="2" />
						<polygon points="60,66 67,88 74,66" fill="#00E5FF" stroke="#000" strokeWidth="2" />
					</svg>
				);

			// ================= YETI ITEMS =================
			case "yeti_fur":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						<path d="M 20 40 Q 30 20 50 20 Q 70 20 80 40 L 85 75 L 75 68 L 65 80 L 50 70 L 35 80 L 25 68 L 15 75 Z" fill="#E1F5FE" stroke="#000" strokeWidth="4" />
						<path d="M 38 42 L 44 48 M 56 42 L 50 48 M 46 58 L 54 58" stroke="#81D4FA" strokeWidth="4" strokeLinecap="round" />
					</svg>
				);

			case "yeti_fangs":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						<path d="M 18 36 Q 50 30 82 36 L 82 50 Q 50 45 18 50 Z" fill="#263238" stroke="#000" strokeWidth="4" />
						{/* Sharp Fangs */}
						<polygon points="28,48 35,74 42,48" fill="#FFFDE7" stroke="#000" strokeWidth="3" />
						<polygon points="58,48 65,74 72,48" fill="#FFFDE7" stroke="#000" strokeWidth="3" />
					</svg>
				);

			case "yeti_horns":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						<path d="M 30 65 Q 12 50 18 20 Q 32 35 38 52 Z" fill="#80DEEA" stroke="#000" strokeWidth="4" />
						<path d="M 70 65 Q 88 50 82 20 Q 68 35 62 52 Z" fill="#80DEEA" stroke="#000" strokeWidth="4" />
						<line x1="22" y1="36" x2="30" y2="40" stroke="#000" strokeWidth="2" />
						<line x1="78" y1="36" x2="70" y2="40" stroke="#000" strokeWidth="2" />
					</svg>
				);

			case "yeti_club":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						<polygon points="20,80 32,86 78,35 66,22" fill="#8D6E63" stroke="#000" strokeWidth="4" />
						{/* Spikes */}
						<polygon points="62,20 70,10 74,22" fill="#B0BEC5" stroke="#000" strokeWidth="2" />
						<polygon points="76,32 88,32 80,42" fill="#B0BEC5" stroke="#000" strokeWidth="2" />
						<line x1="38" y1="62" x2="48" y2="52" stroke="#5D4037" strokeWidth="3" />
					</svg>
				);

			case "yeti_amulet":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						<circle cx="50" cy="58" r="24" fill="#00E5FF" stroke="#000" strokeWidth="4" />
						<polygon points="50,42 62,64 38,64" fill="#FFE600" stroke="#000" strokeWidth="2" />
						<path d="M 28 20 Q 50 42 72 20" stroke="#795548" strokeWidth="4" fill="none" strokeLinecap="round" />
					</svg>
				);

			// ================= GINGERBREAD ITEMS =================
			case "cookie_body":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						<circle cx="50" cy="35" r="18" fill="#BCAAA4" stroke="#000" strokeWidth="4" />
						<rect x="36" y="50" width="28" height="34" rx="8" fill="#BCAAA4" stroke="#000" strokeWidth="4" />
						<circle cx="44" cy="32" r="3" fill="#000" />
						<circle cx="56" cy="32" r="3" fill="#000" />
						<path d="M 44 42 Q 50 48 56 42" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round" />
					</svg>
				);

			case "cookie_buttons":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						<circle cx="50" cy="28" r="10" fill="#FF007A" stroke="#000" strokeWidth="3" />
						<circle cx="50" cy="52" r="10" fill="#00FF66" stroke="#000" strokeWidth="3" />
						<circle cx="50" cy="76" r="10" fill="#FFE600" stroke="#000" strokeWidth="3" />
						<circle cx="48" cy="26" r="3" fill="#FFF" />
						<circle cx="48" cy="50" r="3" fill="#FFF" />
						<circle cx="48" cy="74" r="3" fill="#FFF" />
					</svg>
				);

			case "cookie_smile":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						<path d="M 24 50 Q 50 82 76 50 Q 50 92 24 50 Z" fill="#FFFFFF" stroke="#000" strokeWidth="4" />
						<circle cx="34" cy="40" r="6" fill="#FF007A" stroke="#000" strokeWidth="2" />
						<circle cx="66" cy="40" r="6" fill="#FF007A" stroke="#000" strokeWidth="2" />
					</svg>
				);

			case "cookie_hat":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						<path d="M 32 58 C 18 40 30 18 50 18 C 70 18 82 40 68 58 Z" fill="#FFFFFF" stroke="#000" strokeWidth="4" />
						<rect x="30" y="56" width="40" height="18" rx="3" fill="#FF3D00" stroke="#000" strokeWidth="3" />
						<line x1="42" y1="28" x2="42" y2="48" stroke="#E0E0E0" strokeWidth="2" />
						<line x1="58" y1="28" x2="58" y2="48" stroke="#E0E0E0" strokeWidth="2" />
					</svg>
				);

			case "cookie_cane":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_#000]">
						<path d="M 40 85 L 40 42 Q 40 18 62 18 Q 78 18 78 34 L 78 40" stroke="#FF1744" strokeWidth="12" fill="none" strokeLinecap="round" />
						<path d="M 40 85 L 40 42 Q 40 18 62 18 Q 78 18 78 34 L 78 40" stroke="#000" strokeWidth="16" fill="none" strokeLinecap="round" style={{ zIndex: -1 }} />
						<line x1="36" y1="72" x2="44" y2="68" stroke="#FFFFFF" strokeWidth="5" />
						<line x1="36" y1="52" x2="44" y2="48" stroke="#FFFFFF" strokeWidth="5" />
					</svg>
				);

			// ================= SPECIAL POWER-UPS & HAZARDS =================
			case "power_cocoa":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[4px_4px_0px_#000]">
						{/* Steam */}
						<path d="M 42 16 Q 38 24 44 32" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round" />
						<path d="M 58 12 Q 54 20 60 28" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round" />
						{/* Mug */}
						<rect x="26" y="34" width="44" height="48" rx="6" fill="#FF007A" stroke="#000" strokeWidth="4" />
						{/* Handle */}
						<path d="M 70 42 Q 88 42 88 56 Q 88 70 70 70" stroke="#000" strokeWidth="4" fill="none" />
						{/* Marshmallow */}
						<circle cx="40" cy="42" r="6" fill="#FFF" stroke="#000" strokeWidth="2" />
						<circle cx="54" cy="44" r="5" fill="#FFF" stroke="#000" strokeWidth="2" />
					</svg>
				);

			case "power_blizzard":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[4px_4px_0px_#000]">
						<polygon points="50,14 62,26 86,26 74,50 86,74 62,74 50,86 38,74 14,74 26,50 14,26 38,26" fill="#00E5FF" stroke="#000" strokeWidth="4" />
						<circle cx="50" cy="50" r="14" fill="#FFFFFF" stroke="#000" strokeWidth="3" />
						<line x1="50" y1="24" x2="50" y2="76" stroke="#000" strokeWidth="3" />
						<line x1="24" y1="50" x2="76" y2="50" stroke="#000" strokeWidth="3" />
					</svg>
				);

			case "power_star":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[4px_4px_0px_#000]">
						<polygon points="50,10 63,38 92,38 68,56 78,85 50,67 22,85 32,56 8,38 37,38" fill="#FFE600" stroke="#000" strokeWidth="4" />
						<circle cx="50" cy="50" r="8" fill="#FF007A" stroke="#000" strokeWidth="2" />
					</svg>
				);

			case "hazard_spike":
				return (
					<svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[4px_4px_0px_#000]">
						<circle cx="50" cy="50" r="26" fill="#212121" stroke="#000" strokeWidth="4" />
						{/* Spikes */}
						<polygon points="50,12 45,26 55,26" fill="#FF1744" stroke="#000" strokeWidth="2" />
						<polygon points="50,88 45,74 55,74" fill="#FF1744" stroke="#000" strokeWidth="2" />
						<polygon points="12,50 26,45 26,55" fill="#FF1744" stroke="#000" strokeWidth="2" />
						<polygon points="88,50 74,45 74,55" fill="#FF1744" stroke="#000" strokeWidth="2" />
						{/* Skull or Warning cross */}
						<line x1="42" y1="42" x2="58" y2="58" stroke="#FF1744" strokeWidth="4" strokeLinecap="round" />
						<line x1="58" y1="42" x2="42" y2="58" stroke="#FF1744" strokeWidth="4" strokeLinecap="round" />
					</svg>
				);

			default:
				return (
					<div className="w-full h-full flex items-center justify-center bg-yellow-300 border-3 border-black font-black text-xl">
						?
					</div>
				);
		}
	};

	return (
		<div
			style={{ width: size, height: size }}
			className={`inline-block select-none pointer-events-none transition-transform hover:scale-105 ${className}`}
		>
			{renderContent()}
		</div>
	);
};

export default Item3D;
