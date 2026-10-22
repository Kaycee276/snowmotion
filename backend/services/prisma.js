const { PrismaClient } = require("@prisma/client");
const { PrismaLibSql } = require("@prisma/adapter-libsql");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

let prisma;

function getPrismaClient() {
	const rawUrl = process.env.DATABASE_URL || "file:./dev.db";
	const rawToken = process.env.TURSO_AUTH_TOKEN;

	let url = rawUrl;
	let authToken = rawToken;

	// Extract authToken from URL query parameter if present
	if (rawUrl.includes("authToken=")) {
		try {
			const parsed = new URL(rawUrl);
			authToken = parsed.searchParams.get("authToken") || rawToken;
		} catch {
			// keep as is
		}
	}

	const config = { url };
	if (authToken) {
		config.authToken = authToken;
	}

	const adapter = new PrismaLibSql(config);
	return new PrismaClient({ adapter });
}

if (process.env.NODE_ENV === "production") {
	prisma = getPrismaClient();
} else {
	if (!global.__db) {
		global.__db = getPrismaClient();
	}
	prisma = global.__db;
}

module.exports = prisma;
