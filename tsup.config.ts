import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/client.ts"],
	format: ["cjs", "esm"],
	dts: true,
	sourcemap: true,
	clean: true,
	splitting: false,
	minify: false,
	esbuildOptions(options) {
		options.jsx = "automatic";
		options.jsxImportSource = "react";
	},
	external: ["react", "react-dom", "zod", "uuid", "zustand"],
});
