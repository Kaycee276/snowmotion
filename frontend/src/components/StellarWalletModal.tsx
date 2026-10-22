import React, { useState, useEffect } from "react";
import {
	detectExtensions,
	connectFreighter,
	connectAlbedo,
	MOBILE_STELLAR_WALLETS,
} from "../utils/stellarWallets";

interface StellarWalletModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConnected: (address: string, walletName: string) => void;
}

export const StellarWalletModal: React.FC<StellarWalletModalProps> = ({
	isOpen,
	onClose,
	onConnected,
}) => {
	const [extensions, setExtensions] = useState({
		freighter: false,
		xbull: false,
		rabet: false,
	});
	const [activeTab, setActiveTab] = useState<"extension" | "albedo" | "mobile">("extension");
	const [isConnecting, setIsConnecting] = useState(false);
	const [manualAddress, setManualAddress] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (isOpen) {
			setError(null);
			detectExtensions().then(setExtensions);
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const handleFreighter = async () => {
		if (!extensions.freighter) {
			window.open("https://www.freighter.app/", "_blank");
			return;
		}
		setIsConnecting(true);
		setError(null);
		try {
			const address = await connectFreighter();
			onConnected(address, "Freighter");
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to connect to Freighter");
		} finally {
			setIsConnecting(false);
		}
	};

	const handleAlbedo = async () => {
		setIsConnecting(true);
		setError(null);
		try {
			const address = await connectAlbedo();
			onConnected(address, "Albedo");
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to connect to Albedo");
		} finally {
			setIsConnecting(false);
		}
	};

	const handleManualSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const clean = manualAddress.trim();
		if (!clean) return;

		if (!/^G[A-Z2-7]{55}$/.test(clean) && !/^0x[a-fA-F0-9]{40}$/.test(clean)) {
			setError("Please enter a valid Stellar Public Key (starts with G, 56 characters)");
			return;
		}

		onConnected(clean, "Stellar Account");
		onClose();
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-xs z-60 p-4 sm:p-6 overflow-y-auto">
			<div className="bg-[#FFFDF0] border-4 border-black p-6 sm:p-8 w-full max-w-lg shadow-[8px_8px_0px_#000] relative max-h-[92vh] overflow-y-auto">
				{/* Header */}
				<div className="flex items-center justify-between pb-4 border-b-3 border-black mb-5">
					<div>
						<h2 className="text-xl sm:text-2xl font-black uppercase text-black">
							STELLAR WALLETS
						</h2>
						<p className="text-xs font-bold text-gray-700 mt-0.5">
							Connect your Stellar wallet to submit on-chain scores
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="bg-black text-white hover:bg-red-600 border-2 border-black w-9 h-9 font-black text-lg flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
					>
						✕
					</button>
				</div>

				{/* Error display */}
				{error && (
					<div className="mb-5 p-3 bg-red-100 border-2 border-black text-red-800 text-xs font-black uppercase">
						{error}
					</div>
				)}

				{/* Tab selector */}
				<div className="flex gap-2 mb-5 p-1 bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
					<button
						type="button"
						onClick={() => setActiveTab("extension")}
						className={`flex-1 py-2 px-3 font-black text-xs uppercase cursor-pointer transition-all ${
							activeTab === "extension"
								? "bg-[#FFE600] border-2 border-black shadow-[2px_2px_0px_#000] text-black"
								: "text-gray-700 hover:text-black"
						}`}
					>
						EXTENSIONS
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("albedo")}
						className={`flex-1 py-2 px-3 font-black text-xs uppercase cursor-pointer transition-all ${
							activeTab === "albedo"
								? "bg-[#00FF66] border-2 border-black shadow-[2px_2px_0px_#000] text-black"
								: "text-gray-700 hover:text-black"
						}`}
					>
						WEB SIGNER
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("mobile")}
						className={`flex-1 py-2 px-3 font-black text-xs uppercase cursor-pointer transition-all ${
							activeTab === "mobile"
								? "bg-[#00F0FF] border-2 border-black shadow-[2px_2px_0px_#000] text-black"
								: "text-gray-700 hover:text-black"
						}`}
					>
						MOBILE
					</button>
				</div>

				{/* Tab 1: Browser Extensions */}
				{activeTab === "extension" && (
					<div className="space-y-4">
						{/* Freighter */}
						<div className="p-4 bg-white border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								<div className="w-11 h-11 bg-[#FF007A] text-white border-2 border-black flex items-center justify-center font-black text-sm uppercase shadow-[2px_2px_0px_#000]">
									F
								</div>
								<div>
									<div className="font-black text-sm text-black uppercase flex items-center gap-2">
										<span>Freighter</span>
										{extensions.freighter ? (
											<span className="bg-[#00FF66] text-black text-[9px] font-black px-1.5 py-0.5 border border-black uppercase">
												INSTALLED
											</span>
										) : (
											<span className="bg-gray-200 text-gray-700 text-[9px] font-bold px-1.5 py-0.5 border border-black uppercase">
												NOT DETECTED
											</span>
										)}
									</div>
									<div className="text-[11px] font-bold text-gray-600">
										Official Stellar browser extension
									</div>
								</div>
							</div>

							<button
								type="button"
								onClick={handleFreighter}
								disabled={isConnecting}
								className={`px-4 py-2 font-black text-xs uppercase border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ${
									extensions.freighter
										? "bg-[#00FF66] hover:bg-[#46ff92] text-black"
										: "bg-[#FFE600] hover:bg-[#fff04d] text-black"
								}`}
							>
								{isConnecting
									? "CONNECTING..."
									: extensions.freighter
									? "CONNECT"
									: "INSTALL ↗"}
							</button>
						</div>

						{/* xBull */}
						<div className="p-4 bg-white border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								<div className="w-11 h-11 bg-[#00E5FF] text-black border-2 border-black flex items-center justify-center font-black text-sm uppercase shadow-[2px_2px_0px_#000]">
									X
								</div>
								<div>
									<div className="font-black text-sm text-black uppercase flex items-center gap-2">
										<span>xBull Wallet</span>
										{extensions.xbull ? (
											<span className="bg-[#00FF66] text-black text-[9px] font-black px-1.5 py-0.5 border border-black uppercase">
												INSTALLED
											</span>
										) : (
											<span className="bg-gray-200 text-gray-700 text-[9px] font-bold px-1.5 py-0.5 border border-black uppercase">
												EXTENSION
											</span>
										)}
									</div>
									<div className="text-[11px] font-bold text-gray-600">
										Open-source Stellar browser extension
									</div>
								</div>
							</div>

							<a
								href="https://xbull.app"
								target="_blank"
								rel="noopener noreferrer"
								className="px-4 py-2 font-black text-xs uppercase border-2 border-black bg-white hover:bg-gray-100 text-black shadow-[2px_2px_0px_#000]"
							>
								GET XBULL ↗
							</a>
						</div>
					</div>
				)}

				{/* Tab 2: Albedo Instant Web Signer */}
				{activeTab === "albedo" && (
					<div className="p-6 bg-white border-3 border-black shadow-[4px_4px_0px_#000] text-center">
						<div className="w-14 h-14 mx-auto mb-3 bg-[#00FF66] border-3 border-black flex items-center justify-center font-black text-lg uppercase shadow-[3px_3px_0px_#000]">
							WEB
						</div>
						<h3 className="text-base font-black uppercase text-black mb-2">
							Albedo Web Signer
						</h3>
						<p className="text-xs font-bold text-gray-700 mb-5 leading-relaxed">
							No browser extensions or apps required! Connect securely through an Albedo popup window. Works on mobile, tablet, and desktop.
						</p>

						<button
							type="button"
							onClick={handleAlbedo}
							disabled={isConnecting}
							className="w-full bg-[#00FF66] hover:bg-[#4dff97] text-black border-3 border-black py-3 font-black text-sm uppercase shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer transition-all"
						>
							{isConnecting ? "CONNECTING..." : "CONNECT WITH ALBEDO"}
						</button>
					</div>
				)}

				{/* Tab 3: Mobile Wallets List */}
				{activeTab === "mobile" && (
					<div className="space-y-3">
						<div className="text-xs font-bold text-gray-800 bg-yellow-100 border-2 border-black p-3 shadow-[2px_2px_0px_#000]">
							On mobile devices, open this game inside your wallet&apos;s built-in browser, or use <strong>Albedo</strong> for instant 1-click web sign-in.
						</div>

						{MOBILE_STELLAR_WALLETS.map((w) => (
							<div
								key={w.id}
								className="p-4 bg-white border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between gap-3"
							>
								<div>
									<div className="font-black text-xs sm:text-sm text-black uppercase flex items-center gap-2">
										<span>{w.name}</span>
										<span className="bg-[#00F0FF] text-black text-[9px] font-black px-1.5 py-0.5 border border-black uppercase">
											{w.badge}
										</span>
									</div>
									<div className="text-[11px] font-bold text-gray-600 mt-0.5">
										{w.description}
									</div>
								</div>

								<div className="flex gap-1.5 shrink-0">
									{w.iosUrl && (
										<a
											href={w.iosUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="bg-black text-white hover:bg-gray-800 text-[10px] font-black px-2.5 py-1.5 border border-black shadow-[1px_1px_0px_#000] uppercase"
										>
											iOS
										</a>
									)}
									{w.androidUrl && (
										<a
											href={w.androidUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="bg-black text-white hover:bg-gray-800 text-[10px] font-black px-2.5 py-1.5 border border-black shadow-[1px_1px_0px_#000] uppercase"
										>
											Android
										</a>
									)}
								</div>
							</div>
						))}
					</div>
				)}

				{/* Manual Public Key Entry */}
				<div className="mt-6 pt-5 border-t-3 border-black">
					<form onSubmit={handleManualSubmit}>
						<label className="block text-xs font-black uppercase text-black mb-2 tracking-wider">
							Or Enter Stellar Public Key (G...)
						</label>
						<div className="flex gap-2">
							<input
								type="text"
								value={manualAddress}
								onChange={(e) => setManualAddress(e.target.value)}
								placeholder="G..."
								className="flex-1 bg-white border-3 border-black p-2.5 text-xs font-mono font-bold text-black outline-none shadow-[2px_2px_0px_#000]"
							/>
							<button
								type="submit"
								className="bg-[#FFE600] hover:bg-[#fff04d] text-black border-3 border-black px-4 py-2.5 font-black text-xs uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
							>
								USE KEY
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default StellarWalletModal;
