// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Optional: expose the commit SHA to your app (works on Vercel)
const commit = process.env.VERCEL_GIT_COMMIT_SHA ?? "dev";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  define: {
    __COMMIT__: JSON.stringify(commit), // remove if you don't need it
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react")) return "react-vendor";
          if (/(recharts|chart\.js|echarts)/.test(id)) return "charts";
          if (/(monaco-editor|react-quill|@tiptap|draft-js|quill)/.test(id))
            return "editor";
          if (/(xlsx|pdfjs-dist)/.test(id)) return "doc-tools";
          if (/@mui|antd|chakra|@radix-ui/.test(id)) return "ui-kit";
          if (/(dayjs|date-fns|moment)/.test(id)) return "date";
          if (/lodash/.test(id)) return "lodash";
          return "vendor";
        },
      },
    },
  },
});
