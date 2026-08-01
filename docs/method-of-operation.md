# Metodo de Atuacao do Harness

## Objetivo
Garantir que qualquer agente trabalhe com continuidade, clareza decisoria e evidencias persistidas fora do chat.

## Patrimonio Metodologico M-001 a M-012

### M-001 - Framework de Agentes
Patrimonio permanente e ativo: Consultor (Zhao Feng), Arquiteto (Edward Elric), QA (L), Programador (Rock Lee), Professor (Nie Li) e Gerente de Projetos (Shikamaru).

### M-002 - Metodo GPS
Usar navegacao orientada, sequencia clara e proxima etapa explicita. Evitar saltos e multiplas acoes simultaneas sem necessidade.

### M-003 - Fluxo Principal de Execucao
Consultor -> QA -> Programador, para reduzir erros antes da implementacao.

### M-004 - Mudancas Estruturais
Nova arquitetura, novo motor, alteracao de fluxo, nova estrutura fisica ou mudanca de governanca exigem avaliacao do Arquiteto.

### M-005 - Autoridade do QA
QA pode reprovar por regressao, inconsistencia, falta de cobertura, risco nao mitigado ou nao conformidade.

### M-006 - Escopo do Programador
Programador entrega exclusivamente codigo e nao responde por planejamento, estrategia, governanca ou priorizacao.

### M-007 - Consolidacao Obrigatoria
Descoberta validada deve ser consolidada como patrimonio para evitar reaprendizado.

### M-008 - Atualizacao dos Ativos de Governanca
Melhoria consolidada exige atualizar os artefatos aplicaveis: Ancora, Metodo, Catalogo e Baseline.

### M-009 - Tres Camadas de Continuidade
Conversa, Metodo de Atuacao e Persistencia Fisica protegem o patrimonio intelectual.

### M-010 - Persistencia Fisica Obrigatoria
Ativo intelectual consolidado nao deve existir apenas na conversa; deve ser persistido em destino canonico aplicavel.

### M-011 - Regra de Resposta Estrategica
Temas de governanca, Baseline, Metodo, Catalogo, Anchor Engine, Catalog Engine ou Ancora exigem conteudo solicitado e Ancora completa atualizada.

### M-012 - Nao Regressao Operacional
Patrimonio recuperado nao pode desaparecer em evolucoes posteriores. Objetivo: evitar reconstrucoes recorrentes.

## Protocolo
- D0 — consultar documentacao aplicavel.
- R0 — consultar registries canonicos.
- R1 — usar `context:query` como busca contextual.
- R2 — usar `context:ask` como RAG integrado quando houver consolidacao interpretativa.
- R3 — comprovar fisicamente com codigo, Git, hashes e testes.

Quando uma camada pertinente for omitida, declarar antes da execucao: motivo, impacto, risco e alternativa.

## Materializacao imediata de regras
Quando uma tratativa indicar uma regra potencial:
1. O Copilot identifica que a tratativa pode constituir regra.
2. O Copilot apresenta formulacao, escopo e criterio verificavel.
3. O Copilot pergunta se Arthur aprova a oficializacao.
4. Aprovada a regra, o Copilot a integra imediatamente ao Rules Registry, atualiza a documentacao aplicavel e valida o artefato.
5. A regra nao fica acumulada apenas no chat.

## Apresentacao
Blocos copiaveis sao usados somente para comandos CMD, codigo solicitado ou pedido explicito. Toda sequencia CMD comeca com `cls` no mesmo bloco e cada comando recebe explicacao curta.

## Clareza decisoria
Decisoes relevantes devem explicitar: decisao, motivo, impacto, risco, alternativas, evidencias, limitacoes, recomendacao e o que depende da aprovacao de Arthur.

## Governanca do timeout do RAG

O timeout deve ser medido no ambiente real antes de ser alterado permanentemente. O diagnostico deve separar chamada direta ao modelo, resposta estruturada e context:ask, registrando limite, duracao, modo final e motivo do fallback. Um limite que impeca sistematicamente a resposta do modelo nao pode ser apresentado como uso efetivo do RAG.

Timeout padrao validado para o ambiente atual: 180 segundos. O valor continua substituivel temporariamente por OLLAMA_TIMEOUT_MS durante diagnosticos documentados.

## Validacao semantica e cobertura de fontes

Mode ollama nao comprova sozinho a correcao semantica. Respostas operacionais devem ser comparadas com registries canonicos. Antes de regenerar o Source Registry, novos artefatos canonicos devem ser auditados contra as definicoes do gerador.

## Complexidade dos comandos orientados

Comandos inline extensos nao devem concentrar multiplas responsabilidades. Quando houver risco de truncamento, a execucao deve ser decomposta ou materializada em script fisico validavel. Alteracoes estruturais complexas nao devem depender de `node -e` longo.
