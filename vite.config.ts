import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  /**
   * IMPORTANT:
   * - Custom domain (dinkcart.store) → base MUST be "/"
   * - This also works on Netlify / Vercel
   * - Do NOT use repo-name paths for custom domains
   */
  base: "/",

  server: {
    host: "::",
    port: 8081,
    strictPort: true,
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  /**
   * Optional but recommended for clean builds
   */
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
}));
