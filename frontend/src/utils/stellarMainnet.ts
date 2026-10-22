import { defineChain } from "@reown/appkit/networks";

export const stellarMainnet = defineChain({
	id: 148,
	name: "Stellar Mainnet",
	nativeCurrency: {
		decimals: 7,
		name: "Lumen",
		symbol: "XLM",
	},
	rpcUrls: {
		default: {
			http: ["https://mainnet.sorobanrpc.com"],
		},
	},
	caipNetworkId: "eip155:148",
	chainNamespace: "eip155",
	blockExplorers: {
		default: {
			name: "Stellar Expert",
			url: "https://stellar.expert/explorer/public",
		},
	},
});
