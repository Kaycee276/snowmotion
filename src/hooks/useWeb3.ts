import { useState, useEffect, useCallback } from "react";
import type { Address } from "viem";
// import { createWalletClient, custom } from 'viem';
// import { sepolia } from 'viem/chains';

// Use Sepolia testnet - uncomment when implementing contract
// const SEPOLIA_CHAIN = sepolia;

interface Web3State {
	address: Address | null;
	isConnected: boolean;
	isConnecting: boolean;
	chainId: number | null;
	error: string | null;
}

export const useWeb3 = () => {
	const [state, setState] = useState<Web3State>({
		address: null,
		isConnected: false,
		isConnecting: false,
		chainId: null,
		error: null,
	});

	// Check if wallet is already connected
	useEffect(() => {
		const checkConnection = async () => {
			if (typeof window.ethereum !== "undefined") {
				try {
					const accounts = (await window.ethereum.request({
						method: "eth_accounts",
					})) as string[];
					if (accounts && accounts.length > 0) {
						const chainId = (await window.ethereum.request({
							method: "eth_chainId",
						})) as string;
						setState({
							address: accounts[0] as Address,
							isConnected: true,
							isConnecting: false,
							chainId: parseInt(chainId, 16),
							error: null,
						});
					}
				} catch (error) {
					console.error("Error checking wallet connection:", error);
				}
			}
		};

		checkConnection();
	}, []);

	const connect = useCallback(async () => {
		if (typeof window.ethereum === "undefined") {
			setState((prev) => ({
				...prev,
				error: "Please install MetaMask or another Ethereum wallet",
			}));
			return;
		}

		setState((prev) => ({ ...prev, isConnecting: true, error: null }));

		try {
			const accounts = (await window.ethereum.request({
				method: "eth_requestAccounts",
			})) as string[];

			const chainId = (await window.ethereum.request({
				method: "eth_chainId",
			})) as string;

			if (accounts && accounts.length > 0) {
				setState({
					address: accounts[0] as Address,
					isConnected: true,
					isConnecting: false,
					chainId: parseInt(chainId, 16),
					error: null,
				});
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to connect wallet";
			setState((prev) => ({
				...prev,
				isConnecting: false,
				error: errorMessage,
			}));
		}
	}, []);

	const disconnect = useCallback(() => {
		setState({
			address: null,
			isConnected: false,
			isConnecting: false,
			chainId: null,
			error: null,
		});
	}, []);

	const submitScore = useCallback(
		async (score: number): Promise<string | null> => {
			if (!state.address || !state.isConnected) {
				throw new Error("Wallet not connected");
			}

			if (typeof window.ethereum === "undefined") {
				throw new Error("Wallet not available");
			}

			try {
				// TODO: Implement actual smart contract interaction
				// For now, this is a placeholder that simulates a transaction
				// The score parameter will be used when implementing the real contract

				// TODO: Implement actual smart contract interaction
				// In a real implementation, you would:
				// 1. Get the wallet client
				// 2. Prepare the transaction to your smart contract
				// 3. Send the transaction with the score

				// Example implementation:
				// const walletClient = createWalletClient({
				//   chain: SEPOLIA_CHAIN,
				//   transport: custom(window.ethereum),
				// });
				// const hash = await walletClient.writeContract({
				//   address: 'YOUR_CONTRACT_ADDRESS',
				//   abi: YOUR_CONTRACT_ABI,
				//   functionName: 'submitScore',
				//   args: [score],
				//   account: state.address,
				// });
				// return hash;

				// Simulate transaction for demo (remove this when implementing real contract)
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				void score; // Mark score as intentionally unused for now
				await new Promise((resolve) => setTimeout(resolve, 1500));
				const mockHash = `0x${Math.random().toString(16).slice(2, 66)}`;

				return mockHash;
			} catch (error) {
				console.error("Error submitting score:", error);
				if (error instanceof Error) {
					throw error;
				}
				throw new Error("Unknown error occurred while submitting score");
			}
		},
		[state.address, state.isConnected]
	);

	return {
		...state,
		connect,
		disconnect,
		submitScore,
	};
};

// Extend Window interface for TypeScript
declare global {
	interface Window {
		ethereum?: {
			request: (args: {
				method: string;
				params?: unknown[];
			}) => Promise<unknown>;
			on: (event: string, handler: (...args: unknown[]) => void) => void;
			removeListener: (
				event: string,
				handler: (...args: unknown[]) => void
			) => void;
		};
	}
}
