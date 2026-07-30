"use strict";
const fs = require("fs");
const path = require("path");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const ROOT = process.cwd();
const stagedFile = path.join(ROOT, "site-context", ".generation-tmp", "project-map.json");
const schemaFile = path.join(ROOT, "site-context", "context-engine-v3.schema.json");
function fail(message) { console.error(message); process.exit(1); }
if (!fs.existsSync(stagedFile)) fail("Staged project map not found.");
if (!fs.existsSync(schemaFile)) fail("Context Engine V3 schema not found.");
try {
  const schema = JSON.parse(fs.readFileSync(schemaFile, "utf8"));
  const staged = JSON.parse(fs.readFileSync(stagedFile, "utf8"));
  const ajv = new Ajv2020({ strict: true, allErrors: true, allowUnionTypes: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  if (!validate(staged)) fail(`Staged schema validation failed:\n${JSON.stringify(validate.errors, null, 2)}`);
  if (staged.schemaVersion !== "3.1.0") fail("Unexpected staged schemaVersion.");
  console.log("Staged Context Engine V3 schema validated.");
} catch (error) { fail(error.message); }
