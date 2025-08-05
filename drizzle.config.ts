import "dotenv/config";
import { Config, defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db/migrations",
  schema: "./db/schema/index.ts",

  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://root:jcBqCiXH7Y0bCJHHWH2L1yEH@etna.liara.cloud:34417/postgres",
  },
  strict: true,
  verbose: true,
} satisfies Config);
