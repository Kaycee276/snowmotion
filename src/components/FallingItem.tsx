import type { FallingItem as FallingItemType } from "../types/game";
import { ITEM_EMOJIS } from "../types/game";

interface FallingItemProps {
	item: FallingItemType;
	onCollect: () => void;
}

const FallingItemComponent = ({ item, onCollect }: FallingItemProps) => {
	const isInCollectionZone = item.y >= 85 && item.y <= 95;

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		// Always allow clicking, but visual feedback when in zone
		onCollect();
	};

	return (
		<div
			onClick={handleClick}
			className="absolute transition-all duration-75 select-none cursor-pointer hover:scale-110 active:scale-95"
			style={{
				left: `${item.x}%`,
				top: `${item.y}%`,
				transform: "translate(-50%, -50%)",
				fontSize: "3rem",
				userSelect: "none",
				pointerEvents: "auto",
				zIndex: 50,
			}}
		>
			<div
				className={`${
					isInCollectionZone
						? "scale-125 drop-shadow-2xl animate-bounce"
						: "drop-shadow-lg hover:scale-110"
				} transition-all duration-300`}
			>
				{ITEM_EMOJIS[item.type]}
			</div>
			{/* Visual indicator when clickable */}
			{!isInCollectionZone && (
				<div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-500 rounded-full opacity-50 animate-pulse" />
			)}
		</div>
	);
};

export default FallingItemComponent;
