import { env } from "./src/env.mjs";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  basePath:
    (process.env.NODE_ENV === "production" && process.env.DEPLOYMENT_URL) ||
    "http://localhost:3000",
};

export default config;
