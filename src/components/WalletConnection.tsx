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
			<div className="flex items-center gap-3">
				<div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
					✓ {formatAddress(address)}
				</div>
				<button
					onClick={disconnect}
					className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
				>
					Disconnect
				</button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<button
				onClick={connect}
				disabled={isConnecting}
				className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isConnecting ? "Connecting..." : "Connect Wallet"}
			</button>
			{error && <div className="text-red-600 text-xs max-w-xs">{error}</div>}
		</div>
	);
};

export default WalletConnection;
