# Transicao do Context Engine V2 para o V3

## Classificacao

A V2 foi uma proposta parcial de evolucao do gerador do Project Map. A proposta introduziu schemaVersion 2.0.0 e detectores iniciais de divida tecnica, mas nao constituiu um gerador completo e executavel.

## Capacidades absorvidas pelo V3

- schemaVersion evoluiu para 3.1.0.
- detectTechnicalDebt foi consolidado em scripts/context-engine/technical-debt.js.
- DT-001 a DT-004 foram incorporados com detectores, evidencias, arquivos e versao.
- DT-005 foi acrescentado posteriormente.
- enrich-staged-context.js passou a integrar divida tecnica, saude arquitetural e AI Context ao mapa em staging.
- validacao por schema, testes, promocao e rollback passaram a proteger a geracao oficial.

## Artefatos substituidos

- scripts/generate-project-map_v2.js: proposta absorvida e superada.
- diff-project-map.txt: diff derivado entre o gerador antigo e a proposta V2.

## Decisao de preservacao

O valor historico foi consolidado neste documento. Os artefatos brutos foram removidos para evitar ambiguidade operacional e contaminacao da busca contextual. A implementacao vigente permanece no Context Engine V3 e em seus testes.
