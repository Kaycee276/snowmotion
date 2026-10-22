import React from "react";

interface TimerProps {
	seconds: number;
	isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ seconds, isActive }) => {
	if (!isActive) return null;

	const isCritical = seconds <= 5;

	return (
		<div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-40">
			<div
				className={`
				text-lg sm:text-2xl font-black text-center px-4 py-2 rounded-xl border-3 border-black shadow-[4px_4px_0px_#000] transition-colors
				${
					isCritical
						? "bg-[#FF007A] text-white animate-bounce"
						: "bg-[#FFE600] text-black"
				}
			`}
			>
				⏱️ {seconds}s
			</div>
			{isCritical && (
				<div className="bg-black text-[#FFE600] font-black text-[10px] text-center uppercase tracking-widest px-2 py-0.5 rounded border border-white mt-1">
					CRITICAL TIME!
				</div>
			)}
		</div>
	);
};

export default Timer;
