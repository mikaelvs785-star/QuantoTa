# QuantoTá — direção de produto e design

Registro da conversa com Mikael em 03/10/2026.

## Estado da decisão

Em 03/10/2026, às 13h31 (America/Sao_Paulo), Mikael confirmou: “Telas aprovadas, essas de cliente e as de admin e as de vendedor”. O conjunto passa a ser a referência aprovada para a implementação, incluindo a direção acolhedora e comercial do cliente, os ícones refinados, a gestão administrativa, as ofertas dos vendedores e as regras de comparação descritas abaixo.

A aprovação considera a última divisão de responsabilidades: fotos das ofertas ficam com os vendedores; o administrador mantém a identificação do catálogo e os banners da vitrine. Login e conta seguem a composição aprovada, recebendo a mesma padronização de ícones do restante do conjunto. As telas apresentadas são conceitos, não capturas do software implementado; a aprovação visual não significa que as novas funcionalidades já estejam disponíveis.

## Experiência do cliente

- Fundo creme, verde profundo, laranja nas ações principais, tipografia legível e fotos atraentes de produtos e refeições.
- Início e exploração com categorias e coleções como café da manhã e almoço. Sugestões complementares são opcionais e nunca entram automaticamente na lista.
- Manter o foco em comparação e planejamento de compras. Não apresentar pagamento, pedidos ou economia efetivamente realizada.
- A consulta de preços é pública; listas persistidas e conta exigem login.
- Navegação principal consistente: Início, Explorar, Lista e Conta. Comparar é uma ação dentro dos fluxos de produto e lista, sem substituir arbitrariamente os itens da navegação entre telas.
- Login e conta seguem a mesma identidade acolhedora do restante da experiência.

## Imagens e responsabilidades

| Conteúdo | Responsável aprovado |
|---|---|
| Identificação do produto: nome, marca, embalagem e categoria | Administrador |
| Foto da oferta de um produto em determinado mercado | Vendedor responsável pelo mercado |
| Preço e data de coleta | Vendedor nos próprios mercados; administrador conforme permissões |
| Foto e dados do mercado | Vendedor responsável; administrador conforme permissões |
| Banners e coleções editoriais da vitrine | Administrador |

A imagem pertence à oferta do par produto/mercado. A alteração por um vendedor não modifica as imagens dos demais. Produtos equivalentes mantêm a mesma identificação no catálogo, mesmo com fotos diferentes. Na comparação, mostrar a foto do respectivo vendedor. Na vitrine geral, usar a foto da oferta de menor preço apresentada, com mercado identificado. Sem imagem disponível, usar apresentação neutra da categoria.

O vendedor seleciona o produto, envia a foto, informa preço e data, confere a prévia e salva. A interface não deve sugerir que atualizar um preço exige reenviar uma imagem que já pertence à oferta.

## Comparações aprovadas como referência

1. Preço da embalagem em destaque; preço por kg, litro ou unidade como informação secundária.
2. Comparação entre mercados para o mesmo produto e embalagem. Outras embalagens ficam em uma comparação explícita do mesmo tipo de produto e marca.
3. Quantidade e unidade estruturadas no cadastro, com conversões de g para kg e ml para L. Não converter massa em volume nem comparar unidades incompatíveis. Sem medida válida, não calcular preço normalizado.
4. Quantidade de pacotes e subtotal de cada item visíveis. Embalagem com menor preço por kg pode exigir maior desembolso; mostrar ambos sem induzir quantidade desnecessária.
5. Total da mesma lista em cada mercado, preservando produtos e quantidades. Só classificar como mais barato para a lista completa um mercado com preço para todos os itens.
6. Mercado com itens sem preço mostra subtotal e faltantes. Ausência de preço não significa zero nem prova de falta de estoque.
7. Comparação com os menores preços combinados entre mercados, incluindo número de mercados e diferença para a melhor lista completa em um só mercado.
8. Deslocamento e entrega não entram no cálculo atual proposto; informar isso junto à diferença. Não prometer economia líquida ou realizada.
9. Mostrar datas de coleta e considerar o registro atual por produto/mercado, conforme as regras da API. Preços das prévias são ilustrativos.

Exemplo coerente de referência: arroz Camil 5 kg × 1 e leite Italac 1 L × 2. Mercado Central: 35,00 + 2 × 4,99 = 44,98. Boa Compra: 37,00 + 2 × 4,49 = 45,98. Mercado Econômico: arroz 32,00 e leite sem preço, portanto subtotal incompleto. Combinação Econômico + Boa Compra: 32,00 + 8,98 = 40,98; diferença de 4,00 em relação ao melhor total completo, antes de deslocamento.

## Refinamento de ícones aprovado

Usar uma única família vetorial com curadoria de significado. O projeto já usa Lucide; a proposta é padronizar seu uso, evitando que símbolos imprecisos gerados nas imagens virem especificação de implementação.

- Grade de 24 px, traço consistente de 2 px e terminais arredondados; escala e alinhamento óptico uniformes.
- Ícones monocromáticos, verde/neutral conforme estado. Seleção indicada também por rótulo e fundo discreto, não apenas cor.
- Rótulos acompanham ações e navegação; controles compactos recebem nomes acessíveis e área de toque de pelo menos 44 × 44 px.
- Início: casa; Explorar: lupa; Lista: lista com marcações; Conta: pessoa em círculo.
- Mercado: fachada simples; comparar: setas opostas; imagem: paisagem em moldura; enviar: seta para cima; atenção: círculo ou triângulo com exclamação.
- Remover emojis, moedas empilhadas, gráficos usados para significar comparação e ilustrações de sacolas usadas como botões. Fotografias permanecem como conteúdo comercial.
- Evitar ícones redundantes: o texto do botão já deve explicar a ação. Laranja destaca a ação principal, não todos os símbolos.
- Não introduzir novas telas, métricas ou funcionalidades apenas porque apareceram em uma imagem gerada. Corações/favoritos e variações de navegação das prévias anteriores não são requisitos aprovados.

## Pendências para implementação

Uploads e persistência das imagens por oferta/mercado, gestão de banners e coleções, medidas estruturadas e comparação entre embalagens, totais por mercado e nova interface ainda precisam ser implementados e testados. A iconografia aprovada deve ser aplicada de forma consistente às três experiências. Manter a documentação do estado atual separada desta especificação de implementação.
