import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { ViteAliases } from "vite-aliases";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  plugins: [react(), ViteAliases(), vanillaExtractPlugin()],
  build: {
    sourcemap: false, // 소스 맵을 비활성화합니다.
    rollupOptions: {
      output: {
        format: "iife", // ES 모듈 대신 IIFE 형식을 사용합니다.
      },
    },
  },
  // base: "/",
});
