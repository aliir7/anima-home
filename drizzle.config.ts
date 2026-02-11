import dotenv from "dotenv";
import { Config, defineConfig } from "drizzle-kit";

dotenv.config();

export default defineConfig({
  out: "./db/migrations",
  schema: "./db/schema/index.ts",

  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  strict: true,
  verbose: true,
} satisfies Config);
