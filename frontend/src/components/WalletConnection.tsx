import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

export const WalletConnection = () => {
	const { open } = useAppKit();
	const { address, isConnected } = useAppKitAccount();

	return (
		<div className="flex items-center gap-1 sm:gap-2">
			{isConnected ? (
				<div className="flex items-center gap-1 text-xs sm:text-sm">
					<div className="w-2.5 h-2.5 bg-green-500 border border-black" />
					<span className="hidden sm:inline font-mono font-bold">
						{address?.slice(0, 6)}...{address?.slice(-4)}
					</span>
				</div>
			) : null}
			<button
				onClick={() => open({ view: isConnected ? "Account" : "Connect" })}
				className="px-3 py-2 bg-[#FFE600] text-black border-2 border-black font-black uppercase text-xs sm:text-sm shadow-[2px_2px_0px_#000]"
			>
				{isConnected ? "View Wallet" : "Connect Wallet"}
			</button>
		</div>
	);
};

export default WalletConnection;
