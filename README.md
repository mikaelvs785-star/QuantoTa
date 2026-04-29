# QuantoTá?

Sistema web para comparação de preços de produtos consumíveis, com front-end em HTML/CSS/JavaScript e back-end em Spring Boot + MySQL.

## Estrutura
- `frontend/`: telas, CSS e JavaScript
- `backend/`: API REST em Java Spring Boot
- `database/`: schema e inserts iniciais
- `docs/`: anotações rápidas do projeto

## Funcionalidades
- cadastro e login de usuários
- fluxo de solicitação de vendedor com aprovação do admin
- CRUD de produtos, mercados e preços
- comparação de preços por produto
- lista de compras com total estimado
- tema claro/escuro
- painel admin para solicitações e cadastros

## Perfis
- `ADMIN`: gerencia cadastros e aprova vendedores
- `VENDEDOR`: cadastra preços depois de aprovado
- `USER`: pesquisa produtos e monta lista de compras

## Como rodar

### Banco de dados
1. Crie o banco `quantota` no MySQL, ou deixe o Spring criar automaticamente.
2. Ajuste `backend/src/main/resources/application.properties` se seu usuário ou senha forem diferentes.

### Back-end
1. Abra a pasta `backend/` no IntelliJ.
2. Aguarde o Gradle baixar as dependências.
3. Rode a classe `QuantotaApplication`.

### Front-end
1. Abra a pasta `frontend/`.
2. Execute com Live Server, ou abra `index.html` no navegador.
3. Confira se a API está em `http://localhost:8080`.

## Usuário inicial sugerido
- email: `admin@quantota.com`
- senha: `123456`

## Observação
A autenticação ainda está simples para facilitar estudo. O próximo passo natural é adicionar BCrypt + JWT.
