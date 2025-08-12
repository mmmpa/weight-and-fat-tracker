import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Storybook-specific Vite config without React Router plugin
export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "~": new URL("../app", import.meta.url).pathname,
    },
  },
});
