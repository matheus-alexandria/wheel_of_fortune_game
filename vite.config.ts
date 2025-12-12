import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "https://matheus-alexandria.github.io/wheel_of_fortune_game/"
});
