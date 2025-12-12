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
		onCollect();
	};

	return (
		<div
			onClick={handleClick}
			className="absolute transition-all duration-75 select-none cursor-pointer "
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
						? "scale-100 drop-shadow-2xl animate-bounce"
						: "drop-shadow-lg "
				} transition-all duration-300`}
			>
				{ITEM_EMOJIS[item.type]}
			</div>
		</div>
	);
};

export default FallingItemComponent;
