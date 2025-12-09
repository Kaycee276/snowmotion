import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { somniaMainnet } from "../utils/somniaMainnet";
import type { AppKitNetwork } from "@reown/appkit/networks";
import type { ReactNode } from "react";

const queryClient = new QueryClient();

const projectId = import.meta.env.VITE_PROJECT_ID;

const metadata = {
	name: "Snow motion",
	description: "Build snowmen on the blockchain",
	url: "https://example.com",
	icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
	somniaMainnet as AppKitNetwork,
];

const wagmiAdapter = new WagmiAdapter({
	networks,
	projectId,
	// ssr: true,
});

createAppKit({
	adapters: [wagmiAdapter],
	networks,
	projectId,
	metadata,
	features: {
		analytics: true,
	},
});

export function AppKitProvider({ children }: { children: ReactNode }) {
	return (
		<WagmiProvider config={wagmiAdapter.wagmiConfig}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	);
}
