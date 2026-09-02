import { build, type Rollup } from "vite";

process.env.FLOWAI_SERVE_DIST = "true";

const watcher = await build({
  configLoader: "runner",
  build: {
    watch: {},
  },
}) as Rollup.RollupWatcher;

await import("./index.ts");

const close = async () => {
  await watcher.close();
  process.exit(0);
};

process.once("SIGINT", close);
process.once("SIGTERM", close);
