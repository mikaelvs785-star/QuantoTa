# QuantoTá 🛒

**Compare preços de produtos entre mercados, encontre ofertas e organize suas compras.**

O **QuantoTá** é um projeto acadêmico desenvolvido no **SENAC**. A plataforma permite consultar produtos e preços de diferentes mercados, comparar ofertas e montar listas de compras com estimativas de custo. O acesso às funcionalidades de gestão depende das permissões do usuário.

> **Estado do projeto:** aplicação full stack em desenvolvimento. A infraestrutura de publicação é descrita abaixo como configuração existente ou opção de hospedagem; a presença de arquivos de configuração não comprova um deploy ativo.

## Tecnologias

| Camada | Tecnologias | Finalidade |
| --- | --- | --- |
| Frontend | **React 19**, **TypeScript 6**, **Vite 8** | Interface web, tipagem e ambiente de desenvolvimento/build |
| Estilização | **Tailwind CSS 4**, **Radix UI**, **Lucide React**, **next-themes** | Estilos responsivos, componentes, ícones e temas |
| Navegação e dados | **React Router 7**, **TanStack React Query 5**, **Axios** | Rotas, cache/consultas e comunicação HTTP |
| Formulários | **React Hook Form**, **Zod**, **@hookform/resolvers** | Formulários e validação |
| Backend | **Java 17**, **Spring Boot 3.3.5**, **Spring Web**, **Spring Data JPA**, **Hibernate** | API REST, regras de negócio e persistência |
| Segurança | **Spring Security**, **JWT (JJWT 0.12.6)** | Autenticação e autorização por perfil |
| Banco de dados | **PostgreSQL**, **JDBC** | Armazenamento de usuários, produtos, mercados, preços, listas e imagens |
| Build e dependências | **Gradle** (backend), **npm** (frontend) | Compilação, dependências e execução |
| Qualidade | **JUnit 5**, **Mockito**, **Spring Boot Test**, **H2**, **ESLint**, testes Node | Testes e análise estática |
| Contêineres | **Docker**, **Docker Compose** | Execução e empacotamento dos serviços |

As versões acima refletem os arquivos `frontend/package.json` e `backend/build.gradle` consultados na branch `main`.

## Hospedagem e infraestrutura

A arquitetura de hospedagem prevista separa interface, API e banco de dados:

```text
Navegador
   |
   v
Frontend React / Vite  --->  API Java / Spring Boot  --->  PostgreSQL
       Vercel                    Render                    Supabase
```

| Serviço | Papel no QuantoTá | Situação identificada |
| --- | --- | --- |
| **Vercel** | Hospedagem do frontend estático React/Vite | O repositório contém `vercel.json` e `frontend/vercel.json` com rewrite para rotas SPA. Não foi verificado um deploy ativo. |
| **Render** | Opção de hospedagem da API Spring Boot, por exemplo via Docker | Plataforma prevista para o backend; não foi encontrado `render.yaml` na raiz da branch `main`. Configuração e publicação precisam ser confirmadas no painel. |
| **Supabase** | PostgreSQL gerenciado para os dados da aplicação | O backend possui configuração JDBC com host do pooler Supabase. A disponibilidade do projeto e o acesso ao banco não foram confirmados. |
| **Docker / Docker Compose** | Alternativa para execução conjunta do frontend e backend | Há `docker-compose.yml` e Dockerfiles para os serviços. |

**Importante:** Vercel, Render e Supabase são serviços independentes. Os endereços públicos e o estado de publicação dependem da configuração nas respectivas contas; não estão presumidos aqui.

### Variáveis de ambiente

| Variável | Serviço | Descrição |
| --- | --- | --- |
| `VITE_API_URL` | Frontend | URL pública da API acessada pelo navegador |
| `SPRING_DATASOURCE_URL` | Backend | URL JDBC do PostgreSQL |
| `SPRING_DATASOURCE_USERNAME` | Backend | Usuário do banco |
| `SPRING_DATASOURCE_PASSWORD` | Backend | Senha do banco |
| `JWT_SECRET` | Backend | Chave privada para assinatura dos tokens JWT |
| `SERVER_PORT` | Backend | Porta HTTP da API (padrão: `8080`) |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Backend | Estratégia de gerenciamento do esquema JPA |
| `SUPABASE_DB_PASSWORD` | Docker Compose | Senha repassada ao backend pelo Compose |

Nunca publique credenciais no GitHub ou em variáveis `VITE_*`: elas são incorporadas ao frontend. Em produção, configure os segredos no provedor de hospedagem. Não execute atualizações automáticas do esquema em banco de produção sem avaliar migrações e backups.

## Funcionalidades

### Consumidor
- Consultar produtos, mercados e ofertas sem autenticação.
- Comparar preços atuais de um produto em diferentes mercados.
- Criar conta, autenticar-se e organizar listas de compras.
- Visualizar estimativas de custo, subtotais e itens sem preço.
- Comparar compras em um mercado ou distribuídas entre mercados, conforme disponibilidade de preços.

### Vendedor
- Criar mercados vinculados à própria conta.
- Gerenciar dados e preços dos próprios mercados ativos, conforme as permissões da API.
- Associar fotos às ofertas.

### Administrador
- Gerenciar produtos e usuários.
- Cadastrar, desativar e atribuir mercados a vendedores.
- Gerenciar preços, medidas, grupos de comparação e conteúdo de vitrine.

A autorização é aplicada no backend; ocultar um botão na interface não substitui a verificação de permissão na API.

## Regras importantes de comparação

- Os preços são associados a produtos por **ID**, e não apenas pelo nome.
- O preço atual de cada produto em cada mercado é determinado pela data de coleta mais recente; em caso de empate, prevalece o maior ID.
- Produtos com embalagens diferentes precisam de medidas e grupos compatíveis para comparação por kg, L ou unidade.
- Uma lista pertence ao usuário autenticado. Produtos repetidos somam suas quantidades.
- Quando faltam preços, o sistema apresenta o subtotal conhecido e informa os itens sem cotação.
- A estimativa de compra dividida pode considerar mercados diferentes e não inclui deslocamento ou entrega.
- A desativação de cadastros preserva os registros históricos.

## Pesquisa de produtos

A API oferece `GET /produtos/buscar?nome=...`. A correção da [issue #4](https://github.com/mikaelvs785-star/QuantoTa/issues/4) para pesquisar ignorando acentos (por exemplo, `cafe` encontrar `Café`) está proposta no [PR #11](https://github.com/mikaelvs785-star/QuantoTa/pull/11), em branch separada. **Ela não é descrita como já integrada à `main`.**

## Como executar localmente

### Pré-requisitos

- **Java 17**;
- **Node.js** compatível com as dependências do frontend (para executar os testes Node, versão **22.13 ou superior**);
- **npm**;
- acesso a um **PostgreSQL** de desenvolvimento;
- Git (recomendado).

### Frontend

Na raiz do repositório:

```powershell
npm --prefix frontend ci
npm --prefix frontend run dev
```

O frontend é servido normalmente em **http://localhost:5173**.

### Backend (Windows / PowerShell)

Em outro terminal, configure uma conexão de desenvolvimento. Os valores abaixo são **exemplos**; substitua-os pelos dados do seu banco local ou de testes:

```powershell
$env:SPRING_DATASOURCE_URL = "jdbc:postgresql://localhost:5432/quantota"
$env:SPRING_DATASOURCE_USERNAME = "postgres"
$senhaBanco = Read-Host "Senha do PostgreSQL" -AsSecureString
$env:SPRING_DATASOURCE_PASSWORD = [System.Net.NetworkCredential]::new("", $senhaBanco).Password

$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$rng.Dispose()
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)

cd backend
.\gradlew.bat bootRun
```

A API é servida normalmente em **http://localhost:8080**. Em Linux/macOS, use `./gradlew bootRun` no diretório `backend`.

> A API requer um banco acessível para iniciar. Os testes automatizados do backend utilizam H2 isolado e podem ser executados sem conexão com o Supabase.

### Testes e verificações

```powershell
npm --prefix frontend run build
npm --prefix frontend run lint
npm --prefix frontend test
cd backend
.\gradlew.bat clean test
```

Os testes do backend cobrem fluxos de API e regras de acesso; os testes de frontend cobrem regras de comparação e sessão. Execute os comandos na branch que pretende validar antes de realizar merge.

## Rotas principais

| Rota | Uso |
| --- | --- |
| `/` | Página inicial |
| `/comparar` | Comparação de preços |
| `/catalogo` | Produtos e mercados |
| `/precos` | Consulta e gestão de ofertas conforme perfil |
| `/login` | Autenticação |
| `/lista` | Lista de compras do usuário |
| `/conta` | Conta do usuário |
| `/usuarios` | Administração de usuários |
| `/vitrine` | Administração de conteúdo de vitrine |

A API disponibiliza, entre outros recursos, endpoints de produtos, mercados, preços, autenticação, permissões e listas.

## Organização do repositório

```text
QuantoTa/
├── backend/
│   ├── src/main/java/br/com/quantota/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   ├── src/test/
│   └── build.gradle
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── routes/
│   └── package.json
├── database/
├── docs/
├── docker-compose.yml
├── vercel.json
└── README.md
```

Documentação adicional: `docs/requisitos.md` (regras e escopo) e `docs/repaginacao.md` (revisões de interface e validações).

## Desenvolvimento e contribuições

As alterações são organizadas em branches e pull requests. Consulte as [issues do projeto](https://github.com/mikaelvs785-star/QuantoTa/issues) para defeitos e melhorias registradas. Mudanças ainda em revisão não devem ser confundidas com funcionalidades publicadas na `main`.

---

**Projeto acadêmico SENAC**  
**Desenvolvido por Felipe Lima, Francisco Mikael e Pietro de Almeida.**
