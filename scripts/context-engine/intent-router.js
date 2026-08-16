"use strict";
function normalize(v){return String(v||"").toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function classifyIntent(question){
 const q=normalize(question);
 if(/postar.*artigo|publicar.*artigo|adicionar.*artigo|criar.*(?:novo )?artigo|usar.*importador|txt.*mdx|mdx.*txt|mvp.*cms|fluxo editorial local/.test(q))return"editorial_operation";
 if(/projeto.*execucao|projeto.*atual|fase atual|tarefa atual|projetos?.*pausad|retomar.*inventario|estado.*harness|transicao.*harness|antes.*inventario|proxima fase/.test(q))return"project_continuity";
 if(/context engine|motor de contexto|evolucao tecnica|evoluir.*context/.test(q))return"context_engine_roadmap";
 if(/risco|divida|debito|saude arquitet/.test(q))return"technical_risk";
 if(/decis|adr|restric.*arquitet/.test(q))return"architecture_decision";
 if(/proximo passo|proximo epico|roadmap|status do projeto|andamento do projeto/.test(q))return"product_roadmap";
 return"code_search";
}
module.exports={classifyIntent,normalize};
