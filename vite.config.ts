import { readdirSync } from "node:fs";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { ROUTES } from "./src/data/routes";

const SITE_URL = "https://devrabiul.github.io/laravel-toaster-magic";
const BASE = "/laravel-toaster-magic/";

// Emit sitemap.xml + robots.txt from the canonical route list at build time so
// SEO metadata never drifts from the actual navigation.
function seoAssets(): Plugin {
  return {
    name: "ltm-docs-seo-assets",
    apply: "build",
    closeBundle() {
      const outDir = resolve(__dirname, "dist");
      const urls = ROUTES.map(
        (r) =>
          `  <url>\n    <loc>${SITE_URL}${r.path === "/" ? "/" : r.path}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${r.path === "/" ? "1.0" : "0.7"}</priority>\n  </url>`,
      ).join("\n");
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
      writeFileSync(resolve(outDir, "sitemap.xml"), sitemap);

      const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
      writeFileSync(resolve(outDir, "robots.txt"), robots);

      // Ensure the SPA fallback exists even if public/ copy order changes.
      void readdirSync(outDir);
    },
  };
}

export default defineConfig({
  base: BASE,
  plugins: [react(), seoAssets()],
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          highlight: ["prism-react-renderer"],
        },
      },
    },
  },
});
