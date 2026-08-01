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
