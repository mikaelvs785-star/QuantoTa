# QuantoTá

Compare preços do mesmo produto em diferentes mercados e organize sua lista de compras.

O QuantoTá é um projeto acadêmico do SENAC com frontend em **React + TypeScript + Vite**, API em **Java 17 + Spring Boot**, autenticação JWT e banco **PostgreSQL**. A conexão existente com Supabase continua sendo feita pelo backend via JDBC.

## Experiência

1. Busque um produto no início ou em `/comparar`, sem precisar entrar.
2. Selecione o produto e compare os preços registrados em cada mercado.
3. Entre ou crie uma conta para salvar listas e ajustar quantidades.
4. Consulte a estimativa e os itens que ainda não têm preço.

O administrador mantém produtos, mercados e preços em uma área separada. Há tema claro, escuro e preferência do sistema, além de navegação para celular.

## Regras implementadas

- Produtos são relacionados a preços por **ID**, nunca pelo nome. Marca e unidade/embalagem ajudam a identificar o que está sendo comparado.
- Para cada produto e mercado, vale a maior **data de coleta**; empates usam o maior ID do registro. Um preço antigo mais baixo não substitui o atual.
- A diferença entre preços é uma **possibilidade de economia**, não dinheiro já economizado. Não há gráficos, distâncias, favoritos ou notificações simulados.
- Uma lista pertence ao usuário autenticado. O cliente não escolhe o dono no corpo da requisição.
- Adicionar o mesmo produto novamente soma a quantidade. Quantidades são inteiras, de 1 a 999.
- Produtos sem preço deixam a estimativa incompleta. O valor conhecido é um subtotal, não um total definitivo.
- A estimativa combina os menores preços de cada item, que podem estar em mercados diferentes. Deslocamento e compras realizadas não fazem parte desse cálculo.
- Desativar produto ou mercado preserva os registros anteriores. O administrador pode consultar e reativar os cadastros.
- Cadastro público cria apenas consumidores. A API exige ADMIN para alterar catálogo, preços e cadastrar usuários pela área administrativa.
- O perfil VENDEDOR é mantido para compatibilidade com contas existentes, com acesso de consumidor. Solicitação e aprovação de vendedores ficam fora deste MVP; o formulário anterior apenas imprimia dados no console.

## Rotas e navegação

- Públicas: `/`, `/login`, `/comparar`, `/mercados` e `/cliente/dashboard`.
- Conta autenticada: `/cliente/lista` e `/cliente/configuracoes`.
- Administração: `/admin/dashboard`, `/admin/produtos`, `/admin/mercados`, `/admin/precos` e `/admin/usuarios`.
- Produtos e mercados têm cadastro em `/novo` e edição em `/:id/editar`. Ao salvar, o administrador retorna à listagem.
- `/dashboard` direciona para a área do perfil conectado. `/admin` e `/cliente` abrem seus respectivos painéis.
- Links antigos de detalhes administrativos redirecionam à edição. `/cliente/comparador` e `/cliente/mercados` redirecionam às páginas públicas, preservando busca e fragmento, sem exigir login.

O projeto usa npm. O único lockfile é `frontend/package-lock.json`; a raiz oferece scripts de conveniência e não instala dependências próprias. O Docker do frontend também usa `npm ci`.

## Executar no Windows / PowerShell

Na raiz:

```powershell
npm --prefix frontend ci
npm --prefix frontend run dev
```

Em outro terminal, configure a senha e uma chave JWT privada. Se o seu servidor já configura essas variáveis, preserve os valores existentes. Gere uma chave apenas para uma nova configuração; trocá-la invalida sessões anteriores.

```powershell
$senhaBanco = Read-Host "Senha do PostgreSQL" -AsSecureString
$env:SPRING_DATASOURCE_PASSWORD = [System.Net.NetworkCredential]::new("", $senhaBanco).Password
# Para um banco diferente, configure também SPRING_DATASOURCE_URL e SPRING_DATASOURCE_USERNAME.
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
cd backend
.\gradlew.bat bootRun
```

Em Linux/macOS, execute `bash gradlew bootRun` dentro de `backend`, com as mesmas variáveis de ambiente configuradas.

- Frontend: `http://localhost:5173`
- API: `http://localhost:8080`
- `VITE_API_URL` pode alterar a URL da API. Variáveis com esse prefixo são públicas; não coloque segredos nelas.

A API exige `SPRING_DATASOURCE_PASSWORD` e `JWT_SECRET`. Os valores não estão no código. O Compose usa `SUPABASE_DB_PASSWORD` e `JWT_SECRET`, que precisam estar no ambiente ou em um `.env` local não versionado.

Uma senha de banco e uma chave JWT padrão existiam no histórico do projeto. A remoção no código atual não apaga esse histórico: substitua a senha exposta no provedor e use uma chave JWT privada. Nenhuma credencial remota foi alterada automaticamente.

O schema em `database/schema.sql` é um exemplo PostgreSQL. Para desenvolvimento, a API continua com `ddl-auto=update`; os testes usam H2 isolado e `create-drop`. Não execute os scripts de exemplo sobre um banco em produção sem revisar as alterações.

## Validação

```powershell
npm --prefix frontend run build
npm --prefix frontend run lint
npm --prefix frontend test
cd backend
.\gradlew.bat test
```

Os testes de frontend exigem Node 22.13 ou superior. Os cinco testes de integração Java iniciam a API real em porta aleatória com H2 e verificam cadastro, permissões, isolamento de listas, persistência, validações, preços atuais e contas desativadas. Quatro testes de frontend cobrem identidade dos produtos, registros históricos, preços inválidos e cálculo em centavos.

A revisão visual também exercitou a aplicação com uma API local e dados de teste. As capturas em `docs/screenshots` são dessa execução, não dos dados de produção.

## Estrutura

- `frontend/src/pages`: telas públicas, listas, conta e administração.
- `frontend/src/services`: contratos com a API.
- `frontend/src/lib/offers.ts`: seleção dos preços atuais e cálculo monetário.
- `backend/src/main/java/br/com/quantota`: controladores, serviços, entidades e repositórios.
- `backend/src/test`: testes da API.
- `docs/requisitos.md`: escopo e regras do MVP.
- `docs/repaginacao.md`: alterações e validações da revisão.

Desenvolvido por Felipe Lima, Francisco Mikael e Pietro de Almeida.
