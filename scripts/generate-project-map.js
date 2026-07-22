const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "site-context");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "project-map.json");
const TEMP_FILE = path.join(OUTPUT_DIR, "project-map.tmp.json");
const BACKUP_FILE = path.join(OUTPUT_DIR, "project-map.backup.json");

const MAX_FILE_SIZE_BYTES = 512000;
const MAX_TOTAL_SIZE_BYTES = 5242880;

const IGNORE_DIRECTORIES = new Set([
  ".git",
  ".next",
  "node_modules",
  ".open-next",
  ".vercel",
  "dist",
  "build",
  "coverage",
  ".aider.tags.cache.v4",
  ".wrangler"
]);

const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".jsonc",
  ".css",
  ".mdx",
  ".md"
]);

const BINARY_EXTENSIONS = new Set([
  ".ico",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".eot",
  ".sqlite",
  ".db",
  ".exe",
  ".dll",
  ".zip",
  ".tar",
  ".gz",
  ".7z",
  ".rar"
]);

const EXPECTED_EXCLUSION_REASONS = new Set([
  "sensitive_file",
  "binary_file",
  "unsupported_extension",
  "generated_output",
  "local_artifact"
]);

const INCOMPLETE_EXCLUSION_REASONS = new Set([
  "file_size_limit",
  "total_size_limit",
  "read_error"
]);

const projectMap = {
  generatedAt: new Date().toISOString(),
  project: {},
  architecture: {},
  filesystem: [],
  routes: [],
  dependencies: {},
  scripts: {},
  components: [],
  posts: [],
  importGraph: [],
  integrations: {},
  runtime: {},
  executionFlow: {},
  contextEngine: {
    productVision: {
      name: "Tupiniquim Platform",
      mission:
        "Plataforma SaaS brasileira para conteúdo, mídia, gestão e aplicações multi-tenant."
    },
    businessGoals: [
      "Reduzir dependência de contexto em conversas com IA",
      "Preparar a fundação para CMS",
      "Preparar a fundação para Media Center",
      "Preparar a fundação para Multi-Tenant",
      "Preparar a fundação para IA Generativa",
      "Evoluir para modelo SaaS"
    ],
    projectStatus: {
      currentEpic: "EPIC-002",
      name: "Categorias Permanentes do Blog",
      status: "in_progress"
    },
    roadmap: [
      { name: "Blog", status: "completed" },
      { name: "Context Engine", status: "completed" },
      { name: "Categorias Permanentes do Blog", status: "in_progress" },
      { name: "CMS", status: "planned" },
      { name: "Área Administrativa", status: "planned" },
      { name: "Gestão de Usuários", status: "planned" },
      { name: "Media Center", status: "planned" },
      { name: "Construtor de Páginas", status: "planned" },
      { name: "Multi-Tenant", status: "planned" },
      { name: "IA Generativa", status: "planned" },
      { name: "SaaS Tupiniquim", status: "planned" }
    ],
    architectureDecisions: [
      {
        id: "ADR-001",
        title: "Project Map como Fonte Única da Verdade",
        status: "approved",
        description:
          "O project-map.json é a principal fonte de contexto técnico da plataforma."
      },
      {
        id: "ADR-002",
        title: "Context Engine Monolítico",
        status: "approved",
        description:
          "O Context Engine evolui sobre project-map.json evitando múltiplos arquivos redundantes."
      }
    ]
  },
  sourceMapStatus: {
    enabled: true,
    complete: true,
    redactionApplied: true,
    maxFileSizeBytes: MAX_FILE_SIZE_BYTES,
    maxTotalSizeBytes: MAX_TOTAL_SIZE_BYTES,
    includedFiles: 0,
    excludedFiles: 0,
    expectedExclusions: 0,
    incompleteExclusions: 0,
    redactedFiles: 0,
    includedSizeBytes: 0
  },
  sourceFiles: [],
  excludedSourceFiles: []
};

function normalize(value) {
  return value.replace(/\\/g, "/");
}

function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function shouldIgnore(relativePath) {
  return (
    relativePath.startsWith("No arquivo `") ||
    relativePath.includes("o script tenta")
  );
}

function isLocalArtifact(relativePath) {
  const baseName = path.posix.basename(relativePath).toLowerCase();
  return (
    baseName.startsWith(".aider") ||
    baseName === "build-error.txt" ||
    baseName.endsWith(".log") ||
    baseName.endsWith(".tmp") ||
    baseName.endsWith(".bak") ||
    baseName.endsWith(".backup") ||
    baseName.endsWith(".cache")
  );
}

function isSensitiveFile(relativePath) {
  const baseName = path.posix.basename(relativePath).toLowerCase();
  return (
    baseName === ".env" ||
    baseName.startsWith(".env.") ||
    /\.(pem|key|p12|pfx)$/i.test(baseName) ||
    baseName.startsWith("credentials") ||
    baseName.startsWith("secrets")
  );
}

function isGeneratedOutput(relativePath) {
  return (
    relativePath === "site-context/project-map.json" ||
    relativePath === "site-context/project-map.tmp.json" ||
    relativePath === "site-context/project-map.backup.json" ||
    relativePath === "next-env.d.ts" ||
    relativePath === "package-lock.json"
  );
}

function getExtension(relativePath) {
  if (relativePath.toLowerCase().endsWith(".d.ts")) {
    return ".d.ts";
  }
  return path.posix.extname(relativePath).toLowerCase();
}

function getLanguage(extension) {
  const languageByExtension = {
    ".ts": "typescript",
    ".tsx": "typescript-react",
    ".d.ts": "typescript-declaration",
    ".js": "javascript",
    ".jsx": "javascript-react",
    ".mjs": "javascript-esm",
    ".cjs": "javascript-commonjs",
    ".json": "json",
    ".jsonc": "json-with-comments",
    ".css": "css",
    ".mdx": "mdx",
    ".md": "markdown"
  };
  return languageByExtension[extension] || "text";
}

function getCategory(relativePath, extension) {
  if (relativePath === "AGENTS.md") {
    return "operational-documentation";
  }
  if (relativePath.startsWith("content/") && extension === ".mdx") {
    return "content";
  }
  if (extension === ".css") {
    return "style";
  }
  if (
    relativePath === "package.json" ||
    relativePath === "tsconfig.json" ||
    relativePath === "wrangler.jsonc" ||
    relativePath === "eslint.config.mjs"
  ) {
    return "configuration";
  }
  if (extension === ".md") {
    return "documentation";
  }
  return "source-code";
}

function countLines(content) {
  if (content.length === 0) {
    return 0;
  }
  return content.split(/\r\n|\r|\n/).length;
}

function sha256(content) {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex");
}

function redactSecrets(content) {
  let redacted = false;
  let result = content;
  const sensitiveNames = [
    "API_KEY",
    "API_TOKEN",
    "ACCESS_TOKEN",
    "AUTH_TOKEN",
    "SECRET",
    "PASSWORD",
    "PRIVATE_KEY",
    "CLIENT_SECRET",
    "CLOUDFLARE_API_TOKEN",
    "GITHUB_TOKEN"
  ];

  for (const name of sensitiveNames) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patterns = [
      new RegExp(
        `(${escapedName}\\s*=\\s*)(["']?)([^"'\\r\\n,;]+)\\2`,
        "gi"
      ),
      new RegExp(
        `(["']${escapedName}["']\\s*:\\s*)(["'])(.*?)\\2`,
        "gi"
      )
    ];

    for (const pattern of patterns) {
      result = result.replace(pattern, (match, prefix, quote) => {
        redacted = true;
        return `${prefix}${quote || ""}[REDACTED]${quote || ""}`;
      });
    }
  }

  return { content: result, redacted };
}

function addExcludedSourceFile(relativePath, reason) {
  projectMap.excludedSourceFiles.push({ path: relativePath, reason });
  projectMap.sourceMapStatus.excludedFiles += 1;

  if (EXPECTED_EXCLUSION_REASONS.has(reason)) {
    projectMap.sourceMapStatus.expectedExclusions += 1;
  }
  if (INCOMPLETE_EXCLUSION_REASONS.has(reason)) {
    projectMap.sourceMapStatus.incompleteExclusions += 1;
    projectMap.sourceMapStatus.complete = false;
  }
}

function walk(dir) {
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    if (IGNORE_DIRECTORIES.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    const relativePath = normalize(path.relative(ROOT, fullPath));

    if (shouldIgnore(relativePath)) {
      continue;
    }

    projectMap.filesystem.push({
      path: relativePath,
      type: entry.isDirectory() ? "directory" : "file"
    });

    if (entry.isDirectory()) {
      walk(fullPath);
    }
  }
}

function detectRoute(relativePath) {
  const file = normalize(relativePath);
  if (!file.startsWith("app/") || !file.endsWith("/page.tsx")) {
    return null;
  }
  const route = file.replace(/^app/, "").replace(/\/page\.tsx$/, "");
  return route || "/";
}

function extractImports() {
  return [];
}

function scanFiles(dir) {
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    if (IGNORE_DIRECTORIES.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanFiles(fullPath);
      continue;
    }

    const relativePath = normalize(path.relative(ROOT, fullPath));
    if (shouldIgnore(relativePath)) {
      continue;
    }

    const route = detectRoute(relativePath);
    if (route) {
      projectMap.routes.push({ route, source: relativePath });
    }

    if (relativePath.endsWith(".tsx") || relativePath.endsWith(".jsx")) {
      projectMap.components.push(relativePath);
    }

    if (
      relativePath.startsWith("content/posts/") &&
      relativePath.endsWith(".mdx")
    ) {
      projectMap.posts.push({
        slug: path.basename(relativePath, ".mdx"),
        file: relativePath
      });
    }

    if (
      relativePath.endsWith(".js") ||
      relativePath.endsWith(".jsx") ||
      relativePath.endsWith(".ts") ||
      relativePath.endsWith(".tsx")
    ) {
      const content = safeRead(fullPath);
      if (content !== null) {
        projectMap.importGraph.push({
          file: relativePath,
          imports: extractImports(content)
        });
      }
    }
  }
}

function collectSourceFiles() {
  const filePaths = projectMap.filesystem
    .filter((entry) => entry.type === "file")
    .map((entry) => entry.path)
    .sort((a, b) => a.localeCompare(b));

  for (const relativePath of filePaths) {
    const extension = getExtension(relativePath);

    if (isGeneratedOutput(relativePath)) {
      addExcludedSourceFile(relativePath, "generated_output");
      continue;
    }
    if (isLocalArtifact(relativePath)) {
      addExcludedSourceFile(relativePath, "local_artifact");
      continue;
    }
    if (isSensitiveFile(relativePath)) {
      addExcludedSourceFile(relativePath, "sensitive_file");
      continue;
    }
    if (BINARY_EXTENSIONS.has(extension)) {
      addExcludedSourceFile(relativePath, "binary_file");
      continue;
    }
    if (!TEXT_EXTENSIONS.has(extension)) {
      addExcludedSourceFile(relativePath, "unsupported_extension");
      continue;
    }

    const fullPath = path.join(ROOT, relativePath);
    let stats;
    try {
      stats = fs.statSync(fullPath);
    } catch {
      addExcludedSourceFile(relativePath, "read_error");
      continue;
    }

    if (stats.size > MAX_FILE_SIZE_BYTES) {
      addExcludedSourceFile(relativePath, "file_size_limit");
      continue;
    }

    const originalContent = safeRead(fullPath);
    if (originalContent === null) {
      addExcludedSourceFile(relativePath, "read_error");
      continue;
    }

    const originalSizeBytes = Buffer.byteLength(originalContent, "utf8");
    if (
      projectMap.sourceMapStatus.includedSizeBytes + originalSizeBytes >
      MAX_TOTAL_SIZE_BYTES
    ) {
      addExcludedSourceFile(relativePath, "total_size_limit");
      continue;
    }

    const redactionResult = redactSecrets(originalContent);
    if (redactionResult.redacted) {
      projectMap.sourceMapStatus.redactedFiles += 1;
    }

    projectMap.sourceFiles.push({
      path: relativePath,
      category: getCategory(relativePath, extension),
      extension,
      language: getLanguage(extension),
      sizeBytes: originalSizeBytes,
      lineCount: countLines(originalContent),
      sha256: sha256(originalContent),
      sha256Source: "original-content",
      redacted: redactionResult.redacted,
      content: redactionResult.content
    });

    projectMap.sourceMapStatus.includedFiles += 1;
    projectMap.sourceMapStatus.includedSizeBytes += originalSizeBytes;
  }

  projectMap.sourceFiles.sort((a, b) => a.path.localeCompare(b.path));
  projectMap.excludedSourceFiles.sort((a, b) =>
    a.path.localeCompare(b.path)
  );
  projectMap.sourceMapStatus.complete =
    projectMap.sourceMapStatus.incompleteExclusions === 0;
}

function loadPackageJson() {
  const packageFile = path.join(ROOT, "package.json");
  if (!fs.existsSync(packageFile)) {
    return;
  }
  const packageContent = safeRead(packageFile);
  if (!packageContent) {
    return;
  }
  const pkg = JSON.parse(packageContent);
  projectMap.project = {
    name: pkg.name || null,
    version: pkg.version || null
  };
  projectMap.dependencies = {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {})
  };
  projectMap.scripts = pkg.scripts || {};
}

function loadWrangler() {
  const wranglerFile = path.join(ROOT, "wrangler.jsonc");
  if (!fs.existsSync(wranglerFile)) {
    projectMap.integrations.cloudflare = false;
    return;
  }
  projectMap.integrations.cloudflare = true;
  projectMap.integrations.wrangler = "wrangler.jsonc";
}

function buildArchitecture() {
  projectMap.architecture = {
    framework: "Next.js",
    renderer: "React",
    adapter: "OpenNext",
    hosting: "Cloudflare",
    contentSource: "MDX Filesystem"
  };
}

function buildRuntime() {
  projectMap.runtime = {
    framework: "Next.js",
    node: process.version,
    cloudflare: projectMap.integrations.cloudflare === true
  };
}

function buildExecutionFlow() {
  projectMap.executionFlow = {
    content: [
      "content/posts/*.mdx",
      "scripts/generate-posts.js",
      "lib/generated-posts.ts",
      "lib/blog-categories.ts",
      "app/blog/page.tsx",
      "app/blog/[slug]/page.tsx",
      "app/blog/categoria/[categoria]/page.tsx"
    ],
    categories: [
      "lib/blog-categories.ts",
      "lib/generated-posts.ts",
      "app/blog/page.tsx",
      "app/blog/categoria/[categoria]/page.tsx",
      "app/blog/[slug]/page.tsx"
    ],
    build: [
      "scripts/generate-posts.js",
      "next build",
      "OpenNext",
      "Cloudflare Deploy"
    ],
    contextEngine: [
      "npm run context:scan",
      "scripts/generate-project-map.js",
      "site-context/project-map.json",
      "BizChat / IA"
    ]
  };
}

function sortProjectMap() {
  projectMap.filesystem.sort((a, b) => a.path.localeCompare(b.path));
  projectMap.routes.sort((a, b) => a.route.localeCompare(b.route));
  projectMap.components.sort((a, b) => a.localeCompare(b));
  projectMap.posts.sort((a, b) => a.slug.localeCompare(b.slug));
  projectMap.importGraph.sort((a, b) => a.file.localeCompare(b.file));
}

function validateSourceFile(sourceFile) {
  const requiredKeys = [
    "path",
    "category",
    "extension",
    "language",
    "sizeBytes",
    "lineCount",
    "sha256",
    "sha256Source",
    "redacted",
    "content"
  ];
  for (const key of requiredKeys) {
    if (!(key in sourceFile)) {
      throw new Error(`Required source file field is missing: ${key}`);
    }
  }
}

function validateProjectMap() {
  const requiredRootKeys = [
    "generatedAt",
    "project",
    "architecture",
    "filesystem",
    "routes",
    "dependencies",
    "scripts",
    "components",
    "posts",
    "importGraph",
    "integrations",
    "runtime",
    "executionFlow",
    "contextEngine",
    "sourceMapStatus",
    "sourceFiles",
    "excludedSourceFiles"
  ];

  for (const key of requiredRootKeys) {
    if (!(key in projectMap)) {
      throw new Error(`Required project map block is missing: ${key}`);
    }
  }

  const requiredContextKeys = [
    "productVision",
    "businessGoals",
    "projectStatus",
    "roadmap",
    "architectureDecisions"
  ];
  for (const key of requiredContextKeys) {
    if (!(key in projectMap.contextEngine)) {
      throw new Error(`Required Context Engine block is missing: ${key}`);
    }
  }

  for (const key of [
    "filesystem",
    "routes",
    "posts",
    "importGraph",
    "sourceFiles",
    "excludedSourceFiles"
  ]) {
    if (!Array.isArray(projectMap[key])) {
      throw new Error(`The ${key} block must be an array.`);
    }
  }

  for (const sourceFile of projectMap.sourceFiles) {
    validateSourceFile(sourceFile);
  }

  if (
    projectMap.sourceMapStatus.complete !==
    (projectMap.sourceMapStatus.incompleteExclusions === 0)
  ) {
    throw new Error("Source map completeness status is inconsistent.");
  }
}

function parseJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function cleanupTransientFiles() {
  for (const filePath of [TEMP_FILE, BACKUP_FILE]) {
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath, { force: true });
    }
  }
}

function saveAtomically() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  cleanupTransientFiles();

  const serialized = JSON.stringify(projectMap, null, 2);
  JSON.parse(serialized);
  fs.writeFileSync(TEMP_FILE, serialized, "utf8");
  parseJsonFile(TEMP_FILE);

  let backupCreated = false;

  try {
    if (fs.existsSync(OUTPUT_FILE)) {
      fs.copyFileSync(OUTPUT_FILE, BACKUP_FILE);
      parseJsonFile(BACKUP_FILE);
      backupCreated = true;
      fs.rmSync(OUTPUT_FILE, { force: true });
    }

    fs.renameSync(TEMP_FILE, OUTPUT_FILE);
    parseJsonFile(OUTPUT_FILE);

    if (backupCreated && fs.existsSync(BACKUP_FILE)) {
      fs.rmSync(BACKUP_FILE, { force: true });
    }

    cleanupTransientFiles();
    return OUTPUT_FILE;
  } catch (error) {
    if (fs.existsSync(OUTPUT_FILE)) {
      fs.rmSync(OUTPUT_FILE, { force: true });
    }
    if (backupCreated && fs.existsSync(BACKUP_FILE)) {
      fs.renameSync(BACKUP_FILE, OUTPUT_FILE);
    }
    if (fs.existsSync(TEMP_FILE)) {
      fs.rmSync(TEMP_FILE, { force: true });
    }
    throw error;
  }
}

function main() {
  try {
    console.log("Generating project map with full source snapshot...");
    loadPackageJson();
    loadWrangler();
    walk(ROOT);
    scanFiles(ROOT);
    collectSourceFiles();
    buildArchitecture();
    buildRuntime();
    buildExecutionFlow();
    sortProjectMap();
    validateProjectMap();

    const outputFile = saveAtomically();
    console.log(
      `${normalize(path.relative(ROOT, outputFile))} generated successfully.`
    );
  } catch (error) {
    try {
      cleanupTransientFiles();
    } catch {
      // Preserve the original failure as the primary error.
    }
    console.error("Failed to generate project map.");
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

main();
