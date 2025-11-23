import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  optimizeDeps: {
    include: ["firebase/app", "firebase/firestore", "firebase/storage"]
  },
  resolve: {
    preserveSymlinks: false
  }
});
