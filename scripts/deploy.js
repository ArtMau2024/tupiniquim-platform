#!/usr/bin/env node
/**
 * deploy.js — Cloudflare build + deploy
 *
 * Solução para Windows + Git Bash onde `spawn('npx', ...)` falha com ENOENT
 * porque o Node.js não encontra 'npx' sem extensão .cmd.
 * Usando { shell: true } o SO resolve npx.cmd automaticamente.
 */

const { spawnSync } = require("child_process");
const path = require("path");
const os = require("os");

const isWindows = os.platform() === "win32";

function run(cmd, args, opts = {}) {
  console.log(`\n> ${cmd} ${args.join(" ")}\n`);
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: isWindows, // força shell no Windows para resolver .cmd
    cwd: process.cwd(),
    ...opts,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

// Binários locais (node_modules/.bin)
const bin = (name) =>
  path.join(__dirname, "..", "node_modules", ".bin", name + (isWindows ? ".cmd" : ""));

// 1. Build OpenNext para Cloudflare
run(bin("opennextjs-cloudflare"), ["build"]);

// 2. Deploy com Wrangler
run(bin("wrangler"), ["deploy"]);
