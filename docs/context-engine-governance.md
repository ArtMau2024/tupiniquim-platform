# Governança do Context Engine

## Fonte de verdade

A conversa não é armazenamento permanente. Decisões aprovadas devem ser registradas em arquivos versionados, validadas, incorporadas ao Context Engine e enviadas ao GitHub.

## Destinos

- `site-context/decision-memory.json`: decisões aprovadas, contexto, motivo, impactos, regras e critérios de retomada.
- `contextEngine.roadmap`: sequência dos épicos do produto.
- `contextEngine.technicalRoadmap`: estado da evolução técnica.
- `contextEngine.architectureDecisions`: restrições arquiteturais permanentes.
- `docs/`: procedimentos e explicações operacionais.

## Ciclo obrigatório

1. Classificar a informação como decisão, ADR, roadmap, regra operacional ou pendência.
2. Persistir no arquivo canônico apropriado.
3. Validar a estrutura.
4. Executar `npm run context:update`.
5. Conferir o mapa oficial.
6. Testar e executar o build.
7. Versionar junto da implementação relacionada.

## Comandos

```cmd
npm run context:decision:add -- caminho\decisao.json
npm run context:decision:validate
npm run context:decision:list
```

## Substituição de decisões

Decisões não são editadas silenciosamente. Uma nova decisão deve referenciar os IDs substituídos em `supersedes`. IDs duplicados são rejeitados.

## Protocolo operacional dos agentes

O metodo D0-R0-R1-R2-R3, a clareza decisoria, a formatacao de respostas e a materializacao imediata de regras sao definidos em `docs/method-of-operation.md` e `site-context/registry/rules/RULESET-HARNESS-QUALITY.json`. Regras potenciais devem ser apresentadas a Arthur para aprovacao e, quando aprovadas, persistidas imediatamente; nao devem ficar acumuladas apenas no chat.

## Sincronizacao atomica de mudanca arquitetural
Quando uma decisao arquitetural supersede o modelo anterior, Decision Memory, plano ativo, Project Registry, Ruleset, ADR Registry, Conflict Register, metodo e governanca devem ser sincronizados antes da implementacao funcional. A realidade fisica atual pode permanecer ativa durante a transicao, mas nao autoriza modelos a trata-la como destino aprovado. No CMS atual, artigos CMS seguem `CMS -> cms_posts no D1 -> catalogo publico hibrido -> Blog`; artigos MDX seguem `GitHub/content/posts -> build -> catalogo hibrido -> Blog`. `cms_drafts` permanece preservada como legado, mas nao representa o fluxo principal da P1. Fontes canonicas sao atualizadas e validadas primeiro; derivados oficiais sao regenerados por ultimo e nunca editados manualmente.

## Fechamento da P1 e derivados
A P1 funcional do CMS foi concluida. O EPIC-004 e o plano editorial permanecem ativos em `awaiting_next_authorization`, sem tarefa funcional iniciada. Decision Memory e registries canonicos sao atualizados primeiro; Project Map, Source Registry, Ancora e demais derivados so podem ser regenerados depois da validacao dos canônicos e nunca devem ser editados manualmente. Derivado degradado nao pode ser promovido.
