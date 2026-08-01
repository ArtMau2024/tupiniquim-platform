# Metodo de Atuacao do Harness

## Objetivo
Garantir que qualquer agente trabalhe com continuidade, clareza decisoria e evidencias persistidas fora do chat.

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
