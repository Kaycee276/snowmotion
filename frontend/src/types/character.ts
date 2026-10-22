export type CharacterId = "snowman" | "robot" | "yeti" | "gingerbread";

export interface CharacterPartDef {
	id: string;
	name: string;
	label: string;
	isBonus?: boolean;
}

export interface CharacterConfig {
	id: CharacterId;
	name: string;
	title: string;
	themeColor: string;
	secondaryColor: string;
	description: string;
	requiredParts: string[];
	bonusPart: string;
	parts: CharacterPartDef[];
}

export const CHARACTERS: Record<CharacterId, CharacterConfig> = {
	snowman: {
		id: "snowman",
		name: "Frosty Snowman",
		title: "Classic Builder",
		themeColor: "#00F0FF",
		secondaryColor: "#FFE600",
		description: "Roll crisp snow into a winter legend with coal, carrot, and top hat.",
		requiredParts: ["snowball", "coal", "carrot", "hat"],
		bonusPart: "scarf",
		parts: [
			{ id: "snowball", name: "Snowball Base", label: "Base" },
			{ id: "coal", name: "Coal Eyes & Buttons", label: "Coal" },
			{ id: "carrot", name: "Carrot Nose", label: "Carrot" },
			{ id: "hat", name: "Vintage Top Hat", label: "Top Hat" },
			{ id: "scarf", name: "Cozy Wool Scarf", label: "Scarf", isBonus: true },
		],
	},
	robot: {
		id: "robot",
		name: "Cyber Bot-3000",
		title: "AI Android",
		themeColor: "#00FF66",
		secondaryColor: "#FF007A",
		description: "Construct an autonomous arctic mecha with battery, visor, and antenna.",
		requiredParts: ["bot_chassis", "bot_battery", "bot_visor", "bot_antenna"],
		bonusPart: "bot_jetpack",
		parts: [
			{ id: "bot_chassis", name: "Titanium Chassis", label: "Chassis" },
			{ id: "bot_battery", name: "Plasma Core", label: "Plasma" },
			{ id: "bot_visor", name: "Cyber Visor", label: "Visor" },
			{ id: "bot_antenna", name: "Quantum Antenna", label: "Antenna" },
			{ id: "bot_jetpack", name: "Neon Jetpack", label: "Jetpack", isBonus: true },
		],
	},
	yeti: {
		id: "yeti",
		name: "Yeti the Savage",
		title: "Blizzard Beast",
		themeColor: "#FF007A",
		secondaryColor: "#00F0FF",
		description: "Awaken the mountain guardian with frost fur, razor fangs, and battle club.",
		requiredParts: ["yeti_fur", "yeti_fangs", "yeti_horns", "yeti_club"],
		bonusPart: "yeti_amulet",
		parts: [
			{ id: "yeti_fur", name: "Ice Fur Torso", label: "Fur" },
			{ id: "yeti_fangs", name: "Glacial Fangs", label: "Fangs" },
			{ id: "yeti_horns", name: "Crystal Horns", label: "Horns" },
			{ id: "yeti_club", name: "Frosted Club", label: "Club" },
			{ id: "yeti_amulet", name: "Rune Amulet", label: "Amulet", isBonus: true },
		],
	},
	gingerbread: {
		id: "gingerbread",
		name: "Ginger Defender",
		title: "Cookie Champion",
		themeColor: "#FFE600",
		secondaryColor: "#FF3366",
		description: "Bake a fearless spiced warrior with icing, gumdrops, and candy cane.",
		requiredParts: ["cookie_body", "cookie_buttons", "cookie_smile", "cookie_hat"],
		bonusPart: "cookie_cane",
		parts: [
			{ id: "cookie_body", name: "Golden Crust", label: "Crust" },
			{ id: "cookie_buttons", name: "Gumdrop Buttons", label: "Gumdrops" },
			{ id: "cookie_smile", name: "Sugar Frosting", label: "Frosting" },
			{ id: "cookie_hat", name: "Baker's Toque", label: "Toque" },
			{ id: "cookie_cane", name: "Peppermint Cane", label: "Cane", isBonus: true },
		],
	},
};
