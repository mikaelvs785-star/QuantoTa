# Registro de validação — permissões de mercado (PR #5)

**Projeto:** QuantoTá  
**Data da validação automatizada:** 28/10/2026  
**Commit de merge:** `906b61fd1a8278efe337440abcce2d1da32fe703`  
**Pull request:** [#5 — Restringe desativação de mercados a administradores](https://github.com/mikaelvs785-star/QuantoTa/pull/5)

## Objetivo

Registrar a validação automatizada das regras de autorização relacionadas à desativação e à edição de mercados após o merge do PR #5.

## Execução

No Windows, dentro da pasta `backend`, foi executado:

```powershell
.\gradlew.bat test --rerun-tasks
```

Resultado observado no terminal: `BUILD SUCCESSFUL`, com 4 tarefas executadas.

O relatório HTML do Gradle foi aberto localmente e mostrou **25 testes, 0 falhas, 0 ignorados e 100% de sucesso**.

## Resultados verificados no relatório

### `ApiFlowTest`

- 12 testes; 0 falhas; 0 ignorados.
- `cataloguePermissionsAndSellerOwnership()` — **passed**.

### `MercadoServiceTest`

- 4 testes; 0 falhas; 0 ignorados.
- `adminPodeDesativarMercadoDeQualquerVendedor()` — **passed**.
- `clienteNaoDesativaMercado()` — **passed**.
- `vendedorNaoDesativaMercadoDeOutro()` — **passed**.
- `vendedorNaoDesativaProprioMercado()` — **passed**.

### Suíte completa do backend

- 25 testes executados.
- 0 falhas.
- 0 testes ignorados.
- 100% de sucesso no relatório HTML.

## Regras cobertas

| Perfil | Ação | Resultado automatizado |
|---|---|---|
| ADMIN | Desativar mercado de qualquer vendedor | Aprovado |
| VENDEDOR | Desativar o próprio mercado | Bloqueado pelo teste |
| VENDEDOR | Desativar mercado de outro vendedor | Bloqueado pelo teste |
| CLIENTE | Desativar mercado | Bloqueado pelo teste |
| VENDEDOR | Editar mercado próprio ativo e respeitar a propriedade | Coberto pelo teste de integração aprovado |

A desativação é lógica: o mercado é marcado como inativo, preservando os registros, em vez de ser removido fisicamente do banco.

## Limites desta validação

Este registro documenta **testes automatizados de backend** executados localmente e conferidos no relatório do Gradle. Não significa que os testes manuais pela interface ou por cliente HTTP já foram executados. Também não é uma validação de produção.

## Próxima etapa — testes manuais pendentes

Executar e registrar, usando contas de teste distintas:

1. **ADMIN:** desativar um mercado e verificar que ele fica inativo.
2. **VENDEDOR:** editar o próprio mercado ativo; tentar desativá-lo; tentar editar/desativar mercado de outro vendedor.
3. **CLIENTE:** tentar desativar um mercado.
4. Em cada caso, registrar o perfil usado, a requisição ou ação realizada, o status/resposta observado e o resultado real. Não preencher evidências antes de executar o teste.

**Status:** testes automatizados aprovados; testes manuais pendentes.
