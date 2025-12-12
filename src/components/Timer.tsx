interface TimerProps {
	seconds: number;
	isActive: boolean;
}

const Timer = ({ seconds, isActive }: TimerProps) => {
	if (!isActive) return null;

	const isCritical = seconds <= 5;

	return (
		<div
			className={`fixed top-4 md:top-5 right-2 md:left-1/2 transform -translate-x-1/2 z-50 `}
		>
			<div
				className={`
				text-xl sm:text-2xl md:text-3xl font-bold text-center px-1 sm:px-2 py-2 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl
				${
					isCritical
						? "bg-red-600 text-white animate-pulse border-2 sm:border-4 border-red-800"
						: "bg-blue-600 text-white border-2 sm:border-4 border-blue-800"
				}
				transition-all duration-300
			`}
			>
				⏰ {seconds}
			</div>
			{isCritical && (
				<div className="text-center mt-1 text-sm sm:text-sm font-bold text-red-600 ">
					HURRY UP!
				</div>
			)}
		</div>
	);
};

export default Timer;
