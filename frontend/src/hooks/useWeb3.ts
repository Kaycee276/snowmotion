import { useCallback } from "react";
import {
	useAppKit,
	useAppKitAccount,
	useAppKitNetwork,
} from "@reown/appkit/react";
import type { Address } from "viem";

export const useWeb3 = () => {
	const { open } = useAppKit();
	const { address, isConnected } = useAppKitAccount();
	const { chainId } = useAppKitNetwork();

	const connect = useCallback(async () => {
		open();
	}, [open]);

	const disconnect = useCallback(() => {
		open({ view: "Account" });
	}, [open]);

	const submitScore = useCallback(
		async (score: number, difficulty: number, gameHash: string): Promise<string> => {
			if (!address || !isConnected) {
				throw new Error("Wallet not connected");
			}

			try {
				const { gameApi } = await import('../services/gameApi');
				const result = await gameApi.submitScore({
					player: address,
					score,
					difficulty,
					gameHash
				});
				return result.txHash;
			} catch (error) {
				console.error("Error submitting score:", error);
				throw error instanceof Error
					? error
					: new Error("Unknown error occurred");
			}
		},
		[address, isConnected]
	);

	return {
		address: address as Address | null,
		isConnected,
		isConnecting: false,
		chainId: chainId || null,
		error: null,
		connect,
		disconnect,
		submitScore,
	};
};
