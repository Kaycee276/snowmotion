import { useStellarWallet } from "./useStellarWallet";
import type { Address } from "viem";

export const useWeb3 = () => {
	const stellar = useStellarWallet();

	return {
		address: stellar.address as Address | null,
		isConnected: stellar.isConnected,
		isConnecting: false,
		chainId: 148,
		error: null,
		walletName: stellar.walletName,
		connect: stellar.openModal,
		disconnect: stellar.disconnect,
		submitScore: stellar.submitScore,
		isModalOpen: stellar.isModalOpen,
		openModal: stellar.openModal,
		closeModal: stellar.closeModal,
		handleConnected: stellar.handleConnected,
	};
};
