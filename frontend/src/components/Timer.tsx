import React from "react";

interface TimerProps {
	seconds: number;
	isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ seconds, isActive }) => {
	if (!isActive) return null;

	const isCritical = seconds <= 5;

	return (
		<div className="fixed top-3 left-1/2 transform -translate-x-1/2 z-40">
			<div
				className={`
				text-lg sm:text-2xl font-black text-center px-6 py-2.5 border-4 border-black shadow-[4px_4px_0px_#000] uppercase tracking-wider transition-colors
				${
					isCritical
						? "bg-[#FF007A] text-white animate-bounce"
						: "bg-[#FFE600] text-black"
				}
			`}
			>
				TIME: {seconds}S
			</div>
			{isCritical && (
				<div className="bg-black text-[#FFE600] font-black text-[10px] text-center uppercase tracking-widest px-2.5 py-1 border-2 border-white mt-1.5 shadow-[2px_2px_0px_#000]">
					CRITICAL TIME!
				</div>
			)}
		</div>
	);
};

export default Timer;
