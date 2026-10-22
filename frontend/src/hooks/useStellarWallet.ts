import { useState, useCallback } from "react";
import { useGameStore } from "../store/gameStore";
import { gameApi } from "../services/gameApi";

const STORAGE_KEY_ADDR = "snowmotion_stellar_address";
const STORAGE_KEY_WALLET = "snowmotion_stellar_wallet";

export const useStellarWallet = () => {
	const {
		connectedAddress,
		connectedWalletName,
		isWalletModalOpen,
		openWalletModal,
		closeWalletModal,
		setConnectedAddress,
		setConnectedWalletName,
	} = useGameStore();

	const [address, setAddress] = useState<string | null>(() => {
		try {
			return typeof window !== "undefined"
				? localStorage.getItem(STORAGE_KEY_ADDR)
				: null;
		} catch {
			return null;
		}
	});

	const [walletName, setWalletName] = useState<string | null>(() => {
		try {
			return typeof window !== "undefined"
				? localStorage.getItem(STORAGE_KEY_WALLET)
				: null;
		} catch {
			return null;
		}
	});

	const handleConnected = useCallback(
		(newAddress: string, newWalletName: string) => {
			setAddress(newAddress);
			setWalletName(newWalletName);
			setConnectedAddress(newAddress);
			setConnectedWalletName(newWalletName);
		},
		[setConnectedAddress, setConnectedWalletName]
	);

	const disconnect = useCallback(() => {
		setAddress(null);
		setWalletName(null);
		setConnectedAddress(null);
		setConnectedWalletName(null);
	}, [setConnectedAddress, setConnectedWalletName]);

	const currentAddress = connectedAddress || address;

	const submitScore = useCallback(
		async (score: number, difficulty: number, gameHash: string): Promise<string> => {
			if (!currentAddress) {
				throw new Error("Stellar wallet not connected");
			}

			const result = await gameApi.submitScore({
				player: currentAddress,
				score,
				difficulty,
				gameHash,
			});

			return result.txHash;
		},
		[currentAddress]
	);

	return {
		address: currentAddress,
		isConnected: Boolean(currentAddress),
		walletName: connectedWalletName || walletName,
		isModalOpen: isWalletModalOpen,
		openModal: openWalletModal,
		closeModal: closeWalletModal,
		connect: openWalletModal,
		disconnect,
		handleConnected,
		submitScore,
	};
};
