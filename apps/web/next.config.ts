import path from "node:path";
import { fileURLToPath } from "node:url";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import type { NextConfig } from "next";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function nextConfig(phase: string): NextConfig {
  return {
    allowedDevOrigins: ["localhost", "127.0.0.1", "*.localhost"],
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
    outputFileTracingRoot: path.join(__dirname, "../.."),
    transpilePackages: ["@my-bpm-mini/shared"],
  };
}
