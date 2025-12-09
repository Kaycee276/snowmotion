import {
	useAppKit,
	useAppKitAccount,
	useAppKitNetwork,
} from "@reown/appkit/react";

export const WalletConnection = () => {
	const { open } = useAppKit();
	const { address, isConnected } = useAppKitAccount();
	const { chainId } = useAppKitNetwork();

	return (
		<div className="flex items-center gap-4">
			{isConnected ? (
				<div className="flex items-center gap-2 text-sm">
					<div className="w-2 h-2 bg-green-500 rounded-full" />
					<span>
						{address?.slice(0, 6)}...{address?.slice(-4)}
					</span>
					<span className="text-gray-500">Chain: {chainId}</span>
				</div>
			) : null}
			<button
				onClick={() => open({ view: isConnected ? "Account" : "Connect" })}
				className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
			>
				{isConnected ? "Wallet" : "Connect Wallet"}
			</button>
		</div>
	);
};

export default WalletConnection;
