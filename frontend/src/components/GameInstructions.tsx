interface GameInstructionsProps {
	onStart?: () => void;
	onClose?: () => void;
	showStartButton?: boolean;
}

const GameInstructions = ({
	onStart,
	onClose,
	showStartButton = true,
}: GameInstructionsProps) => {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-110">
			<div className="bg-white rounded-2xl p-6 max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
				<h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
					❄️ SnowMotion Game Guide
				</h1>

				<div className="space-y-4 text-gray-700">
					<div>
						<h2 className="text-xl font-semibold text-blue-500 mb-2">
							🎯 Objective
						</h2>
						<p>
							Build complete snowmen by collecting falling items in the correct
							order!
						</p>
					</div>

					<div>
						<h2 className="text-xl font-semibold text-blue-500 mb-2">
							📋 Building Order
						</h2>
						<div className="bg-gray-100 p-3 rounded-lg">
							<p>
								1. ❄️ <strong>Snowball</strong> (body)
							</p>
							<p>
								2. ⚫ <strong>Coal</strong> (eyes/buttons)
							</p>
							<p>
								3. 🥕 <strong>Carrot</strong> (nose)
							</p>
							<p>
								4. 🎩 <strong>Hat</strong> (top)
							</p>
							<p>
								5. 🧣 <strong>Scarf</strong> (bonus - can collect anytime!)
							</p>
						</div>
					</div>

					<div>
						<h2 className="text-xl font-semibold text-blue-500 mb-2">
							🎮 How to Play
						</h2>
						<ul className="list-disc list-inside space-y-1">
							<li>Items fall from the sky automatically</li>
							<li>Click/tap items to collect them manually</li>
							<li>Follow the building order to avoid time penalties</li>
						</ul>
					</div>

					<div>
						<h2 className="text-xl font-semibold text-blue-500 mb-2">
							⏰ Timer System
						</h2>
						<div className="bg-yellow-100 p-3 rounded-lg border-l-4 border-yellow-500">
							<p>
								<strong>30 seconds</strong> to build your first snowman
							</p>
							<p>
								<strong>+15 seconds</strong> added when you complete a snowman
							</p>
							<p>
								<strong>Lose a life</strong> if timer reaches zero
							</p>
						</div>
					</div>

					<div>
						<h2 className="text-xl font-semibold text-blue-500 mb-2">
							🏆 Scoring & Penalties
						</h2>
						<ul className="list-disc list-inside space-y-1">
							<li>
								<strong>+1 point</strong> for each complete snowman
							</li>
							<li>
								<strong>+1 bonus point</strong> if snowman includes scarf
							</li>
							<li>
								<strong>-10 seconds</strong> for collecting wrong item
							</li>
						</ul>
					</div>

					<div>
						<h2 className="text-xl font-semibold text-blue-500 mb-2">
							🏆 Leaderboard System
						</h2>
						<div className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-500">
							<p className="text-sm mb-2"><strong>Fair Competition:</strong> Scores are normalized across difficulties</p>
							<ul className="text-sm space-y-1">
								<li>• <strong>Easy:</strong> 1x multiplier (raw score)</li>
								<li>• <strong>Medium:</strong> 1.5x multiplier</li>
								<li>• <strong>Hard:</strong> 2x multiplier</li>
							</ul>
							<p className="text-xs mt-2 text-purple-700">Example: 10 points on Hard = 20 leaderboard points</p>
						</div>
					</div>

					<div>
						<h2 className="text-xl font-semibold text-blue-500 mb-2">
							💡 Pro Tips
						</h2>
						<ul className="list-disc list-inside space-y-1 text-sm">
							<li>Watch the "Next:" indicator to see what item you need</li>
							<li>Collect scarves anytime for bonus points</li>
							<li>Build snowmen quickly to get more time</li>
							<li>Avoid wrong items - they cost you 10 seconds!</li>
							<li>Connect your wallet to submit scores to the blockchain!</li>
						</ul>
					</div>
				</div>

				<div className="sticky bottom-0 left-0 right-0 mt-6 bg-white">
					{showStartButton ? (
						<button
							onClick={onStart}
							className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors"
						>
							Start Playing! 🎮
						</button>
					) : (
						<button
							onClick={onClose}
							className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors"
						>
							Close ✖️
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default GameInstructions;
