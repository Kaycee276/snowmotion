import React from "react";
import type { FallingItem as FallingItemType } from "../types/game";
import Item3D from "./Item3D";

interface FallingItemProps {
	item: FallingItemType;
	onCollect: () => void;
}

const FallingItemComponent: React.FC<FallingItemProps> = React.memo(({ item, onCollect }) => {
	const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
		e.stopPropagation();
		e.preventDefault();
		onCollect();
	};

	const isSpecial = item.type.startsWith("power_") || item.type.startsWith("hazard_");

	return (
		<div
			onClick={handleClick}
			onTouchStart={handleClick}
			className="absolute select-none cursor-pointer transform -translate-x-1/2 -translate-y-1/2 will-change-transform z-30 group"
			style={{
				left: `${item.x}%`,
				top: `${item.y}%`,
				pointerEvents: "auto",
			}}
		>
			<div
				className={`relative p-1.5 sm:p-2 bg-white/95 rounded-xl border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none hover:scale-110 transition-transform ${
					isSpecial ? "ring-2 ring-yellow-400 animate-pulse" : ""
				}`}
			>
				<Item3D type={item.type} size={54} />
			</div>
		</div>
	);
});

export default FallingItemComponent;
