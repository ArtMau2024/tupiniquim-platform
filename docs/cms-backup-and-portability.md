# Backup e portabilidade do CMS
Backups reais ficam fora do Git. Scripts, migrations e documentação ficam no repositório.
A exportação de produção só pode ocorrer em gate remoto autorizado. A restauração deve usar banco temporário ou ambiente não produtivo, nunca o banco principal.
Para trocar de provedor, implemente `PostRepository` para o novo banco e mantenha domínio, serviço e páginas independentes do D1.
