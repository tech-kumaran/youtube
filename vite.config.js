import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";

export default defineConfig({
  plugins: [
    react(),
    eslintPlugin({
      // ignore errors/warnings during build
      failOnError: false,
      failOnWarning: false,
      emitWarning: false,
      emitError: false,
    }),
  ],
  build: {
    outDir: "build",
  },
});
