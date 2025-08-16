import { execSync } from "node:child_process";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const commitHash = execSync("git rev-parse --short HEAD").toString().trim();
const buildDate = `${new Date()
  .toLocaleString("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
  .replace(" ", "T")}+09:00`; // Full ISO format with JST timezone

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  define: {
    "import.meta.env.VITE_GIT_COMMIT_HASH": JSON.stringify(commitHash),
    "import.meta.env.VITE_BUILD_DATE": JSON.stringify(buildDate),
  },
});
