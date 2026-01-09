import { readFileSync, existsSync } from "fs";
import { join } from "path";

const PROJECT_ROOT = import.meta.dir;
const PUBLIC_DIR = join(PROJECT_ROOT, "public");

const mimeTypes: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".jsx": "text/javascript",
  ".ts": "text/javascript",
  ".tsx": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function getMimeType(path: string): string {
  const ext = path.substring(path.lastIndexOf("."));
  return mimeTypes[ext] || "text/plain";
}

const server = Bun.serve({
  port: 7000,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname;

    // Handle source files with Bun's bundler
    if (pathname.startsWith("/src/")) {
      const filePath = join(PROJECT_ROOT, pathname);
      if (existsSync(filePath)) {
        try {
          const result = await Bun.build({
            entrypoints: [filePath],
            format: "esm",
            target: "browser",
            minify: false,
            splitting: false,
            external: [],
          });

          if (result.success && result.outputs.length > 0) {
            const output = result.outputs[0];
            const text = await output.text();
            return new Response(text, {
              headers: { "Content-Type": "text/javascript" },
            });
          }
        } catch (e) {
          console.error("Build error:", e);
        }
      }
    }

    // Serve static files from public directory
    if (pathname === "/") {
      pathname = "/index.html";
    }

    const publicPath = join(PUBLIC_DIR, pathname);
    if (existsSync(publicPath)) {
      const content = readFileSync(publicPath);
      return new Response(content, {
        headers: { "Content-Type": getMimeType(pathname) },
      });
    }

    // Fallback to index.html for SPA routing
    const indexPath = join(PUBLIC_DIR, "index.html");
    if (existsSync(indexPath)) {
      const content = readFileSync(indexPath);
      return new Response(content, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`🚀 Server running at http://localhost:${server.port}`);
