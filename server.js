const http = require("http");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const PORT = process.env.PORT || 3000;
const ROOT = path.resolve(__dirname);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split("?")[0].split("#")[0];
  let safePath = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[\/\\])+/, "");
  
  if (safePath === "/" || safePath === "\\") {
    safePath = "/index.html";
  }

  const filePath = path.join(ROOT, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
          <head><title>404 Not Found</title></head>
          <body style="font-family: sans-serif; text-align: center; padding: 4rem;">
            <h1>404 - Page Not Found</h1>
            <p>Could not find ${safePath}</p>
            <p><a href="/">Return to Homepage</a></p>
          </body>
        </html>
      `);
      return;
    }

    const ext = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache"
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 KITS Akshar E-Cell Website Server Running!`);
  console.log(`📡 Local URL: http://localhost:${PORT}`);
  console.log(`======================================================\n`);

  // Open default browser automatically
  const startCmd =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
      ? "start"
      : "xdg-open";

  exec(`${startCmd} http://localhost:${PORT}`, (error) => {
    if (error) {
      console.log(`ℹ️ Open http://localhost:${PORT} in your browser.`);
    }
  });
});
