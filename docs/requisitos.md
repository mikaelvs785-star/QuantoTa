# Escopo do MVP — QuantoTá

## Consumidor

- Consultar produtos, comparar preços e consultar mercados sem conta.
- Criar conta com nome, e-mail e senha; entrar por e-mail e senha.
- Criar listas de compras salvas na conta.
- Adicionar produtos, acumular quantidades, alterar quantidades e remover itens.
- Comparar preço da embalagem e preço por kg/L/un, quando houver medida válida.
- Comparar o total da lista em um mercado ou dividindo entre mercados, com itens sem preço explícitos.
- Escolher tema claro, escuro ou do sistema.

## Vendedor

- Usar o mesmo catálogo e os mesmos formulários dos demais perfis.
- Criar mercados vinculados automaticamente à própria conta.
- Editar dados dos próprios mercados ativos, sem alterar vínculo ou status.
- Cadastrar, editar e excluir preços nos próprios mercados ativos.
- Enviar a foto de cada oferta (produto + mercado), preservada nas atualizações de preço.
- Consultar e comparar produtos e manter listas como consumidor.

## Administração

- Consultar e cadastrar contas de consumidor, vendedor e administrador.
- Criar, editar, desativar e reativar produtos e mercados.
- Cadastrar, editar e excluir registros de preços, com valor e data de coleta.
- Organizar grupos e medidas equivalentes e publicar coleções com banners na vitrine.
- Atribuir e transferir mercados a vendedores ativos pelo formulário compartilhado.

## Regras

1. IDs identificam produtos e mercados. Não agrupar produtos só porque têm o mesmo nome.
2. Um produto deve identificar marca, quando conhecida, e unidade/embalagem para tornar a comparação útil.
3. Considerar apenas preços positivos de produtos e mercados ativos.
4. Escolher um registro por par produto/mercado, por data de coleta mais recente e depois maior ID.
5. A lista só pode ser consultada ou alterada pelo dono autenticado, inclusive no backend.
6. Quantidades devem ser inteiras entre 1 e 999; somas também respeitam o limite.
7. Preço desconhecido não significa zero. Exibir subtotal e indicar estimativa incompleta.
8. A comparação não comprova uma compra nem uma economia realizada.
9. Registro de preço tem autoria obtida da sessão; o corpo não escolhe o usuário responsável.
10. Falhas de carregamento devem permitir tentar novamente e não aparecer como catálogo vazio.
11. Cadastro público não cria ADMIN nem VENDEDOR.
12. A API verifica o vínculo entre vendedor e mercado em cada edição; o cliente não decide o responsável nem libera permissões.
13. Ao editar um preço, validar acesso ao mercado original e ao destino. Transferências e desativações retiram o acesso do vendedor na API.
14. Subtotais e total da lista são calculados pela API, sem uma segunda estimativa no frontend.
15. Cadastros desativados ficam fora da consulta do consumidor e permanecem disponíveis ao administrador.

16. Só classificar como menor total os mercados com preço de todos os itens da lista.
17. A compra dividida informa quantos mercados e exclui frete e deslocamento.
18. A comparação entre embalagens requer grupo explícito, mesma marca e dimensão compatível; não converter massa em volume.
19. Produtos sem medida estruturada continuam mostrando preço de embalagem.
20. Fotos de oferta são isoladas por produto e mercado; banner de coleção pertence à administração.

## Fora do MVP

Cadastro público e aprovação de vendedores, anúncios, checkout, pagamento, localização por GPS, distância, favoritos, notificações e economia efetivamente realizada. Produtos permanecem sob gestão de ADMIN; vendedores mantêm seus mercados e seus preços.
