import React, { useState } from "react";
import { CHARACTERS, type CharacterId } from "../types/character";
import Item3D from "./Item3D";
import type { ItemType } from "../types/game";
import Leaderboard from "./Leaderboard";
import StellarWalletModal from "./StellarWalletModal";
import { useGameStore } from "../store/gameStore";
import { sound } from "../utils/soundEffects";

interface LandingPageProps {
	onPlay: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onPlay }) => {
	const {
		connectedAddress,
		connectedWalletName,
		guestAddress,
		isWalletModalOpen,
		openWalletModal,
		closeWalletModal,
		setConnectedAddress,
		setConnectedWalletName,
	} = useGameStore();

	const [showLeaderboard, setShowLeaderboard] = useState(false);
	const [activePreviewChar, setActivePreviewChar] = useState<CharacterId>("snowman");
	const [isMuted, setIsMuted] = useState(sound.getMuted());

	const handleSoundToggle = () => {
		const muted = sound.toggleMute();
		setIsMuted(muted);
	};

	const charList = Object.values(CHARACTERS);
	const currentChar = CHARACTERS[activePreviewChar] || CHARACTERS.snowman;
	const activeAddress = connectedAddress || guestAddress;

	return (
		<div className="min-h-screen bg-[#FFFDF0] text-black font-sans selection:bg-[#FFE600] selection:text-black">
			{/* Top Announcement Marquee Bar */}
			<div className="bg-[#FFE600] border-b-3 border-black py-2 px-4 overflow-hidden shadow-[0px_2px_0px_#000]">
				<div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-black uppercase tracking-wider">
					<div className="flex items-center gap-3">
						<span className="bg-black text-[#FFE600] px-2.5 py-0.5 border border-black font-black">
							LIVE ON TESTNET
						</span>
						<span className="hidden sm:inline">
							SOROBAN SMART CONTRACT LEADERBOARD • 100% GASLESS ATTESTATION
						</span>
					</div>
					<div className="flex items-center gap-4">
						<button
							type="button"
							onClick={handleSoundToggle}
							className="hover:underline cursor-pointer"
						>
							SOUND: {isMuted ? "OFF" : "ON"}
						</button>
						<a
							href="https://github.com/Kaycee276/snowmotion"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:underline flex items-center gap-1"
						>
							GITHUB ↗
						</a>
					</div>
				</div>
			</div>

			{/* Main Navigation Header */}
			<header className="sticky top-0 z-40 bg-[#FFFDF0] border-b-4 border-black px-4 sm:px-8 py-4 shadow-[0px_4px_0px_#000]">
				<div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
					{/* Logo */}
					<div className="flex items-center gap-3">
						<div className="bg-[#00F0FF] border-3 border-black px-3.5 py-1.5 shadow-[3px_3px_0px_#000] -rotate-1">
							<span className="font-black text-xl sm:text-2xl uppercase tracking-tighter text-black flex items-center gap-1.5">
								<span>❄️</span> SNOWMOTION
							</span>
						</div>
						<span className="hidden md:inline-block bg-[#00FF66] border-2 border-black font-black text-[10px] px-2 py-0.5 uppercase shadow-[1px_1px_0px_#000]">
							ARCADE V1.0
						</span>
					</div>

					{/* Navigation Links */}
					<nav className="hidden lg:flex items-center gap-6 font-black text-xs uppercase tracking-wider">
						<a href="#how-it-works" className="hover:text-[#FF007A] transition-colors">
							How It Works
						</a>
						<a href="#champions" className="hover:text-[#FF007A] transition-colors">
							Champions
						</a>
						<a href="#powerups" className="hover:text-[#FF007A] transition-colors">
							Power-ups
						</a>
						<a href="#blockchain" className="hover:text-[#FF007A] transition-colors">
							Stellar Tech
						</a>
					</nav>

					{/* Header Actions */}
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => setShowLeaderboard(true)}
							className="bg-white hover:bg-gray-100 text-black border-2 border-black px-3.5 py-2 font-black text-xs uppercase shadow-[2px_2px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
						>
							LEADERBOARD
						</button>

						<button
							type="button"
							onClick={openWalletModal}
							className="hidden sm:inline-block bg-[#FFE600] hover:bg-[#fff04d] text-black border-2 border-black px-3.5 py-2 font-black text-xs uppercase shadow-[2px_2px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
						>
							{connectedAddress
								? `${connectedWalletName ? `${connectedWalletName}: ` : ""}${connectedAddress.slice(0, 4)}...${connectedAddress.slice(-4)}`
								: "CONNECT WALLET"}
						</button>

						<button
							type="button"
							onClick={onPlay}
							className="bg-[#00FF66] hover:bg-[#38ff88] text-black border-3 border-black px-5 py-2 font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
						>
							PLAY NOW ▶
						</button>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative overflow-hidden py-12 sm:py-20 px-4 sm:px-8 border-b-4 border-black bg-[#E0F7FA]/40"
				style={{
					backgroundImage: `radial-gradient(#000 1px, transparent 1px), radial-gradient(#000 1px, transparent 1px)`,
					backgroundSize: "32px 32px",
					backgroundPosition: "0 0, 16px 16px",
				}}
			>
				<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
					{/* Hero Left Column */}
					<div className="lg:col-span-7 space-y-6">
						<div className="inline-flex items-center gap-2 bg-[#FFE600] border-3 border-black px-3.5 py-1 shadow-[3px_3px_0px_#000]">
							<span className="font-black text-xs uppercase tracking-wider text-black">
								★ 60 FPS WEB3 RETRO ARCADE
							</span>
						</div>

						<h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-black leading-[1.05]">
							BUILD WINTER <span className="bg-[#00F0FF] px-2 border-2 border-black inline-block shadow-[3px_3px_0px_#000] -rotate-1">CHAMPIONS</span> ON STELLAR.
						</h1>

						<p className="text-sm sm:text-base font-bold text-gray-800 leading-relaxed max-w-xl">
							Fast-paced neo-brutalist assembly where physics meets cryptography. Catch falling body parts in strict sequence, dodge lethal spikes, freeze the blizzard, and immortalize your verified high score on Stellar Soroban smart contracts.
						</p>

						{/* Highlights Pill Badges */}
						<div className="flex flex-wrap gap-2.5 pt-2">
							<span className="bg-white border-2 border-black font-black text-xs px-3 py-1 shadow-[2px_2px_0px_#000] uppercase">
								⚡ 100% Gasless
							</span>
							<span className="bg-white border-2 border-black font-black text-xs px-3 py-1 shadow-[2px_2px_0px_#000] uppercase">
								🛡️ Anti-Cheat Salt
							</span>
							<span className="bg-white border-2 border-black font-black text-xs px-3 py-1 shadow-[2px_2px_0px_#000] uppercase">
								🎮 Instant Guest Play
							</span>
							<span className="bg-white border-2 border-black font-black text-xs px-3 py-1 shadow-[2px_2px_0px_#000] uppercase">
								❄️ 4 Characters
							</span>
						</div>

						{/* Big Hero CTAs */}
						<div className="pt-4 flex flex-col sm:flex-row gap-4">
							<button
								type="button"
								onClick={onPlay}
								className="bg-[#00FF66] hover:bg-[#2eff83] text-black border-4 border-black px-8 py-4 font-black text-base uppercase tracking-wider shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_#000] cursor-pointer transition-all text-center"
							>
								START PLAYING (INSTANT) ▶
							</button>

							<button
								type="button"
								onClick={() => setShowLeaderboard(true)}
								className="bg-white hover:bg-yellow-100 text-black border-4 border-black px-6 py-4 font-black text-base uppercase tracking-wider shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_#000] cursor-pointer transition-all text-center"
							>
								VIEW LEADERBOARD 🏆
							</button>
						</div>

						{activeAddress && (
							<div className="text-xs font-black text-gray-700 uppercase flex items-center gap-2 pt-1">
								<span className="w-2.5 h-2.5 bg-[#00FF66] border border-black inline-block" />
								<span>
									{connectedAddress ? "Wallet Connected" : "Guest Mode Ready"}: {activeAddress.slice(0, 6)}...{activeAddress.slice(-4)}
								</span>
							</div>
						)}
					</div>

					{/* Hero Right Column: Interactive Neo-Brutalist Game Preview */}
					<div className="lg:col-span-5">
						<div className="bg-[#FFFDF0] border-4 border-black p-6 sm:p-8 shadow-[10px_10px_0px_#000] relative">
							{/* Badge */}
							<div className="flex items-center justify-between pb-4 border-b-3 border-black mb-6">
								<span className="bg-[#FF007A] text-white border-2 border-black font-black text-[11px] px-3 py-1 uppercase shadow-[2px_2px_0px_#000]">
									LIVE PREVIEW
								</span>
								<span className="font-mono font-black text-xs bg-[#FFE600] px-2 py-0.5 border border-black">
									60 FPS
								</span>
							</div>

							{/* Animated Visual Canvas Box */}
							<div className="bg-[#E0F7FA] border-3 border-black p-6 flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden shadow-inner">
								{/* Falling Elements Simulation */}
								<div className="absolute top-2 left-6 animate-bounce">
									<Item3D type="power_cocoa" size={44} />
								</div>
								<div className="absolute top-4 right-8 animate-pulse">
									<Item3D type="power_blizzard" size={42} />
								</div>
								<div className="absolute bottom-4 left-4">
									<Item3D type="hazard_spike" size={38} />
								</div>

								{/* Center Assembled Character Preview */}
								<div className="my-auto flex flex-col items-center">
									<div className="p-3 bg-white/90 border-3 border-black shadow-[4px_4px_0px_#000] mb-3">
										<Item3D type={(currentChar.parts[0]?.id || "snowball") as ItemType} size={68} />
									</div>
									<span className="bg-black text-white font-black text-xs px-3 py-1 uppercase tracking-wider">
										{currentChar.name}
									</span>
								</div>

								{/* Floating Multiplier */}
								<div className="absolute bottom-3 right-3 bg-[#FFE600] border-2 border-black font-black text-xs px-2.5 py-1 shadow-[2px_2px_0px_#000] -rotate-3">
									COMBO x5!
								</div>
							</div>

							{/* Recipe Preview Row */}
							<div className="mt-5 pt-4 border-t-3 border-black">
								<div className="text-[11px] font-black uppercase text-gray-700 mb-2">
									Assembly Sequence:
								</div>
								<div className="flex items-center gap-2 overflow-x-auto pb-1">
									{currentChar.parts.map((p, idx) => (
										<div
											key={p.id}
											className="bg-white border-2 border-black px-2 py-1 text-[10px] font-black uppercase shadow-[1px_1px_0px_#000] shrink-0"
										>
											{idx + 1}. {p.label}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Section: How It Works (3 Concrete Steps) */}
			<section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto border-b-4 border-black">
				<div className="text-center max-w-2xl mx-auto mb-14">
					<div className="inline-block bg-[#00F0FF] border-3 border-black px-4 py-1.5 shadow-[3px_3px_0px_#000] mb-3">
						<h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-black">
							THE CORE GAMEPLAY LOOP
						</h2>
					</div>
					<h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
						HOW TO PLAY SNOWMOTION
					</h3>
					<p className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide mt-2">
						Three simple rules to conquer the global leaderboard
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
					{/* Step 1 */}
					<div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000] flex flex-col justify-between">
						<div>
							<div className="w-12 h-12 bg-[#FFE600] border-3 border-black font-black text-xl flex items-center justify-center shadow-[3px_3px_0px_#000] mb-5">
								01
							</div>
							<h4 className="text-lg font-black uppercase text-black mb-2">
								Catch In Sequence
							</h4>
							<p className="text-xs font-bold text-gray-800 leading-relaxed mb-4">
								Parts rain down at speeds up to 60 FPS. Keep an eye on the <strong>NEXT</strong> item indicator in the HUD. Only click the required part to assemble your champion. Missing an item that falls off the screen has no penalty, but clicking the wrong part costs an 8-second time penalty!
							</p>
						</div>
						<div className="bg-[#FFFDF0] border-2 border-black p-3 text-[11px] font-black uppercase text-black">
							Rule: Right item = points & combo. Wrong item = -8s penalty.
						</div>
					</div>

					{/* Step 2 */}
					<div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000] flex flex-col justify-between">
						<div>
							<div className="w-12 h-12 bg-[#00F0FF] border-3 border-black font-black text-xl flex items-center justify-center shadow-[3px_3px_0px_#000] mb-5">
								02
							</div>
							<h4 className="text-lg font-black uppercase text-black mb-2">
								Chain Combos & Power-ups
							</h4>
							<p className="text-xs font-bold text-gray-800 leading-relaxed mb-4">
								Every correct piece caught in rhythm increases your <strong>Combo Multiplier</strong> (x2, x3, x5...). Grab Hot Cocoa mugs to add +8 seconds of time or recover lost lives, trigger Blizzard Freezes to slow time by 55%, and snag Golden Stars for bonus points!
							</p>
						</div>
						<div className="bg-[#FFFDF0] border-2 border-black p-3 text-[11px] font-black uppercase text-black">
							Caution: Avoid clicking Hazard Spikes! Clicking a spike costs 1 life.
						</div>
					</div>

					{/* Step 3 */}
					<div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000] flex flex-col justify-between">
						<div>
							<div className="w-12 h-12 bg-[#00FF66] border-3 border-black font-black text-xl flex items-center justify-center shadow-[3px_3px_0px_#000] mb-5">
								03
							</div>
							<h4 className="text-lg font-black uppercase text-black mb-2">
								Gasless On-Chain Record
							</h4>
							<p className="text-xs font-bold text-gray-800 leading-relaxed mb-4">
								When your session ends, the backend verifies your game duration and pacing salt before committing the score directly to the <strong>Soroban smart contract on Stellar</strong>. The backend relayer sponsors all network fees, so you never pay gas or approve wallet popups!
							</p>
						</div>
						<div className="bg-[#FFFDF0] border-2 border-black p-3 text-[11px] font-black uppercase text-black">
							Proof: Verified scores receive a public Stellar Expert transaction hash.
						</div>
					</div>
				</div>
			</section>

			{/* Section: The 4 Champions */}
			<section id="champions" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#FFE600]/20 border-b-4 border-black">
				<div className="max-w-6xl mx-auto">
					<div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
						<div>
							<div className="inline-block bg-[#FF007A] text-white border-3 border-black px-4 py-1.5 shadow-[3px_3px_0px_#000] mb-3">
								<h2 className="text-xs font-black uppercase tracking-wider">
									THE ROSTER
								</h2>
							</div>
							<h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
								SELECT YOUR CHAMPION
							</h3>
						</div>
						<p className="text-xs sm:text-sm font-bold text-gray-700 max-w-md uppercase">
							Each hero requires a distinct sequence of pieces and includes a special bonus part to maximize your final score.
						</p>
					</div>

					{/* Character Switcher Tabs */}
					<div className="flex flex-wrap gap-2.5 mb-8">
						{charList.map((char) => {
							const isSelected = activePreviewChar === char.id;
							return (
								<button
									key={char.id}
									type="button"
									onClick={() => setActivePreviewChar(char.id)}
									className={`px-4 py-2.5 font-black text-xs uppercase border-3 border-black cursor-pointer transition-all ${
										isSelected
											? "bg-black text-white shadow-[4px_4px_0px_#FFE600] -translate-y-0.5"
											: "bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_#000]"
									}`}
								>
									{char.name}
								</button>
							);
						})}
					</div>

					{/* Active Character Detail Card */}
					<div className="bg-[#FFFDF0] border-4 border-black p-6 sm:p-10 shadow-[8px_8px_0px_#000] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
						<div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-white border-3 border-black shadow-[4px_4px_0px_#000]">
							<div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center mb-4">
								<Item3D type={(currentChar.parts[0]?.id || "snowball") as ItemType} size={90} />
							</div>
							<h4 className="font-black text-xl uppercase text-black">
								{currentChar.name}
							</h4>
							<span
								className="text-[10px] font-black uppercase px-3 py-1 border-2 border-black mt-1"
								style={{ backgroundColor: currentChar.themeColor }}
							>
								{currentChar.title}
							</span>
							<p className="text-xs font-bold text-gray-700 text-center mt-3 leading-relaxed">
								{currentChar.description}
							</p>
						</div>

						<div className="lg:col-span-7 space-y-5">
							<h5 className="font-black text-sm uppercase tracking-wider text-black border-b-2 border-black pb-2">
								Required Assembly Pieces (In Exact Order):
							</h5>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{currentChar.parts.map((part, index) => (
									<div
										key={part.id}
										className={`p-3 border-2 border-black flex items-center gap-3 ${
											part.isBonus ? "bg-[#FFE600]" : "bg-white"
										} shadow-[2px_2px_0px_#000]`}
									>
										<div className="w-10 h-10 border border-black bg-white flex items-center justify-center shrink-0">
											<Item3D type={part.id as ItemType} size={28} />
										</div>
										<div>
											<div className="font-black text-xs uppercase text-black">
												{index + 1}. {part.name}
											</div>
											<div className="text-[10px] font-bold text-gray-600 uppercase">
												{part.isBonus ? "★ Bonus Scorer" : "Core Part"}
											</div>
										</div>
									</div>
								))}
							</div>

							<div className="pt-2">
								<button
									type="button"
									onClick={onPlay}
									className="w-full bg-[#00FF66] hover:bg-[#34ff86] text-black border-3 border-black py-3 font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
								>
									PLAY AS {currentChar.name.toUpperCase()} ▶
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Section: Power-ups & Hazards */}
			<section id="powerups" className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto border-b-4 border-black">
				<div className="text-center max-w-2xl mx-auto mb-14">
					<div className="inline-block bg-[#00FF66] border-3 border-black px-4 py-1.5 shadow-[3px_3px_0px_#000] mb-3">
						<h2 className="text-xs font-black uppercase tracking-wider text-black">
							TACTICAL ITEMS
						</h2>
					</div>
					<h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
						POWER-UPS & HAZARDS
					</h3>
					<p className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide mt-2">
						Master the items that fall between parts to maximize your high score
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{/* Hot Cocoa */}
					<div className="bg-white border-4 border-black p-5 shadow-[5px_5px_0px_#000] flex flex-col items-center text-center">
						<div className="w-16 h-16 bg-[#FFE600] border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] mb-4">
							<Item3D type="power_cocoa" size={42} />
						</div>
						<h4 className="font-black text-sm uppercase text-black mb-1">
							Hot Cocoa
						</h4>
						<span className="text-[10px] font-black uppercase text-green-700 bg-green-100 border border-black px-2 py-0.5 mb-2">
							+8s Boost / +1 Life
						</span>
						<p className="text-xs font-bold text-gray-700 leading-relaxed">
							Sip rich steaming cocoa to extend your session clock by 8 seconds or restore lost hearts.
						</p>
					</div>

					{/* Blizzard Freeze */}
					<div className="bg-white border-4 border-black p-5 shadow-[5px_5px_0px_#000] flex flex-col items-center text-center">
						<div className="w-16 h-16 bg-[#00F0FF] border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] mb-4">
							<Item3D type="power_blizzard" size={42} />
						</div>
						<h4 className="font-black text-sm uppercase text-black mb-1">
							Blizzard Freeze
						</h4>
						<span className="text-[10px] font-black uppercase text-cyan-800 bg-cyan-100 border border-black px-2 py-0.5 mb-2">
							55% Time Slow (6s)
						</span>
						<p className="text-xs font-bold text-gray-700 leading-relaxed">
							Unleashes an arctic freeze that dramatically slows down all falling items so you never miss a piece.
						</p>
					</div>

					{/* Golden Star */}
					<div className="bg-white border-4 border-black p-5 shadow-[5px_5px_0px_#000] flex flex-col items-center text-center">
						<div className="w-16 h-16 bg-[#FFE600] border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] mb-4">
							<Item3D type="power_star" size={42} />
						</div>
						<h4 className="font-black text-sm uppercase text-black mb-1">
							Golden Star
						</h4>
						<span className="text-[10px] font-black uppercase text-yellow-800 bg-yellow-100 border border-black px-2 py-0.5 mb-2">
							+3 Pts & Combo Surge
						</span>
						<p className="text-xs font-bold text-gray-700 leading-relaxed">
							Awards instant bonus points and extends your active combo window, boosting score multiplier.
						</p>
					</div>

					{/* Spike Hazard */}
					<div className="bg-white border-4 border-black p-5 shadow-[5px_5px_0px_#000] flex flex-col items-center text-center">
						<div className="w-16 h-16 bg-[#FF007A] border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] mb-4">
							<Item3D type="hazard_spike" size={40} />
						</div>
						<h4 className="font-black text-sm uppercase text-black mb-1">
							Spike Hazard
						</h4>
						<span className="text-[10px] font-black uppercase text-red-700 bg-red-100 border border-black px-2 py-0.5 mb-2">
							-1 Life Penalty
						</span>
						<p className="text-xs font-bold text-gray-700 leading-relaxed">
							Danger! Avoid clicking these icy spikes at all costs. Clicking costs a life and breaks your combo streak.
						</p>
					</div>
				</div>
			</section>

			{/* Section: Blockchain & Architecture */}
			<section id="blockchain" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#00F0FF]/15 border-b-4 border-black">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
						<div className="lg:col-span-7 space-y-5">
							<div className="inline-block bg-[#00F0FF] border-3 border-black px-4 py-1.5 shadow-[3px_3px_0px_#000]">
								<h2 className="text-xs font-black uppercase tracking-wider text-black">
									UNDER THE HOOD
								</h2>
							</div>

							<h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
								POWERED BY STELLAR & SOROBAN
							</h3>

							<p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
								SnowMotion combines the best of Web2 arcade responsiveness with Web3 cryptographic transparency. Smart contracts on Stellar handle immutable high score tracking and ranking, while our anti-cheat backend verifies gameplay physics before relaying transactions.
							</p>

							<div className="space-y-3 pt-2">
								<div className="p-3.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000]">
									<div className="font-black text-xs uppercase text-black">
										⚡ Gasless Relayer Model
									</div>
									<div className="text-[11px] font-bold text-gray-700 mt-0.5">
										Players do not need to sign transactions or hold XLM. The backend relayer sponsors network fees on behalf of all players.
									</div>
								</div>

								<div className="p-3.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000]">
									<div className="font-black text-xs uppercase text-black">
										🛡️ Server-Side Session Salt Attestation
									</div>
									<div className="text-[11px] font-bold text-gray-700 mt-0.5">
										Every session generates a unique 32-byte cryptographic salt. Scores must mathematically adhere to physical assembly time bounds.
									</div>
								</div>

								<div className="p-3.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000]">
									<div className="font-black text-xs uppercase text-black">
										🔗 Verified Stellar Smart Contract
									</div>
									<div className="text-[11px] font-bold text-gray-700 mt-0.5 font-mono break-all">
										Contract ID: CCDANXNV2JNHTVJLTUMAPM77KQHNIYON7TKDXH3J7YYWLTH6NPRHSBK7
									</div>
								</div>
							</div>
						</div>

						{/* Right Callout Box */}
						<div className="lg:col-span-5 bg-[#FFE600] border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_#000]">
							<h4 className="font-black text-xl uppercase text-black mb-3">
								READY TO COMPETE?
							</h4>
							<p className="text-xs font-bold text-gray-900 leading-relaxed mb-6">
								Play instantly as a guest, or connect Freighter, Albedo, xBull, or LOBSTR to link your public wallet address to the leaderboard.
							</p>

							<div className="space-y-3">
								<button
									type="button"
									onClick={onPlay}
									className="w-full bg-[#00FF66] hover:bg-[#34ff86] text-black border-3 border-black py-3.5 font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
								>
									LAUNCH GAME NOW ▶
								</button>

								<button
									type="button"
									onClick={() => setShowLeaderboard(true)}
									className="w-full bg-white hover:bg-gray-100 text-black border-3 border-black py-3.5 font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
								>
									VIEW ON-CHAIN LEADERBOARD
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-12 px-4 sm:px-8 bg-[#FFFDF0] border-t-4 border-black">
				<div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
					<div>
						<div className="font-black text-lg uppercase tracking-tight text-black flex items-center justify-center sm:justify-start gap-1.5 mb-1">
							<span>❄️</span> SNOWMOTION
						</div>
						<p className="text-xs font-bold text-gray-700 uppercase">
							Open-source Web3 arcade built for the Stellar community.
						</p>
					</div>

					<div className="flex flex-wrap items-center justify-center gap-4 text-xs font-black uppercase">
						<a
							href="https://stellar.expert/explorer/testnet/contract/CCDANXNV2JNHTVJLTUMAPM77KQHNIYON7TKDXH3J7YYWLTH6NPRHSBK7"
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:text-[#FF007A]"
						>
							Stellar Expert ↗
						</a>
						<a
							href="https://github.com/Kaycee276/snowmotion"
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:text-[#FF007A]"
						>
							GitHub ↗
						</a>
						<a
							href="https://github.com/Kaycee276/snowmotion/blob/master/LICENSE"
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:text-[#FF007A]"
						>
							MIT License
						</a>
						<button
							type="button"
							onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
							className="underline hover:text-[#FF007A] cursor-pointer"
						>
							Back to Top ↑
						</button>
					</div>
				</div>
			</footer>

			{/* Leaderboard Modal */}
			<Leaderboard
				isOpen={showLeaderboard}
				onClose={() => setShowLeaderboard(false)}
			/>

			{/* Wallet Modal */}
			<StellarWalletModal
				isOpen={isWalletModalOpen}
				onClose={closeWalletModal}
				onConnected={(addr, name) => {
					setConnectedAddress(addr);
					setConnectedWalletName(name);
					closeWalletModal();
				}}
			/>
		</div>
	);
};

export default LandingPage;
