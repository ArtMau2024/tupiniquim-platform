# ADR Registry

## Purpose
Preserve the confirmed existence and approval of historical ADRs without inventing lost content.

## Evidence policy
For ADR-001 through ADR-009, the Baseline confirms existence and approval. Titles, context, decision, rationale, alternatives, dates, authors and consequences were not recovered. These gaps remain explicit.

| ID | Evidence status | Historical approval | Recovered content | Lost content | Dependencies | Baseline impact |
|---|---|---|---|---|---|---|
| ADR-001 | incomplete | confirmed | Identifier, existence and approval | Original decision and detailed fields | unknown | Preserve gap; do not infer |
| ADR-002 | incomplete | confirmed | Identifier, existence and approval | Original decision and detailed fields | unknown | Preserve gap; do not infer |
| ADR-003 | incomplete | confirmed | Identifier, existence and approval | Original decision and detailed fields | unknown | Preserve gap; do not infer |
| ADR-004 | incomplete | confirmed | Identifier, existence and approval | Original decision and detailed fields | unknown | Preserve gap; do not infer |
| ADR-005 | incomplete | confirmed | Identifier, existence and approval | Original decision and detailed fields | unknown | Preserve gap; do not infer |
| ADR-006 | incomplete | confirmed | Identifier, existence and approval | Original decision and detailed fields | unknown | Preserve gap; do not infer |
| ADR-007 | incomplete | confirmed | Identifier, existence and approval | Original decision and detailed fields | unknown | Preserve gap; do not infer |
| ADR-008 | incomplete | confirmed | Identifier, existence and approval | Original decision and detailed fields | unknown | Preserve gap; do not infer |
| ADR-009 | incomplete | confirmed | Identifier, existence and approval | Original decision and detailed fields | unknown | Preserve gap; do not infer |

## Rule
No entry may be promoted to reconstructed or resolved without new direct evidence and a formal decision.

## ADR-010 - Adotar D1 como fonte publica final e publicacao direta pelo CMS

**Status:** accepted
**Data:** 2026-08-16
**Decision Ref:** DEC-2026-EDITORIAL-CMS-DIRECT-PUBLISHING

### 1. Contexto
O CMS administra rascunhos no D1, mas o Blog publico ainda consome MDX incorporado ao bundle.

### 2. Problema
O fluxo por MDX, catalogo, Git, build e deploy nao entrega autonomia editorial pelo CMS.

### 3. Alternativas
1. Manter MDX e pipeline manual.
2. Automatizar MDX, build e deploy atras do CMS.
3. Manter MDX e D1 como fontes permanentes equivalentes.
4. Fazer transicao temporaria MDX + D1 e adotar D1 como fonte unica final.

### 4. Decisao
Adotar a alternativa 4: publicacao direta pelo D1, com coexistencia temporaria dos 12 artigos MDX.

### 5. Justificativa
Separa publicacao de conteudo da implantacao do sistema e entrega autonomia sem manter duas arquiteturas permanentes.

### 6. Consequencias positivas
Publicacao sem terminal, arquivos, Git, build ou deploy por postagem; fonte editorial unica ao final; rascunhos protegidos.

### 7. Riscos e consequencias negativas
Rotas publicas tornam-se dinamicas; disponibilidade e latencia do D1 passam a importar; a transicao exige deteccao de slug duplicado e degradacao segura para MDX.

### 8. Transicao
Corte 1 publica D1 e combina MDX + D1; Corte 2 adiciona atualizacao e retirada do ar; Corte 3 migra os 12 artigos e remove MDX do caminho publico principal.

### 9. Rollback
Preservar cms_drafts, manter os artigos MDX e preparar reversao do piloto de published para draft por ID antes da primeira publicacao remota.

### 10. Estado de implementacao
A P1 comprovou em producao criacao, atualizacao, publicacao, retirada e republicacao direta via D1. O catalogo permanece hibrido durante a transicao e os artigos MDX continuam preservados como legado. A proxima atuacao do EPIC-004 depende de autorizacao explicita.
