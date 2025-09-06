// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import path from "path";
export default defineConfig({
  plugins: [react(), tailwindcss()],
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("react")) return "react-vendor";
          if (/(recharts|chart\.js|echarts)/.test(id)) return "charts";
          if (/(monaco-editor|react-quill|@tiptap|draft-js|quill)/.test(id)) return "editor";
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
