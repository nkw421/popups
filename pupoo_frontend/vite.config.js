import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// CORS direct mode only: no Vite proxy.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
