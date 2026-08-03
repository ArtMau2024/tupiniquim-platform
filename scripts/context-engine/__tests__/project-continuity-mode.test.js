"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ASK_CONTEXT_PATH = path.join(
  process.cwd(),
  "scripts",
  "context-engine",
  "ask-context.js"
);

function readCompactSource() {
  const source = fs.readFileSync(ASK_CONTEXT_PATH, "utf8");
  assert.ok(source.trim().length > 0, "ask-context.js must not be empty");
  return source.replace(/\s+/g, "");
}

function extractBranches(source) {
  const deterministicMarker = 'if(intent==="project_continuity"){';
  const interpretiveMarker = '}else{try{';
  const deterministicStart = source.indexOf(deterministicMarker);
  const interpretiveStart = source.indexOf(interpretiveMarker, deterministicStart);
  const fallbackStart = source.indexOf('}catch(e){', interpretiveStart);

  assert.notEqual(deterministicStart, -1, "deterministic branch was not found");
  assert.notEqual(interpretiveStart, -1, "Ollama branch was not found");
  assert.notEqual(fallbackStart, -1, "Ollama fallback branch was not found");
  assert.ok(deterministicStart < interpretiveStart);
  assert.ok(interpretiveStart < fallbackStart);

  return {
    deterministic: source.slice(deterministicStart, interpretiveStart),
    interpretive: source.slice(interpretiveStart, fallbackStart),
    fallback: source.slice(fallbackStart),
  };
}

test("ask context keeps project continuity deterministic", () => {
  const source = readCompactSource();
  const branches = extractBranches(source);

  assert.match(source, /selectActiveProjectAndPlan\(\)/);
  assert.match(branches.deterministic, /validateAnswer\(fallback\(pkg\),pkg\)/);
  assert.match(branches.deterministic, /mode="deterministic"/);
  assert.match(branches.deterministic, /answer\.warnings=answer\.warnings\.filter/);
  assert.doesNotMatch(branches.deterministic, /chat\(/);
  assert.doesNotMatch(branches.deterministic, /composeModelAnswer\(/);
});

test("ask context composes and validates Ollama answers", () => {
  const source = readCompactSource();
  const branches = extractBranches(source);

  assert.match(branches.interpretive, /constmodelAnswer=awaitchat\(\{contextPackage:pkg\}\)/);
  assert.match(branches.interpretive, /composeModelAnswer\(modelAnswer,pkg\)/);
  assert.match(branches.interpretive, /validateAnswer\(composeModelAnswer\(modelAnswer,pkg\),pkg\)/);
  assert.match(branches.interpretive, /mode="ollama"/);

  const chatPosition = branches.interpretive.indexOf("awaitchat(");
  const composedValidationPosition = branches.interpretive.indexOf("validateAnswer(composeModelAnswer(");
  const composePosition = branches.interpretive.indexOf("composeModelAnswer(");
  const modePosition = branches.interpretive.indexOf('mode="ollama"');

  assert.ok(chatPosition >= 0 && chatPosition < composedValidationPosition);
  assert.ok(composedValidationPosition >= 0, "composed answer must be validated");
  assert.ok(composePosition >= composedValidationPosition && composePosition < modePosition);
});

test("ask context preserves fallback after Ollama failure", () => {
  const branches = extractBranches(readCompactSource());
  assert.match(branches.fallback, /answer=fallback\(pkg\)/);
  assert.match(branches.fallback, /answer\.warnings\.push\(e\.message\)/);
  assert.match(branches.fallback, /mode="fallback"/);
});
