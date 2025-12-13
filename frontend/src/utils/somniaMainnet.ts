import { defineChain } from "@reown/appkit/networks";

export const somniaMainnet = defineChain({
	id: 5031,
	name: "Somnia Mainnet",
	nativeCurrency: {
		decimals: 18,
		name: "Somnia",
		symbol: "SOMI",
	},
	rpcUrls: {
		default: {
			http: ["https://api.infra.mainnet.somnia.network"],
		},
	},
	caipNetworkId: "eip155:5031",
	chainNamespace: "eip155",
	blockExplorers: {
		default: {
			name: "Somnia Explorer",
			url: "https://explorer.somnia.network",
		},
	},
});
