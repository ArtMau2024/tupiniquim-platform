"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const ROOT = process.cwd();
const manifestFile = path.join(ROOT, "scripts", "baseline", "baseline-manifest.json");
function sha256(file) { return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"); }
function fail(message) { console.error(message); process.exit(1); }
if (!fs.existsSync(manifestFile)) fail("Baseline manifest not found.");
const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
const source = path.join(ROOT, manifest.source);
const baseline = path.join(ROOT, manifest.baseline);
if (!fs.existsSync(source) || !fs.existsSync(baseline)) fail("Baseline source or copy not found.");
const sourceHash = sha256(source);
const baselineHash = sha256(baseline);
if (sourceHash !== manifest.sha256 || baselineHash !== manifest.sha256) fail("Baseline integrity validation failed.");
console.log("Baseline integrity validated.");
