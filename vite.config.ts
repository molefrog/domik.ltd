import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mdx({ providerImportSource: "@mdx-js/react" }), basicSsl()],

  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
});
