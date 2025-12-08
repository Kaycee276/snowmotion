import { useWeb3 } from "../hooks/useWeb3";

const WalletConnection = () => {
	const { address, isConnected, isConnecting, error, connect, disconnect } =
		useWeb3();

	const formatAddress = (addr: string | null) => {
		if (!addr) return "";
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	};

	if (isConnected && address) {
		return (
			<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
				<div className="bg-green-100 text-green-700 px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium break-all sm:break-normal">
					✓ {formatAddress(address)}
				</div>
				<button
					onClick={disconnect}
					className="bg-gray-200 text-gray-700 px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-300 transition-colors whitespace-nowrap"
				>
					Disconnect
				</button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-1 sm:gap-2 w-full sm:w-auto">
			<button
				onClick={connect}
				disabled={isConnecting}
				className="bg-blue-600 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
			>
				{isConnecting ? "Connecting..." : "Connect Wallet"}
			</button>
			{error && (
				<div className="text-red-600 text-xs max-w-full sm:max-w-xs wrap-break-word">
					{error}
				</div>
			)}
		</div>
	);
};

export default WalletConnection;
