import { execSync } from "node:child_process";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const commitHash = execSync("git rev-parse --short HEAD").toString().trim();
const buildDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  define: {
    "import.meta.env.VITE_GIT_COMMIT_HASH": JSON.stringify(commitHash),
    "import.meta.env.VITE_BUILD_DATE": JSON.stringify(buildDate),
  },
});
