interface TimerProps {
	seconds: number;
	isActive: boolean;
}

const Timer = ({ seconds, isActive }: TimerProps) => {
	if (!isActive) return null;

	const isLow = seconds <= 5;
	const isCritical = seconds <= 3;

	return (
		<div
			className={`fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 ${
				isLow ? "animate-pulse" : ""
			}`}
		>
			<div
				className={`
				text-3xl sm:text-6xl md:text-8xl font-bold text-center px-3 sm:px-6 py-2 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl
				${
					isCritical
						? "bg-red-600 text-white animate-bounce border-2 sm:border-4 border-red-800"
						: isLow
						? "bg-orange-500 text-white border-2 sm:border-4 border-orange-700"
						: "bg-blue-600 text-white border-2 sm:border-4 border-blue-800"
				}
				transition-all duration-300
			`}
			>
				⏰ {seconds}
			</div>
			{isLow && (
				<div className="text-center mt-1 sm:mt-2 text-sm sm:text-xl font-bold text-red-600 animate-pulse">
					HURRY UP!
				</div>
			)}
		</div>
	);
};

export default Timer;
