import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      "@luetzen/ai-gateway": resolve(__dirname, "src/lib/ai-gateway/index.ts"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "AiGatewayUi",
      formats: ["es", "umd"],
      fileName: "ai-gateway-ui",
    },
    rollupOptions: {
      external: ["vue", "pinia"],
      output: {
        globals: {
          vue: "Vue",
          pinia: "Pinia",
        },
      },
    },
    cssCodeSplit: false,
  },
});
