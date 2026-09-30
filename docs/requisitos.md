# Escopo do MVP — QuantoTá

## Consumidor

- Consultar produtos, comparar preços e consultar mercados sem conta.
- Criar conta com nome, e-mail e senha; entrar por e-mail e senha.
- Criar listas de compras salvas na conta.
- Adicionar produtos, acumular quantidades, alterar quantidades e remover itens.
- Consultar uma estimativa e os produtos sem preço disponível.
- Escolher tema claro, escuro ou do sistema.

## Administração

- Consultar e cadastrar contas de consumidor.
- Criar, editar, desativar e reativar produtos e mercados.
- Cadastrar, editar e excluir registros de preços, com valor e data de coleta.
- Consultar contagens reais do catálogo e preços recentes.

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
12. Cadastros desativados ficam fora da consulta do consumidor e permanecem disponíveis ao administrador.

## Fora do MVP

Aprovação de vendedores, vinculação de vendedores a mercados, anúncios, checkout, pagamento, localização por GPS, distância, favoritos, notificações e economia efetivamente realizada. O perfil VENDEDOR antigo continua com acesso de consumidor para não quebrar contas existentes.
