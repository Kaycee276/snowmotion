import { ITEM_EMOJIS } from "../types/game";

interface SnowmanDisplayProps {
	currentSnowman: {
		snowball: boolean;
		coal: boolean;
		carrot: boolean;
		hat: boolean;
		scarf: boolean;
	};
}

const SnowmanDisplay = ({ currentSnowman }: SnowmanDisplayProps) => {
	return (
		<div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
			<div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-xl border-4 border-blue-200">
				<div className="text-center">
					<h3 className="text-xl font-bold text-gray-700 mb-4">Your Snowman</h3>
					<div className="flex flex-col items-center gap-2 text-4xl">
						{/* Hat */}
						{currentSnowman.hat ? (
							<div className="animate-bounce">{ITEM_EMOJIS.hat}</div>
						) : (
							<div className="opacity-20">🎩</div>
						)}

						{/* Scarf (optional, wraps around) */}
						{currentSnowman.scarf && (
							<div className="animate-pulse">{ITEM_EMOJIS.scarf}</div>
						)}

						{/* Head with face */}
						<div className="relative">
							<div
								className={
									currentSnowman.snowball ? "animate-pulse" : "opacity-20"
								}
							>
								{ITEM_EMOJIS.snowball}
							</div>
							{/* Eyes */}
							{currentSnowman.coal && (
								<div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex gap-4">
									<span className="text-xl">{ITEM_EMOJIS.coal}</span>
									<span className="text-xl">{ITEM_EMOJIS.coal}</span>
								</div>
							)}
							{/* Nose */}
							{currentSnowman.carrot && (
								<div className="absolute top-6 left-1/2 transform -translate-x-1/2">
									<span className="text-2xl">{ITEM_EMOJIS.carrot}</span>
								</div>
							)}
						</div>

						{/* Body */}
						<div className={currentSnowman.snowball ? "" : "opacity-20"}>
							{ITEM_EMOJIS.snowball}
						</div>
					</div>

					{/* Progress indicator */}
					<div className="mt-4 flex justify-center gap-2">
						{["snowball", "coal", "carrot", "hat"].map((part) => (
							<div
								key={part}
								className={`w-3 h-3 rounded-full ${
									currentSnowman[part as keyof typeof currentSnowman]
										? "bg-green-500"
										: "bg-gray-300"
								}`}
							/>
						))}
						{currentSnowman.scarf && (
							<div
								className="w-3 h-3 rounded-full bg-yellow-500"
								title="Scarf bonus!"
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SnowmanDisplay;
