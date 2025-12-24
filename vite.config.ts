import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base path for GitHub Pages deployment
  // Change 'quick-copy-pad' to your repository name if different
  // For user/organization pages (username.github.io), use base: '/'
  base: process.env.GITHUB_REPOSITORY 
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` 
    : process.env.VITE_BASE_PATH || '/quick-copy-pad/',
  server: {
    host: "::",
    port: 8081,
    strictPort: true, // Exit if port is already in use instead of trying another port
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
