# MVP operacional do CMS editorial

## Estado atual
O painel persiste rascunhos reais no D1. O MDX permanece como projecao publica atual, e `lib/generated-posts.ts` permanece como catalogo derivado. D1 ainda nao substitui diretamente a fonte publica MDX.

## Fluxo atual pelo painel
`Rascunho D1 -> gerar MDX local -> gerar catalogo local -> validar Blog e builds -> Aguardando Git -> push manual -> Cloudflare manual`

1. Crie, salve, recupere e edite o rascunho no painel.
2. Valide metadados; a autoria padrao e Greyce, salvo instrucao explicita diferente de Arthur.
3. Gere o MDX local por acao administrativa explicita. A acao e bloqueada em producao e nao sobrescreve MDX existente.
4. Gere o catalogo por acao separada, com lock, timeout, backup transacional e rollback.
5. Valide Blog, Next.js e OpenNext. Build local nao equivale a publicacao.
6. Git, push e Cloudflare permanecem manuais.

## Fluxo TXT preservado
`content/inbox/*.txt -> scripts/import-article.js -> content/posts/*.mdx -> scripts/generate-posts.js -> lib/generated-posts.ts`

O TXT recebido permanece como fonte bruta. O importador multipadrao continua valido e deve preservar frontmatter, UTF-8 sem BOM e as normalizacoes editoriais existentes.

## Backups e artefatos
Backups locais sao obrigatorios antes de substituir MDX, mas nao sao fontes canonicas, nao entram no Git e ficam fora do indice semantico. Depois da validacao, backups podem ser movidos para quarentena externa com caminho, tamanho e SHA-256 preservados. `site-context/.generation-tmp/` e transacional.

## Limites
Nao existe dupla escrita permanente entre D1 e MDX. O catalogo nao e editado manualmente. Conteudo piloto nao segue para producao; o rascunho piloto D1 permanece ate decisao administrativa separada.
