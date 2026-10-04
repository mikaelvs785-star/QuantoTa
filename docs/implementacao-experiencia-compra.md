# Implementação da experiência de compra

Concluída em 4 de outubro de 2026, seguindo a direção aprovada em `direcao-visual-cliente.md`.

## Entrega

- Cliente: início com vitrine, exploração por busca/categoria/coleção, comparação entre mercados e embalagens, lista, totais por mercado, compra dividida, login e conta.
- Vendedor: foto da oferta por produto/mercado, preço e data; imagem preservada ao atualizar apenas o preço. Edição limitada aos mercados vinculados.
- Administrador: cadastro de medidas e grupos equivalentes; publicação de coleções, imagem de banner, ordem e seleção de produtos.
- Componentes e navegação compartilhados, ícones Lucide, tema claro/escuro e layout adaptável. Removidos sidebar e carregamento do dashboard que deixaram de ser usados.
- Sem checkout, pagamento, estoque inferido ou alegação de economia realizada.

## Validação executada

- Frontend: build TypeScript/Vite, ESLint e 8 testes Node aprovados.
- Backend: compilação Java 17 e 12 testes JUnit de integração, com Spring Boot e banco H2 isolado. Executados pelo JUnit Console com as dependências do projeto; o comando padrão do repositório continua `bash gradlew test`.
- Novos testes: normalização kg/L/un, exclusão de dimensões incompatíveis, total completo versus parcial, compra dividida, isolamento e persistência das fotos, acesso público às imagens e publicação restrita ao administrador.
- Navegador Chromium/Playwright contra o build de produção do frontend e API local real: busca → comparação → autenticação → criação de lista → totais; upload e gravação de oferta pelo vendedor; publicação de coleção e cadastro de produto pelo administrador.
- Conferência de viewport móvel de 390 px, ausência de rolagem horizontal na compra dividida e modo escuro. Nenhuma exceção JavaScript durante os fluxos verificados.

O cenário de teste usa arroz de 5 kg e duas embalagens de leite: Central R$ 44,98, Boa Compra R$ 45,98, Econômico R$ 32,00 parcial. A combinação custa R$ 40,98 em dois mercados, diferença de R$ 4,00 para a melhor lista completa.

## Capturas

As imagens em `screenshots/experiencia-compra/` são capturas da aplicação funcionando com dados locais de teste. Produtos sem foto usam um espaço reservado; o upload do vendedor foi verificado com uma imagem técnica de cor sólida. Essas imagens e preços não foram inseridos em produção.

## Atualização do ambiente

As fotos persistem no banco, sem serviço externo de armazenamento. O script aditivo `database/migrations-retail.sql` atende instalações que usam validação de schema; em desenvolvimento, `ddl-auto=update` cria os campos e tabelas. Nenhum banco remoto foi alterado durante a implementação. Não foi realizado deploy da aplicação.

Medidas de produtos antigos precisam ser preenchidas pelo administrador. Fotos reais das ofertas precisam ser enviadas pelos vendedores. Imagens substituídas são mantidas no banco nesta versão; não há limpeza automática de imagens antigas.
