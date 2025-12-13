import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

export const WalletConnection = () => {
	const { open } = useAppKit();
	const { address, isConnected } = useAppKitAccount();

	return (
		<div className="flex items-center gap-1 sm:gap-2">
			{isConnected ? (
				<div className="flex items-center gap-1 text-xs sm:text-sm">
					<div className="w-2 h-2 bg-green-500 rounded-full" />
					<span className="hidden sm:inline">
						{address?.slice(0, 6)}...{address?.slice(-4)}
					</span>
				</div>
			) : null}
			<button
				onClick={() => open({ view: isConnected ? "Account" : "Connect" })}
				className="px-2 sm:px-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
			>
				{isConnected ? "View Wallet" : "Connect Wallet"}
			</button>
		</div>
	);
};

export default WalletConnection;
