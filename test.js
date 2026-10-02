const fs = require("fs");
const path = require("path");
const http = require("http");

console.log("==========================================");
console.log("🧪 RUNNING E-CELL WEBSITE AUTOMATED TESTS");
console.log("==========================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

// 1. Check required files exist
const requiredFiles = ["index.html", "styles.css", "script.js", "package.json", "server.js"];
requiredFiles.forEach((file) => {
  assert(fs.existsSync(path.join(__dirname, file)), `File exists: ${file}`);
});

// 2. Validate index.html content
const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");

const requiredIds = [
  "articles",
  "article-modal",
  "share-modal",
  "toast-notification",
  "comment-form",
  "comment-author-name",
  "comment-body-text",
  "comment-status",
  "comments-stream",
  "share-link-input",
  "share-copy-button",
  "article-comments-section",
  "album-modal",
  "article-content-airbnb",
  "article-content-nike",
  "article-interaction-zone",
  "modal-article-breadcrumb"
];

requiredIds.forEach((id) => {
  assert(html.includes(`id="${id}"`), `HTML element ID exists: #${id}`);
});

// 3. Check article folder cards & interactive attributes
assert(html.includes('data-article="airbnb"'), "Airbnb article card exists with data-article attribute");
assert(html.includes('data-article="nike"'), "Nike article card exists with data-article attribute");
assert(html.includes('class="article-folder-card"'), "Article folder card class present");
assert(html.includes('class="article-read-btn"'), "Read story button present");
assert(html.includes('like-btn'), "Like button present (class 'like-btn')");
assert(html.includes('share-btn'), "Share button present (class 'share-btn')");
assert(html.includes('comment-btn'), "Comment button present (class 'comment-btn')");

// 4. Verify assets referenced in index.html exist on disk
const assetMatches = html.match(/src="([^"]+)"/g) || [];
assetMatches.forEach((match) => {
  const src = match.replace(/^src="/, "").replace(/"$/, "");
  if (!src.startsWith("http")) {
    const fullPath = path.join(__dirname, src);
    assert(fs.existsSync(fullPath), `Asset file exists: ${src}`);
  }
});

// 5. Check CSS classes
const css = fs.readFileSync(path.join(__dirname, "styles.css"), "utf-8");
const requiredClasses = [
  ".article-grid",
  ".article-folder-card",
  ".article-folder-thumb",
  ".article-modal",
  ".article-dialog",
  ".article-modal-nav",
  ".article-engage-banner",
  ".big-like-button",
  ".comments-stream",
  ".share-modal",
  ".toast-notification"
];

requiredClasses.forEach((cls) => {
  assert(css.includes(cls), `CSS selector exists: ${cls}`);
});

// 6. Check script.js syntax
try {
  require("./script.js");
} catch (e) {
  // If it fails on browser DOM, check syntax via Function constructor
  const scriptContent = fs.readFileSync(path.join(__dirname, "script.js"), "utf-8");
  try {
    new Function(scriptContent);
    assert(true, "script.js is syntactically valid");
  } catch (syntaxErr) {
    assert(false, `script.js syntax error: ${syntaxErr.message}`);
  }
}

// 7. Test HTTP Server
async function testServer() {
  const { spawn } = require("child_process");
  const serverProc = spawn("node", ["server.js"], { env: { ...process.env, PORT: "3899" } });

  await new Promise((resolve) => setTimeout(resolve, 800));

  await new Promise((resolve) => {
    http.get("http://localhost:3899/", (res) => {
      assert(res.statusCode === 200, "Server serves index.html with HTTP 200");
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        assert(body.includes('id="articles"'), "Server response contains #articles section");
        assert(body.includes('id="article-modal"'), "Server response contains #article-modal");
        resolve();
      });
    }).on("error", (err) => {
      assert(false, "Server request failed: " + err.message);
      resolve();
    });
  });

  await new Promise((resolve) => {
    http.get("http://localhost:3899/styles.css", (res) => {
      assert(res.statusCode === 200, "Server serves styles.css with HTTP 200");
      resolve();
    }).on("error", () => resolve());
  });

  await new Promise((resolve) => {
    http.get("http://localhost:3899/script.js", (res) => {
      assert(res.statusCode === 200, "Server serves script.js with HTTP 200");
      resolve();
    }).on("error", () => resolve());
  });

  serverProc.kill();

  console.log("\n==========================================");
  console.log(`TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log("==========================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log("\n🎉 ALL TESTS PASSED! WEBSITE IS FULLY READY TO RUN!\n");
    process.exit(0);
  }
}

testServer();

