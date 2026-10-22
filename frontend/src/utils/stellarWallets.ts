// Stellar Wallets Detection & Connection Engine
import { isConnected as isFreighterAvailable, requestAccess as requestFreighterAccess, getAddress as getFreighterAddress } from "@stellar/freighter-api";

export interface StellarWalletOption {
	id: string;
	name: string;
	icon: string;
	description: string;
	isInstalled?: boolean;
	downloadUrl: string;
	type: "extension" | "web" | "mobile";
}

export interface MobileStellarWallet {
	id: string;
	name: string;
	icon: string;
	badge: string;
	description: string;
	url: string;
	iosUrl?: string;
	androidUrl?: string;
}

export const MOBILE_STELLAR_WALLETS: MobileStellarWallet[] = [
	{
		id: "lobstr",
		name: "LOBSTR Wallet",
		icon: "🦞",
		badge: "Most Popular",
		description: "Leading mobile wallet for Stellar Lumens (XLM) & Stellar assets.",
		url: "https://lobstr.co",
		iosUrl: "https://apps.apple.com/app/lobstr-stellar-lumens-wallet/id1404357892",
		androidUrl: "https://play.google.com/store/apps/details?id=com.lobstr.client",
	},
	{
		id: "freighter-mobile",
		name: "Freighter Mobile",
		icon: "🚀",
		badge: "Official SDF",
		description: "Official self-custody wallet created by the Stellar Development Foundation.",
		url: "https://www.freighter.app",
		iosUrl: "https://apps.apple.com/app/freighter-wallet/id6475765715",
		androidUrl: "https://play.google.com/store/apps/details?id=app.freighter.mobile",
	},
	{
		id: "albedo",
		name: "Albedo Web Signer",
		icon: "⚡",
		badge: "Instant / No App",
		description: "Zero install needed! Works on any mobile or desktop browser via secure popup.",
		url: "https://albedo.link",
	},
	{
		id: "xbull",
		name: "xBull Wallet",
		icon: "🐂",
		badge: "Open Source",
		description: "Multi-platform open-source Stellar wallet for power users.",
		url: "https://xbull.app",
		iosUrl: "https://apps.apple.com/app/xbull-wallet/id1605315570",
		androidUrl: "https://play.google.com/store/apps/details?id=com.xbull.app",
	},
];

/**
 * Check browser extensions
 */
export async function detectExtensions(): Promise<{
	freighter: boolean;
	xbull: boolean;
	rabet: boolean;
}> {
	let freighter = false;
	try {
		const res = await isFreighterAvailable();
		freighter = Boolean(typeof res === "boolean" ? res : res?.isConnected);
	} catch {
		freighter = typeof window !== "undefined" && Boolean((window as unknown as { freighter?: unknown }).freighter);
	}

	const xbull =
		typeof window !== "undefined" &&
		Boolean(
			(window as unknown as { xBullSDK?: unknown; xbull?: unknown }).xBullSDK ||
			(window as unknown as { xBullSDK?: unknown; xbull?: unknown }).xbull
		);

	const rabet =
		typeof window !== "undefined" &&
		Boolean((window as unknown as { rabet?: unknown }).rabet);

	return { freighter, xbull, rabet };
}

/**
 * Connect to Freighter Extension
 */
export async function connectFreighter(): Promise<string> {
	try {
		const access = await requestFreighterAccess();
		if (access && typeof access === "object" && access.address) {
			return access.address;
		}

		const addr = await getFreighterAddress();
		if (addr && typeof addr === "object" && addr.address) {
			return addr.address;
		}
		if (typeof addr === "string" && addr) {
			return addr;
		}

		throw new Error("Unable to retrieve public key from Freighter");
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		throw new Error(`Freighter error: ${msg}. Make sure Freighter extension is unlocked.`);
	}
}

/**
 * Connect to Albedo Web Wallet (works on desktop & mobile without any extension!)
 */
export function connectAlbedo(): Promise<string> {
	return new Promise((resolve, reject) => {
		if (typeof window === "undefined") {
			return reject(new Error("Window not available"));
		}

		const width = 450;
		const height = 650;
		const left = (window.innerWidth - width) / 2 + (window.screenLeft || 0);
		const top = (window.innerHeight - height) / 2 + (window.screenTop || 0);

		const token = Math.random().toString(36).substring(2, 15);
		const albedoUrl = `https://albedo.link/confirm?intent=public_key&token=${token}`;

		const popup = window.open(
			albedoUrl,
			"albedo_auth",
			`width=${width},height=${height},top=${top},left=${left},status=0,menubar=0,toolbar=0,personalbar=0`
		);

		if (!popup) {
			return reject(new Error("Popup blocked! Please allow popups to connect with Albedo."));
		}

		const messageHandler = (event: MessageEvent) => {
			if (event.origin !== "https://albedo.link") return;
			try {
				const data = event.data;
				if (data && data.intent === "public_key" && data.pubkey) {
					window.removeEventListener("message", messageHandler);
					resolve(data.pubkey);
				} else if (data && data.error) {
					window.removeEventListener("message", messageHandler);
					reject(new Error(data.message || data.error));
				}
			} catch {
				// ignore parse errors
			}
		};

		window.addEventListener("message", messageHandler);

		// Timeout check if popup was closed
		const checkClosed = setInterval(() => {
			if (popup.closed) {
				clearInterval(checkClosed);
				window.removeEventListener("message", messageHandler);
			}
		}, 1000);
	});
}
