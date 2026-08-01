# Plano do Harness de Continuidade e Anchor Engine MVP

## Identificação

- **ID:** `PLAN-ANCHOR-MVP`
- **Projeto:** `PRJ-CONTINUITY-HARNESS`
- **Status inicial:** `planned`
- **Prioridade:** `critical`
- **Decisão relacionada:** `DEC-2026-ANCHOR-HARNESS-FIRST`

## Objetivo

Permitir que qualquer conversa ou agente recupere e aprofunde o contexto correto do projeto sem depender do histórico do chat.

## Motivação

- Reduzir reconstruções de contexto.
- Evitar perda de decisões, regras, histórico e planejamento detalhado.
- Diminuir retrabalho e risco de regressão.
- Preparar o desenvolvimento do CMS sobre uma governança aderente à realidade.

## Escopo

- Matriz de Migração do patrimônio histórico.
- Registro de projetos, fases, planos, fluxos e regras.
- anchor.json com cinco blocos conceituais.
- anchor-history.json com cadeia de gerações.
- Gerador transacional da Âncora.
- Validador de schema, cobertura, referências e freshness.
- Non Regression Guard básico.
- context:bootstrap com profundidade progressiva.
- context:resolve para referências estáveis.
- context:handoff para transição entre conversas.
- Teste de retomada em conversa nova.

## Fora do escopo

- Interface gráfica de governança.
- Banco de dados para o harness.
- Embeddings ou banco vetorial.
- Agentes autônomos.
- Dashboard sofisticado.
- Reconstrução inventada de conteúdo histórico perdido.
- Automação sem relação direta com continuidade.

## Fases

### PHASE-ANCHOR-01-INVENTORY - Inventário e Matriz de Migração

**Objetivo:** Classificar patrimônio confirmado, histórico, planejado, conflitante, incompleto e não comprovado.

**Entregáveis:**
- migration-matrix.json
- conflict-register.json
- source-registry.json

**Critérios de aceite:**
- Cada item possui origem e evidência.
- Cada item possui destino canônico.
- Conflitos não são resolvidos automaticamente.
- Conteúdo perdido permanece registrado como lacuna.

### PHASE-ANCHOR-02-REGISTRIES - Registros Canônicos

**Objetivo:** Persistir projetos, fases, planos, regras, método, histórico, marcos e lacunas nos destinos corretos.

**Entregáveis:**
- projects.json
- phases.json
- plans.json
- rules.json
- project-history.md
- method-of-operation.md
- adr-registry.md

**Critérios de aceite:**
- IDs estáveis e únicos.
- Referências resolvíveis.
- Estado atual separado de histórico e futuro.
- Regras 1 a 39 e Método M-001 a M-012 classificados.

### PHASE-ANCHOR-03-GENERATION - Geração Transacional da Âncora

**Objetivo:** Gerar uma projeção operacional sucinta sem perder as fontes detalhadas.

**Entregáveis:**
- anchor.json
- anchor-history.json
- generate-anchor.js

**Critérios de aceite:**
- Exatamente cinco blocos conceituais.
- Todo resumo possui referência aprofundável.
- Geração em staging e promoção atômica.
- Histórico encadeado por hashes.

### PHASE-ANCHOR-04-VALIDATION - Validação e Não Regressão

**Objetivo:** Bloquear perda silenciosa de patrimônio e fontes dessincronizadas.

**Entregáveis:**
- validate-anchor.js
- non-regression-guard.js
- anchor schema
- testes automatizados

**Critérios de aceite:**
- Schema e hashes válidos.
- EPICs, regras, ADRs, commits, marcos e decisões confirmadas não desaparecem.
- Remoções exigem decisão ou justificativa explícita.
- Freshness validada contra as fontes.

### PHASE-ANCHOR-05-BOOTSTRAP - Bootstrap e Handoff

**Objetivo:** Permitir retomada fluida por qualquer agente ou conversa.

**Entregáveis:**
- context:bootstrap
- context:resolve
- context:handoff
- teste de nova conversa

**Critérios de aceite:**
- Bootstrap rápido retorna os cinco blocos e referências.
- Bootstrap planning retorna plano, fases, riscos e critérios.
- Bootstrap full retorna regras, método, histórico, lacunas e conflitos relevantes.
- Uma conversa sem histórico identifica corretamente prioridade, bloqueios e próxima etapa.

## Riscos

### RISK-ANCHOR-001

- **Risco:** O Harness se transformar em uma frente infinita e adiar o CMS indefinidamente.
- **Mitigação:** Restringir o MVP ao inventário, registros, geração, validação, bootstrap e teste de continuidade.

### RISK-ANCHOR-002

- **Risco:** Migrar conteúdo histórico conflitante como verdade atual.
- **Mitigação:** Exigir classificação de evidência e decisão explícita de Arthur para conflitos.

### RISK-ANCHOR-003

- **Risco:** A Âncora resumida substituir os registros completos.
- **Mitigação:** Bloquear itens resumidos sem referências aprofundáveis.

## Critérios globais de conclusão

- A Âncora oficial é gerada pelo projeto e não depende do chat.
- Planejamentos detalhados permanecem consultáveis por referências estáveis.
- Decision Memory, Baseline, Método, Catálogo e Project Map mantêm responsabilidades distintas.
- O Non Regression Guard impede perda silenciosa de patrimônio confirmado.
- Uma nova conversa retoma o projeto sem reconstrução manual extensa.
- O CMS é liberado após aprovação do teste de continuidade do MVP.

## Fontes de migração

- `ÂNCORA PERMANENTE DO PROJETO.docx`
- `BASELINE.docx`
- `baseline.md`
- `site-context/project-map.json`
- `site-context/decision-memory.json`
- `docs/context-engine-governance.md`
