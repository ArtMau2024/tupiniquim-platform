"use strict";
const STOPWORDS = new Set(["a","as","o","os","um","uma","de","da","das","do","dos","e","em","no","nos","na","nas","para","por","com","sem","que","qual","quais","como","onde","me","meu","minha","the","and","or","to","of","in","is","esta","estao","estar","fica","ficam"]);
function normalize(value) {
  return String(value || "").toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9_/@.-]+/g, " ").trim();
}
function tokenize(value) {
  return [...new Set(normalize(value).split(/\s+/).filter(token => token.length > 1 && !STOPWORDS.has(token)))];
}
function termFrequency(text, term) {
  let count = 0;
  let index = 0;
  while ((index = text.indexOf(term, index)) !== -1) { count += 1; index += term.length; }
  return count;
}
function searchContext(index, query, options = {}) {
  const limit = Math.max(1, Math.min(Number(options.limit) || 5, 20));
  const terms = tokenize(query);
  if (!terms.length) return [];
  const chunks = Array.isArray(index.chunks) ? index.chunks : [];
  const documentFrequency = new Map();
  for (const term of terms) documentFrequency.set(term, chunks.filter(chunk => normalize(`${chunk.sourcePath} ${chunk.content}`).includes(term)).length);
  const results = [];
  for (const chunk of chunks) {
    const content = normalize(chunk.content);
    const sourcePath = normalize(chunk.sourcePath);
    let score = 0;
    const matchedTerms = [];
    for (const term of terms) {
      const frequency = termFrequency(content, term);
      const pathHit = sourcePath.includes(term) ? 1 : 0;
      if (!frequency && !pathHit) continue;
      matchedTerms.push(term);
      const inverseFrequency = Math.log((chunks.length + 1) / ((documentFrequency.get(term) || 0) + 1)) + 1;
      score += Math.min(frequency, 6) * inverseFrequency;
      score += pathHit * 5 * inverseFrequency;
    }
    if (!matchedTerms.length) continue;
    score += (matchedTerms.length / terms.length) * 8;
    if (matchedTerms.length === terms.length) score += 10;
    results.push({
      id: chunk.id,
      score: Number(score.toFixed(6)),
      matchedTerms: matchedTerms.sort(),
      sourcePath: chunk.sourcePath,
      startLine: chunk.startLine,
      endLine: chunk.endLine,
      language: chunk.language,
      category: chunk.category,
      content: chunk.content
    });
  }
  const sorted = results.sort((a, b) => b.score - a.score || a.sourcePath.localeCompare(b.sourcePath) || a.startLine - b.startLine);
  const selected = [];
  const perFile = new Map();
  for (const result of sorted) {
    const count = perFile.get(result.sourcePath) || 0;
    if (count >= 1) continue;
    selected.push(result);
    perFile.set(result.sourcePath, count + 1);
    if (selected.length >= limit) break;
  }
  if (selected.length < limit) {
    for (const result of sorted) {
      if (selected.some(item => item.id === result.id)) continue;
      selected.push(result);
      if (selected.length >= limit) break;
    }
  }
  return selected;
}
module.exports = { normalize, tokenize, searchContext };
