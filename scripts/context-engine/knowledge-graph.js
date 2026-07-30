"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const ts = require("typescript");
const SUPPORTED = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];
function normalize(value) { return value.replace(/\\/g, "/"); }
function hash(value) { return crypto.createHash("sha256").update(value, "utf8").digest("hex"); }
function scriptKind(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".tsx") return ts.ScriptKind.TSX;
  if (ext === ".jsx") return ts.ScriptKind.JSX;
  if ([".js", ".mjs", ".cjs"].includes(ext)) return ts.ScriptKind.JS;
  return ts.ScriptKind.TS;
}
function loadTsConfig(root) {
  const file = ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.json");
  if (!file) return { options: {}, errors: [] };
  const read = ts.readConfigFile(file, ts.sys.readFile);
  if (read.error) return { options: {}, errors: [read.error] };
  return ts.parseJsonConfigFileContent(read.config, ts.sys, path.dirname(file));
}
function classifySpecifier(specifier) {
  if (specifier.startsWith("node:")) return "node_builtin";
  if (!specifier.startsWith(".") && !specifier.startsWith("/") && !specifier.startsWith("@/")) return "external_package";
  return "internal";
}
function resolveTarget(root, sourceFile, specifier, options) {
  const targetKind = classifySpecifier(specifier);
  if (targetKind !== "internal") return { target: specifier, targetKind, resolved: true, resolutionReason: null };
  const result = ts.resolveModuleName(specifier, sourceFile, options, ts.sys).resolvedModule;
  if (!result) return { target: null, targetKind: "unresolved", resolved: false, resolutionReason: "typescript_resolution_failed" };
  const relative = normalize(path.relative(root, result.resolvedFileName));
  if (relative.startsWith("node_modules/")) return { target: specifier, targetKind: "external_package", resolved: true, resolutionReason: null };
  return { target: relative, targetKind: "internal", resolved: true, resolutionReason: null };
}
function collectRelations(root, relativePath, content, options) {
  const absolute = path.join(root, relativePath);
  const source = ts.createSourceFile(absolute, content, ts.ScriptTarget.Latest, true, scriptKind(relativePath));
  const relations = [];
  function add(specifier, relationType, dynamicUnknown = false) {
    const resolution = dynamicUnknown
      ? { target: null, targetKind: "dynamic", resolved: false, resolutionReason: "non_literal_dynamic_import" }
      : resolveTarget(root, absolute, specifier, options);
    const basis = `${relativePath}|${specifier}|${relationType}|${resolution.target || ""}`;
    relations.push({ id: `REL-${hash(basis).slice(0, 16)}`, source: normalize(relativePath), specifier, target: resolution.target, targetKind: resolution.targetKind, relationType, resolved: resolution.resolved, resolutionReason: resolution.resolutionReason });
  }
  function literal(node) { return ts.isStringLiteralLike(node) ? node.text : null; }
  function visit(node) {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier) add(literal(node.moduleSpecifier), node.importClause && node.importClause.isTypeOnly ? "type_import" : "static_import");
    else if (ts.isExportDeclaration(node) && node.moduleSpecifier) add(literal(node.moduleSpecifier), "export_from");
    else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      const value = node.arguments.length ? literal(node.arguments[0]) : null;
      add(value || "<dynamic>", "dynamic_import", !value);
    } else if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "require") {
      const value = node.arguments.length ? literal(node.arguments[0]) : null;
      if (value) add(value, "require");
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return { relations, parseDiagnostics: source.parseDiagnostics || [] };
}
function detectCycles(relations) {
  const adjacency = new Map();
  for (const relation of relations) {
    if (!relation.resolved || relation.targetKind !== "internal" || !relation.target) continue;
    if (!adjacency.has(relation.source)) adjacency.set(relation.source, []);
    adjacency.get(relation.source).push({ target: relation.target, id: relation.id });
  }
  const cycles = new Map();
  function canonical(files) {
    const ring = files.slice(0, -1);
    if (!ring.length) return [];
    const variants = [];
    for (let i=0;i<ring.length;i++) variants.push([...ring.slice(i),...ring.slice(0,i)]);
    variants.sort((a,b)=>a.join("|").localeCompare(b.join("|")));
    return variants[0];
  }
  function walk(node, stack, edgeIds) {
    const index = stack.indexOf(node);
    if (index >= 0) {
      const files = canonical([...stack.slice(index), node]);
      const relationIds = edgeIds.slice(index).sort();
      const key = files.join("|");
      if (!cycles.has(key)) cycles.set(key, { id: `CYCLE-${hash(key).slice(0, 16)}`, files, relationIds });
      return;
    }
    if (stack.length > adjacency.size) return;
    for (const edge of adjacency.get(node) || []) walk(edge.target, [...stack, node], [...edgeIds, edge.id]);
  }
  for (const node of [...adjacency.keys()].sort()) walk(node, [], []);
  return [...cycles.values()].sort((a,b)=>a.id.localeCompare(b.id));
}
function buildKnowledgeGraph(root, sourceFiles) {
  const parsed = loadTsConfig(root);
  const relations = [];
  const parseErrors = [];
  for (const file of sourceFiles) {
    if (!SUPPORTED.includes(path.extname(file.path).toLowerCase())) continue;
    const result = collectRelations(root, file.path, file.content, parsed.options);
    relations.push(...result.relations);
    for (const diagnostic of result.parseDiagnostics) parseErrors.push({ file: file.path, status: "parse_error", message: ts.flattenDiagnosticMessageText(diagnostic.messageText, " "), blocking: false });
  }
  relations.sort((a,b)=>a.id.localeCompare(b.id));
  return { relations, cycles: detectCycles(relations), parseErrors, complete: parseErrors.length === 0 };
}
module.exports = { buildKnowledgeGraph, collectRelations, detectCycles };
