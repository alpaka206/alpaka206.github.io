import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  build: {
    sourcemap: false, // 소스 맵을 비활성화합니다.
    // rollupOptions: {
    //   output: {
    //     format: "iife", // ES 모듈 대신 IIFE 형식을 사용합니다.
    //   },
    // },
    rollupOptions: {
      output: {
        manualChunks: undefined, // 모든 코드가 하나의 번들로 합쳐지도록 설정
      },
    },
  },
  // base: "/",
});
