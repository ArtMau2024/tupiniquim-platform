# Roadmap de Evolução Tecnológica e de Produto (2026) — Plataforma Tupiniquim

Este documento detalha o planejamento estratégico de engenharia e produto para a plataforma Tupiniquim, estruturado em **Objetivos**, **Épicos** e **Tarefas** acionáveis para os horizontes de 30, 60 e 90 dias.

---

## Visão Geral dos Objetivos (OKRs)

### [OBJ-1] Estabilização, Segurança e Robustez (Horizonte: 30 Dias)
*   **Meta:** Eliminar riscos de segurança (XSS), remover redundâncias de código e garantir que 100% dos posts publicados passem por validação automatizada de metadados antes de irem para produção.

### [OBJ-2] Padronização Visual e Qualidade de Código (Horizonte: 60 Dias)
*   **Meta:** Unificar a linguagem visual do projeto utilizando Tailwind CSS puro, remover estilos inline/tags `<style>` e estabelecer uma suíte de testes automatizados para os fluxos críticos.

### [OBJ-3] Escalabilidade, Performance e SEO Avançado (Horizonte: 90 Dias)
*   **Meta:** Otimizar o tempo de build e o consumo de memória no Edge da Cloudflare, implementar paginação/busca e garantir pontuação máxima (95+) no Google Lighthouse.

---

## Épicos e Tarefas

### ÉPICO 1: Segurança do Parser de Conteúdo e Limpeza de Código Morto
*   **Objetivo Associado:** [OBJ-1] (0 a 30 dias)
*   **Descrição:** Substituição do parser manual baseado em expressões regulares por uma solução robusta de mercado e eliminação de arquivos legados que causam confusão arquitetural.

#### Tarefas:
- [ ] **TSK-1.1: Remoção do arquivo legado `lib/posts.ts`**
    *   *Descrição:* Excluir o arquivo `lib/posts.ts` que utiliza a biblioteca `fs` em tempo de execução, garantindo que nenhum componente tente importá-lo acidentalmente no ambiente Edge.
    *   *Critério de Aceitação:* Arquivo deletado e build executado com sucesso sem referências órfãs.
- [ ] **TSK-1.2: Migração do Parser de Markdown para biblioteca consolidada**
    *   *Descrição:* Substituir as funções `safeHtml`, `inlineMd` e `markdownToHtml` em `app/blog/[slug]/page.tsx` por um parser seguro e homologado (ex: `next-mdx-remote` ou `marked` combinado com `dompurify`/`sanitize-html`).
    *   *Critério de Aceitação:* Renderização idêntica dos posts atuais, suporte nativo a tabelas, listas aninhadas e eliminação completa de vulnerabilidades de injeção de scripts (XSS).
- [ ] **TSK-1.3: Implementação de Syntax Highlighting para blocos de código**
    *   *Descrição:* Adicionar suporte a realce de sintaxe nos blocos de código dos artigos do blog (utilizando bibliotecas leves como `prismjs` ou `shiki` integradas ao novo parser).
    *   *Critério de Aceitação:* Blocos de código nos posts renderizados com cores apropriadas para cada linguagem de programação.

---

### ÉPICO 2: Validação de Dados e Integridade de Conteúdo (Frontmatter)
*   **Objetivo Associado:** [OBJ-1] (0 a 30 dias)
*   **Descrição:** Criação de uma camada de validação estrita para os metadados dos arquivos MDX para evitar que erros de digitação ou ausência de campos quebrem o build ou a interface.

#### Tarefas:
- [ ] **TSK-2.1: Integração da biblioteca Zod para validação de Schemas**
    *   *Descrição:* Instalar e configurar o `zod` no projeto para validar a estrutura do Frontmatter de cada post durante a compilação.
    *   *Critério de Aceitação:* Schema definido contendo campos obrigatórios (`title`, `date`, `description`, `category`) e opcionais (`author`, `image`).
- [ ] **TSK-2.2: Refatoração do script `scripts/generate-posts.js`**
    *   *Descrição:* Atualizar o script de geração de posts para aplicar o schema do Zod em cada arquivo MDX lido. O script deve lançar um erro claro e interromper o build caso algum post esteja inválido.
    *   *Critério de Aceitação:* Execução de `npm run build` falha intencionalmente se um arquivo MDX de teste estiver sem o campo `title` ou com formato de data inválido.

---

### ÉPICO 3: Refatoração de UI/UX e Padronização com Tailwind CSS
*   **Objetivo Associado:** [OBJ-2] (30 a 60 dias)
*   **Descrição:** Eliminação de estilos inline e tags `<style>` nos arquivos `app/page.tsx`, `app/blog/page.tsx` e `app/blog/[slug]/page.tsx`, migrando toda a estilização para classes utilitárias do Tailwind CSS.

#### Tarefas:
- [ ] **TSK-3.1: Configuração e Padronização do Tailwind CSS**
    *   *Descrição:* Garantir que o arquivo `tailwind.config.ts` (ou js) esteja configurado com a paleta de cores oficial da Tupiniquim (tons de verde, amarelo e cinza escuro).
    *   *Critério de Aceitação:* Configuração de tema estendida com as cores institucionais.
- [ ] **TSK-3.2: Refatoração da Landing Page (`app/page.tsx`)**
    *   *Descrição:* Substituir a tag `<style>` por classes utilitárias do Tailwind CSS, mantendo a responsividade e o design original.
    *   *Critério de Aceitação:* Página inicial renderizada perfeitamente em dispositivos móveis e desktops sem uso de CSS customizado no componente.
- [ ] **TSK-3.3: Refatoração das Páginas do Blog**
    *   *Descrição:* Migrar a listagem (`app/blog/page.tsx`) e a página do artigo (`app/blog/[slug]/page.tsx`) para Tailwind CSS.
    *   *Critério de Aceitação:* Estilos de parágrafos, títulos, blockquotes e listas do artigo controlados via classes utilitárias (utilizando o plugin `@tailwindcss/typography` se aplicável).

---

### ÉPICO 4: Garantia de Qualidade e Testes Automatizados
*   **Objetivo Associado:** [OBJ-2] (30 a 60 dias)
*   **Descrição:** Implementação de testes automatizados para garantir que alterações futuras não quebrem o parser de conteúdo ou o fluxo de geração de posts.

#### Tarefas:
- [ ] **TSK-4.1: Configuração do Jest ou Vitest**
    *   *Descrição:* Instalar e configurar um framework de testes unitários leve e compatível com TypeScript.
    *   *Critério de Aceitação:* Comando `npm run test` configurado e executando com sucesso.
- [ ] **TSK-4.2: Criação de testes unitários para o Parser de Markdown**
    *   *Descrição:* Escrever testes que validem a conversão correta de títulos, listas, links seguros e a rejeição de payloads maliciosos (XSS).
    *   *Critério de Aceitação:* Cobertura de testes de segurança de pelo menos 95% para as funções de renderização de texto.
- [ ] **TSK-4.3: Integração de testes no pipeline de CI/CD**
    *   *Descrição:* Configurar uma ação do GitHub Actions para rodar o linter e os testes automatizados a cada Pull Request.
    *   *Critério de Aceitação:* PRs bloqueados automaticamente se os testes falharem.

---

### ÉPICO 5: Escalabilidade de Conteúdo e Otimização de Performance no Edge
*   **Objetivo Associado:** [OBJ-3] (60 a 90 dias)
*   **Descrição:** Preparação da plataforma para suportar centenas de posts sem estourar os limites de memória do Cloudflare Worker e melhoria da experiência de navegação.

#### Tarefas:
- [ ] **TSK-5.1: Implementação de Paginação na listagem do Blog**
    *   *Descrição:* Adicionar paginação lógica na página `app/blog/page.tsx` para evitar renderizar todos os posts de uma única vez.
    *   *Critério de Aceitação:* Exibição de no máximo 10 posts por página, com botões de navegação "Anterior" e "Próximo".
- [ ] **TSK-5.2: Mecanismo de Busca Estática**
    *   *Descrição:* Criar um campo de busca simples por título ou descrição na página do blog, filtrando os posts em tempo real no lado do cliente.
    *   *Critério de Aceitação:* Filtro instantâneo altamente performático sem requisições adicionais ao servidor.
- [ ] **TSK-5.3: Otimização de Imagens e Cache no Edge**
    *   *Descrição:* Configurar políticas estritas de cache para imagens e assets estáticos no arquivo `open-next.config.ts` e `wrangler.jsonc`.
    *   *Critério de Aceitação:* Imagens servidas com cabeçalhos `Cache-Control` de longa duração diretamente da rede de borda da Cloudflare.
