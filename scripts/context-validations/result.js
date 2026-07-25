"use strict";

const VALIDATION_STATUSES = Object.freeze([
  "passed",
  "failed",
  "pending",
  "skipped",
  "not_applicable",
]);

const VALIDATION_MODES = Object.freeze(["development", "final"]);

function isPlainObject(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function isValidationStatus(value) {
  return VALIDATION_STATUSES.includes(value);
}

function normalizeRequiredString(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Validation result ${fieldName} must be a non-empty string.`
    );
  }

  return value.trim();
}

function normalizeOptionalString(value) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function validateCanonicalIsoString(value, fieldName) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${fieldName} must be a canonical ISO 8601 string.`);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime()) || date.toISOString() !== value) {
    throw new Error(`${fieldName} must be a canonical ISO 8601 string.`);
  }

  return value;
}

function validateMode(mode) {
  if (!VALIDATION_MODES.includes(mode)) {
    throw new Error(`Validation mode is invalid: ${String(mode)}.`);
  }

  return mode;
}

function createValidationResult(input) {
  if (!isPlainObject(input)) {
    throw new Error("Validation result input must be a plain object.");
  }

  const id = normalizeRequiredString(input.id, "id");
  const category = normalizeRequiredString(input.category, "category");

  if (!isValidationStatus(input.status)) {
    throw new Error(
      `Validation result status is invalid: ${String(input.status)}.`
    );
  }

  if (typeof input.blocking !== "boolean") {
    throw new Error("Validation result blocking must be a boolean.");
  }

  const message = normalizeRequiredString(input.message, "message");

  if (!isPlainObject(input.evidence)) {
    throw new Error("Validation result evidence must be a plain object.");
  }

  const executedAt = validateCanonicalIsoString(
    input.executedAt,
    "Validation result executedAt"
  );
  const justification = normalizeOptionalString(input.justification);

  if (input.status === "skipped" && justification === null) {
    throw new Error("Skipped validation requires a justification.");
  }

  return Object.freeze({
    id,
    category,
    status: input.status,
    blocking: input.blocking,
    message,
    evidence: input.evidence,
    executedAt,
    justification,
  });
}

function normalizeValidationResults(results) {
  if (!Array.isArray(results)) {
    throw new Error("Validation results must be an array.");
  }

  const normalizedResults = [];
  const ids = new Set();

  for (const input of results) {
    const result = createValidationResult(input);

    if (ids.has(result.id)) {
      throw new Error(`Duplicate validation result id: ${result.id}.`);
    }

    ids.add(result.id);
    normalizedResults.push(result);
  }

  return normalizedResults;
}

function classifyNormalizedResults(results) {
  const blockingFailures = [];
  const warnings = [];
  const pendingValidations = [];
  const passedValidations = [];
  const skippedValidations = [];
  const notApplicableValidations = [];

  for (const result of results) {
    if (result.status === "failed") {
      if (result.blocking) {
        blockingFailures.push(result);
      } else {
        warnings.push(result);
      }
    } else if (result.status === "pending") {
      pendingValidations.push(result);
    } else if (result.status === "passed") {
      passedValidations.push(result);
    } else if (result.status === "skipped") {
      skippedValidations.push(result);
    } else if (result.status === "not_applicable") {
      notApplicableValidations.push(result);
    }
  }

  return {
    blockingFailures,
    warnings,
    pendingValidations,
    passedValidations,
    skippedValidations,
    notApplicableValidations,
  };
}

function freezeClassification(classification) {
  return Object.freeze({
    blockingFailures: Object.freeze([...classification.blockingFailures]),
    warnings: Object.freeze([...classification.warnings]),
    pendingValidations: Object.freeze([...classification.pendingValidations]),
    passedValidations: Object.freeze([...classification.passedValidations]),
    skippedValidations: Object.freeze([...classification.skippedValidations]),
    notApplicableValidations: Object.freeze([
      ...classification.notApplicableValidations,
    ]),
  });
}

function classifyValidationResults(results) {
  const normalizedResults = normalizeValidationResults(results);
  return freezeClassification(classifyNormalizedResults(normalizedResults));
}

function deriveOverallStatusFromNormalized(results, mode) {
  validateMode(mode);

  const classification = classifyNormalizedResults(results);

  if (classification.blockingFailures.length > 0) {
    return "failed";
  }

  if (classification.pendingValidations.length > 0) {
    return "pending";
  }

  if (
    mode === "final" &&
    classification.skippedValidations.some((result) => result.blocking)
  ) {
    return "pending";
  }

  return "passed";
}

function deriveOverallStatus(results, mode) {
  const normalizedResults = normalizeValidationResults(results);
  return deriveOverallStatusFromNormalized(normalizedResults, mode);
}

function createValidationSummary(options) {
  if (!isPlainObject(options)) {
    throw new Error("Validation summary options must be a plain object.");
  }

  const mode = validateMode(options.mode);
  const startedAt = validateCanonicalIsoString(
    options.startedAt,
    "Validation summary startedAt"
  );
  const completedAt = validateCanonicalIsoString(
    options.completedAt,
    "Validation summary completedAt"
  );

  if (new Date(completedAt).getTime() < new Date(startedAt).getTime()) {
    throw new Error(
      "Validation summary completedAt cannot be earlier than startedAt."
    );
  }

  const results = normalizeValidationResults(options.results);
  const classification = classifyNormalizedResults(results);
  const overallStatus = deriveOverallStatusFromNormalized(results, mode);

  const totals = Object.freeze({
    all: results.length,
    passed: classification.passedValidations.length,
    failed:
      classification.blockingFailures.length + classification.warnings.length,
    pending: classification.pendingValidations.length,
    skipped: classification.skippedValidations.length,
    notApplicable: classification.notApplicableValidations.length,
    blockingFailures: classification.blockingFailures.length,
    warnings: classification.warnings.length,
  });

  return Object.freeze({
    mode,
    overallStatus,
    startedAt,
    completedAt,
    totals,
    results: Object.freeze([...results]),
    blockingFailures: Object.freeze([...classification.blockingFailures]),
    warnings: Object.freeze([...classification.warnings]),
    pendingValidations: Object.freeze([
      ...classification.pendingValidations,
    ]),
  });
}

module.exports = Object.freeze({
  VALIDATION_STATUSES,
  isValidationStatus,
  createValidationResult,
  classifyValidationResults,
  deriveOverallStatus,
  createValidationSummary,
});
