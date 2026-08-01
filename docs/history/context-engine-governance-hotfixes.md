# Evolucao da governanca do Context Engine

## Integracao da Decision Memory no V3

O gerador V3 passou a ler site-context/decision-memory.json e incorporar um snapshot da memoria ao bloco contextEngine. O backup pre-governance-lote8 representa o estado anterior a essa integracao.

## Governanca completa da Decision Memory

O modulo atual valida o contrato completo das decisoes, listas obrigatorias, IDs unicos e referencias supersedes. Tambem oferece os comandos add, list e validate com escrita atomica.

## Hotfix de importacao segura

O modulo atual utiliza require.main === module para impedir execucao do CLI durante importacao e exporta validateDecision e validate para testes e integracoes.

## Classificacao dos backups

- generate-project-map-v3.js.pre-governance-lote8.bak: anterior a incorporacao da Decision Memory no mapa.
- decision-memory.js.pre-governance-lote8.bak: anterior ao contrato completo de governanca.
- decision-memory.js.pre-import-safety-hotfix.bak: anterior a protecao de importacao segura.

## Decisao de preservacao

As correcoes estao incorporadas nas versoes operacionais e cobertas pela suite de testes. O valor historico foi consolidado neste documento e os backups brutos foram removidos para evitar ambiguidade e contaminacao contextual.
