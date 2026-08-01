"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();
const canonicalFile = path.join(ROOT, "site-context", "project-map.json");
const stagedFile = path.join(ROOT, "site-context", ".generation-tmp", "project-map.json");
const legacyKeys = ["generatedAt","project","architecture","filesystem","routes","dependencies","scripts","components","posts","importGraph","integrations","runtime","executionFlow","contextEngine","sourceMapStatus","sourceFiles","excludedSourceFiles"];
function fail(message) { console.error(message); process.exit(1); }
try {
  const canonical = JSON.parse(fs.readFileSync(canonicalFile, "utf8"));
  const staged = JSON.parse(fs.readFileSync(stagedFile, "utf8"));
  for (const key of legacyKeys) {
    if (!(key in staged)) fail(`Legacy key missing in staged map: ${key}`);
    const beforeArray = Array.isArray(canonical[key]);
    const afterArray = Array.isArray(staged[key]);
    if (beforeArray !== afterArray) fail(`Legacy type changed: ${key}`);
    if (!beforeArray && typeof canonical[key] !== typeof staged[key]) fail(`Legacy type changed: ${key}`);
  }
  for (const key of ["project","architecture","integrations","executionFlow"]) {
    if (JSON.stringify(canonical[key]) !== JSON.stringify(staged[key])) fail(`Legacy semantic block changed unexpectedly: ${key}`);
  }
  const legacyContextEngineKeys = ["productVision","businessGoals","projectStatus","roadmap","architectureDecisions"];
  for (const key of legacyContextEngineKeys) {
    if (JSON.stringify(canonical.contextEngine?.[key]) !== JSON.stringify(staged.contextEngine?.[key])) fail(`Legacy Context Engine field changed unexpectedly: ${key}`);
  }
  if (!Array.isArray(staged.contextEngine?.technicalRoadmap) || staged.contextEngine.technicalRoadmap.length === 0) fail("Additive technicalRoadmap is missing from staged Context Engine.");
  console.log("Staged map preserved legacy keys, types, and semantic blocks.");
} catch (error) { fail(error.message); }
