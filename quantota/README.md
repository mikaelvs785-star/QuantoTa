# QuantoTá?

Projeto web completo para comparação de preços de produtos consumíveis, inspirado na ideia descrita no prompt enviado pela usuária. O sistema separa front-end em HTML, CSS e JavaScript puro, e back-end em Java com Spring Boot e MySQL. A proposta central é permitir busca de produtos, comparação de preços entre mercados e montagem de lista de compras com valor estimado pelo menor preço disponível.

## Tecnologias

### Front-end
- HTML
- CSS
- JavaScript puro

### Back-end
- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security (liberado para simplificar o MVP)
- Lombok

### Banco de dados
- MySQL

## Estrutura

```bash
quantota/
├── frontend/
├── backend/
├── database/
└── docs/
```

## Funcionalidades entregues no MVP
- Cadastro de usuário
- Login simples por email e senha
- CRUD de produtos
- CRUD de mercados
- CRUD de preços
- Busca de produtos por nome
- Comparação de preços por produto
- Lista temporária de compras no front-end
- Cálculo estimado pelo menor preço disponível

## Como rodar o back-end
1. Crie o banco `quantota` no MySQL ou deixe o `createDatabaseIfNotExist=true` criar automaticamente.
2. Ajuste `application.properties` se seu MySQL tiver senha.
3. No terminal, entre na pasta `backend`.
4. Execute:

```bash
./gradlew bootRun
```

No Windows, use:

```bash
gradlew.bat bootRun
```

## Como rodar o front-end
Como o front é estático, você pode:
- abrir `frontend/index.html` direto no navegador, ou
- usar a extensão Live Server no VS Code.

## Endpoints principais
- `POST /usuarios`
- `POST /auth/login`
- `GET /usuarios`
- `GET /produtos`
- `GET /produtos/{id}`
- `GET /produtos/buscar?nome=banana`
- `POST /produtos`
- `PUT /produtos/{id}`
- `DELETE /produtos/{id}`
- `GET /mercados`
- `POST /mercados`
- `GET /precos/produto/{id}`
- `POST /precos`
- `GET /listas/{id}`

## Melhorias futuras recomendadas
- Criptografar senha com BCrypt
- Criar autenticação com JWT
- Restringir rotas ADMIN de verdade
- Persistir lista de compras no banco a partir do front
- Criar dashboard com histórico de preços
- Mostrar mercado com menor valor geral da lista
- Adicionar filtros por bairro, cidade e categoria

## Observação importante
Este projeto foi gerado como base funcional e didática a partir do prompt enviado. Ele já serve como ponto de partida para ADS, portfólio e evolução incremental.
