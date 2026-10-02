# Repaginação do QuantoTá — 30/09/2026

## Problema e resultado

O projeto misturava consultas reais com dados inventados, ações sem efeito e formulários que enviavam campos descartados pela API. A nova experiência concentra o trabalho em pesquisar um produto, comparar seus preços e salvar uma lista. O catálogo fica em uma área administrativa.

## Alterações

| Antes | Depois |
|---|---|
| Economia, notificações, avaliações e distâncias inventadas | Exibição apenas de dados disponíveis; se não existem, há um estado vazio ou indisponível |
| Produto encontrado por nome nos preços | Associação por ID, com marca e unidade visíveis |
| Menor preço de todo o histórico | Último registro por produto/mercado; depois comparação dos preços atuais |
| Lista apenas em memória no navegador | Lista salva na API, vinculada ao usuário autenticado |
| Zero para produto sem preço | Item sem preço e subtotal explicitamente incompleto |
| Linhas duplicadas ao adicionar novamente | Quantidade acumulada no mesmo item |
| Qualquer usuário podia consultar listas de outras pessoas | Consulta e alterações limitadas ao dono no serviço |
| Formulários com imagem, CNPJ e outros campos não persistidos | Formulários coerentes com as entidades atuais |
| Botões de preços sem ação | Cadastro, edição e exclusão funcionais |
| Cadastro de vendedor que só imprimia dados | Cadastro de consumidor; fluxo de vendedor fora do MVP |
| Respostas de erro convertidas em 403 | Dispatcher de erro permitido para preservar 400, 404 e 409 |
| Conteúdo privado persistente no cache após sair | Cache de consultas limpo ao encerrar a sessão |
| Segredos padrão gravados no repositório | Senha de banco e chave JWT fornecidas pelo ambiente |

## Validações

- Frontend: build TypeScript/Vite e ESLint.
- Quatro testes das regras de comparação e cálculo monetário.
- Cinco testes de integração da API real com banco H2 temporário, incluindo isolamento entre contas e consulta com open-in-view desabilitado.
- Fluxos no navegador: início, busca pública, cadastro, login, retorno à ação original, lista após recarregar, produto sem preço, logout e criação administrativa de produto/preço.
- Layout em desktop e celular e tema escuro. Capturas usam dados locais de teste.

A compilação e os testes com H2 não validam a conexão com o PostgreSQL remoto, a configuração do deploy ou a carga esperada em produção. A senha e a chave JWT privadas precisam estar configuradas para iniciar a API após atualizar o código.

## Limpeza de rotas e arquivos

- Produtos e mercados usam apenas listagem e formulário de cadastro/edição; duas telas de detalhes redundantes foram removidas junto com seus componentes.
- Nomes de produtos levam diretamente à edição. Salvar retorna à listagem.
- As rotas administrativas compartilham o prefixo `/admin` e a mesma proteção. Os endereços de entrada `/admin` e `/cliente` abrem seus painéis.
- Endereços antigos continuam funcionando por redirecionamento. Os atalhos públicos de comparação e mercados preservam busca e fragmento e não passam pela exigência de login.
- Removidos seis arquivos sem importações, a função de perfil não utilizada e o campo de imagem que não era persistido.
- Removidos o README genérico do Vite, o modelo SQL apenas comentado e os inserts antigos com sintaxe MySQL e senhas sem hash.
- Instalação padronizada no lockfile npm do frontend, inclusive no Docker. A raiz mantém apenas scripts, sem dependências duplicadas.


## Todas as telas compartilhadas — 02/10/2026

O início, catálogo, comparação, preços, lista, conta, login/cadastro, usuários, formulários de produto/mercado e página de erro usam o mesmo layout. O dashboard separado e a página extra de cadastro de usuário foram removidos. Os endereços antigos continuam redirecionando com parâmetros e fragmentos.

A interface consulta `GET /permissoes` para mostrar ações e proteger a navegação; não decide acesso pelo perfil salvo no navegador. A API valida a sessão e a propriedade em cada alteração. O endpoint anterior `/catalogo/permissoes` é mantido como alias.

| Ação | Público | Consumidor | Vendedor | Administrador |
|---|---|---|---|---|
| Consultar catálogo, comparar e ver preços | Sim | Sim | Sim | Sim |
| Listas e conta própria | Login | Sim | Sim | Sim |
| Produtos | Consulta | Consulta | Consulta | Cadastro e edição |
| Mercados | Consulta | Consulta | Cadastro e edição dos próprios ativos | Gestão e atribuição |
| Preços | Consulta | Consulta | Cadastro, edição e exclusão nos próprios mercados ativos | Gestão completa |
| Contas de usuários | Não | Não | Não | Consulta e cadastro com perfil |

A edição de preços verifica o mercado original e o destino. Transferir ou desativar um mercado revoga o acesso do vendedor, inclusive com token já emitido. O cadastro público sempre cria consumidores. A estimativa da lista, incluindo subtotais e itens sem preço, é calculada pela API; o cliente apenas apresenta esses valores. Os preços atuais são selecionados no banco pela API, por data e ID.

No celular, quatro atalhos fixos e o menu Mais evitam uma barra com itens demais. Os estilos de tema, cartões e cabeçalhos são comuns a todas as páginas. Capturas atuais: `docs/screenshots/telas-unificadas`, com dados locais de teste.

Validação: build e lint do frontend, quatro testes das regras de preços e nove testes da API real com H2. Verificação de navegação por perfil, permissões fornecidas pela API, cadastro de vendedor pelo administrador, listas após recarregar, transferência de mercado, links antigos, celular e tema escuro.
