const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

const IGNORE = [
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
];

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
      currentEpic: "EPIC-001",
      name: "Context Engine",
      status: "in_progress"
    },

    roadmap: [
      {
        name: "Blog",
        status: "completed"
      },
      {
        name: "Context Engine",
        status: "in_progress"
      },
      {
        name: "CMS",
        status: "planned"
      },
      {
        name: "Área Administrativa",
        status: "planned"
      },
      {
        name: "Gestão de Usuários",
        status: "planned"
      },
      {
        name: "Media Center",
        status: "planned"
      },
      {
        name: "Construtor de Páginas",
        status: "planned"
      },
      {
        name: "Multi-Tenant",
        status: "planned"
      },
      {
        name: "IA Generativa",
        status: "planned"
      },
      {
        name: "SaaS Tupiniquim",
        status: "planned"
      }
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
  }
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

function walk(dir) {
  const entries = fs.readdirSync(dir, {
    withFileTypes: true
  });

  for (const entry of entries) {
    if (IGNORE.includes(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    const relativePath = normalize(
      path.relative(ROOT, fullPath)
    );

    if (shouldIgnore(relativePath)) {
      continue;
    }

    projectMap.filesystem.push({
      path: relativePath,
      type: entry.isDirectory()
        ? "directory"
        : "file"
    });

    if (entry.isDirectory()) {
      walk(fullPath);
    }
  }
}

function detectRoute(relativePath) {
  const file = normalize(relativePath);

  if (!file.startsWith("app/")) {
    return null;
  }

  if (!file.endsWith("/page.tsx")) {
    return null;
  }

  const route = file
    .replace(/^app/, "")
    .replace(/\/page\.tsx$/, "");

  return route || "/";
}

function extractImports() {
  return [];
}

function scanFiles(dir) {
  const entries = fs.readdirSync(dir, {
    withFileTypes: true
  });

  for (const entry of entries) {
    if (IGNORE.includes(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanFiles(fullPath);
      continue;
    }

    const relativePath = normalize(
      path.relative(ROOT, fullPath)
    );

    if (shouldIgnore(relativePath)) {
      continue;
    }

    const route = detectRoute(relativePath);

    if (route) {
      projectMap.routes.push({
        route,
        source: relativePath
      });
    }

    if (
      relativePath.endsWith(".tsx") ||
      relativePath.endsWith(".jsx")
    ) {
      projectMap.components.push(relativePath);
    }

    if (
      relativePath.startsWith("content/posts/") &&
      relativePath.endsWith(".mdx")
    ) {
      projectMap.posts.push({
        slug: path.basename(
          relativePath,
          ".mdx"
        ),
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

      if (!content) {
        continue;
      }

      projectMap.importGraph.push({
        file: relativePath,
        imports: extractImports(content)
      });
    }
  }
}

function loadPackageJson() {
  const packageFile = path.join(
    ROOT,
    "package.json"
  );

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
  const wranglerFile = path.join(
    ROOT,
    "wrangler.jsonc"
  );

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
    cloudflare:
      projectMap.integrations.cloudflare === true
  };
}

function buildExecutionFlow() {
  projectMap.executionFlow = {
    content: [
      "content/posts/*.mdx",
      "scripts/generate-posts.js",
      "lib/generated-posts.ts",
      "app/blog/page.tsx",
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
  projectMap.filesystem.sort((a, b) =>
    a.path.localeCompare(b.path)
  );

  projectMap.routes.sort((a, b) =>
    a.route.localeCompare(b.route)
  );

  projectMap.components.sort((a, b) =>
    a.localeCompare(b)
  );

  projectMap.posts.sort((a, b) =>
    a.slug.localeCompare(b.slug)
  );

  projectMap.importGraph.sort((a, b) =>
    a.file.localeCompare(b.file)
  );
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
    "contextEngine"
  ];

  for (const key of requiredRootKeys) {
    if (!(key in projectMap)) {
      throw new Error(
        `Required project map block is missing: ${key}`
      );
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
      throw new Error(
        `Required Context Engine block is missing: ${key}`
      );
    }
  }

  if (!Array.isArray(projectMap.routes)) {
    throw new Error(
      "The routes block must be an array."
    );
  }

  if (!Array.isArray(projectMap.posts)) {
    throw new Error(
      "The posts block must be an array."
    );
  }

  if (!Array.isArray(projectMap.importGraph)) {
    throw new Error(
      "The importGraph block must be an array."
    );
  }
}

function save() {
  const outputDir = path.join(
    ROOT,
    "site-context"
  );

  fs.mkdirSync(outputDir, {
    recursive: true
  });

  const outputFile = path.join(
    outputDir,
    "project-map.json"
  );

  fs.writeFileSync(
    outputFile,
    JSON.stringify(projectMap, null, 2),
    "utf8"
  );

  return outputFile;
}

function main() {
  try {
    console.log(
      "Generating project map..."
    );

    loadPackageJson();
    loadWrangler();
    walk(ROOT);
    scanFiles(ROOT);
    buildArchitecture();
    buildRuntime();
    buildExecutionFlow();
    sortProjectMap();
    validateProjectMap();

    const outputFile = save();

    console.log(
      `${normalize(
        path.relative(ROOT, outputFile)
      )} generated successfully.`
    );
  } catch (error) {
    console.error(
      "Failed to generate project map."
    );

    console.error(
      error instanceof Error
        ? error.message
        : String(error)
    );

    process.exitCode = 1;
  }
}

main();