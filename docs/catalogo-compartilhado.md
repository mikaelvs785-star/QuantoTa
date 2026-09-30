# Catálogo compartilhado e permissões

Produtos e mercados agora são seções de `/catalogo`, com os mesmos componentes para público, consumidor, vendedor e administrador. As listagens separadas foram removidas. `/dashboard`, `/lista` e `/conta` substituem endereços por perfil; links antigos são somente redirecionamentos.

`GET /catalogo/permissoes` informa as ações disponíveis. O frontend usa essa resposta para exibir controles e proteger formulários. `CatalogoPermissaoService` também valida alterações nos serviços Java: esconder botões não é a proteção da API.

| Perfil | Produtos | Mercados |
|---|---|---|
| Público / USER | Consultar e comparar | Consultar |
| VENDEDOR | Consultar e comparar | Criar e editar os próprios mercados ativos |
| ADMIN | Criar, editar, desativar e reativar | Gerenciar todos, atribuir responsável e transferir vínculo |

Ao criar um mercado, o vendedor autenticado é o responsável, mesmo se o corpo fornecer outro ID. Vendedores não podem transferir vínculo, desativar ou reativar mercados. Produtos e gestão de preços continuam com ADMIN; cadastro e aprovação de vendedores não foram incluídos.

A coluna nullable `mercados.vendedor_id` é adicionada pelo `ddl-auto=update` já usado em desenvolvimento. Em instalações com validação de schema, aplicar `ALTER TABLE mercados ADD COLUMN IF NOT EXISTS vendedor_id BIGINT;` antes de iniciar a versão nova. Mercados antigos não recebem donos presumidos: o admin seleciona um vendedor ativo no formulário.

Caches de catálogo consideram a identidade da sessão e são limpos ao entrar ou sair. Criação, edição e desativação de mercados atualizam as permissões para evitar controles desatualizados após uma atribuição.

Validação: build e lint do frontend, quatro testes de preços e seis testes de integração da API com H2 isolado. O teste de permissões cobre tentativa de sobrescrever ID existente, vínculo forjado, edição entre vendedores, desativação indevida, transferência e vínculo inválido. Nenhum banco remoto foi alterado durante as verificações.

A navegação foi verificada em Chromium com API local: redirecionamentos com parâmetros e fragmentos, edição de produtos, atribuição de vendedor, criação e edição de mercado próprio, bloqueio entre vendedores, cadastro/login de consumidor, comparação e lista persistida. A captura móvel também verificou tema escuro e ausência de conteúdo fora da largura da página. O CLI agent-browser não iniciou neste ambiente; a execução no navegador usou Playwright como alternativa.

Capturas com dados fictícios de teste: [catálogo público](screenshots/catalogo-publico-desktop.png), [catálogo do vendedor](screenshots/catalogo-vendedor-desktop.png) e [celular em tema escuro](screenshots/catalogo-mobile-escuro.png).
