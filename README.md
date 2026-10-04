# QuantoTá

Compare preços do mesmo produto em diferentes mercados e organize sua lista de compras.

O QuantoTá é um projeto acadêmico do SENAC com frontend em **React + TypeScript + Vite**, API em **Java 17 + Spring Boot**, autenticação JWT e banco **PostgreSQL**. A conexão existente com Supabase continua sendo feita pelo backend via JDBC.

## Experiência

1. Busque um produto no início ou em `/comparar`, sem precisar entrar.
2. Selecione o produto e compare os preços registrados em cada mercado.
3. Entre ou crie uma conta para salvar listas e ajustar quantidades.
4. Consulte a estimativa e os itens que ainda não têm preço.

Todas as telas compartilham o mesmo layout e a mesma navegação. A API define as ações de cada conta; produtos, mercados e preços são consultados nas mesmas páginas, sem painéis separados por perfil. Há tema claro, escuro e preferência do sistema, além de navegação para celular.

## Regras implementadas

- Produtos são relacionados a preços por **ID**, nunca pelo nome. Marca e unidade/embalagem ajudam a identificar o que está sendo comparado.
- Para cada produto e mercado, vale a maior **data de coleta**; empates usam o maior ID do registro. Um preço antigo mais baixo não substitui o atual.
- A diferença entre preços é uma **possibilidade de economia**, não dinheiro já economizado. Não há gráficos, distâncias, favoritos ou notificações simulados.
- Uma lista pertence ao usuário autenticado. O cliente não escolhe o dono no corpo da requisição.
- Adicionar o mesmo produto novamente soma a quantidade. Quantidades são inteiras, de 1 a 999.
- Produtos sem preço deixam a estimativa incompleta. O valor conhecido é um subtotal, não um total definitivo.
- A estimativa combina os menores preços de cada item, que podem estar em mercados diferentes. Deslocamento e compras realizadas não fazem parte desse cálculo.
- Desativar produto ou mercado preserva os registros anteriores. O administrador pode consultar e reativar os cadastros.
- Cadastro público cria apenas consumidores, mesmo se a requisição tentar enviar outro perfil. Produtos, desativação de mercados e gestão de usuários exigem ADMIN. O administrador cadastra consumidores, vendedores e administradores na mesma tela de usuários.
- Contas VENDEDOR podem criar mercados e editar apenas os seus próprios mercados ativos. O backend atribui o vínculo ao criar, ignora tentativas de alterar responsável ou status pelo vendedor e bloqueia a edição entre contas.
- Vendedores cadastram, editam e excluem preços apenas dos seus mercados ativos. A API verifica tanto o mercado original quanto o destino ao editar um preço. Transferências e desativações revogam esse acesso imediatamente.
- O administrador pode atribuir ou transferir um mercado a um vendedor ativo pelo formulário compartilhado. Mercados existentes ficam sem vendedor até essa atribuição.
- A lista exibe a estimativa e os subtotais por item calculados na API. A comparação e o início usam `GET /precos/atuais`, que seleciona os registros atuais no banco.

## Rotas e navegação

- Públicas: `/` (início único), `/login`, `/comparar`, `/catalogo` e `/precos`.
- `/catalogo?aba=produtos` e `/catalogo?aba=mercados` são seções da mesma tela, disponíveis para todos os perfis.
- Conta autenticada: `/lista` e `/conta`.
- Formulários compartilhados: `/produtos/novo`, `/produtos/:id/editar`, `/mercados/novo` e `/mercados/:id/editar`. A interface consulta `GET /permissoes`; os serviços também validam cada alteração no backend.
- `/precos` é compartilhada: consulta pública, edição dos mercados próprios para vendedores e gestão completa para administradores.
- `/usuarios` exige a permissão administrativa retornada pela API. O cadastro abre nessa mesma tela com `?novo=1`.
- `/dashboard` redireciona ao início. `/usuarios/novo` abre o formulário integrado; não há telas extras para esses endereços.
- Endereços antigos com `/admin` e `/cliente`, além de `/produtos` e `/mercados`, redirecionam às rotas atuais, mantendo parâmetros e fragmentos. Eles não possuem telas próprias.
- Ao salvar ou cancelar um formulário, o usuário retorna à seção correspondente do catálogo.

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

O vínculo usa a coluna nullable `mercados.vendedor_id`. Com `ddl-auto=update`, ela é criada ao iniciar a API; instalações com `validate` devem aplicar `ALTER TABLE mercados ADD COLUMN IF NOT EXISTS vendedor_id BIGINT;` antes da atualização. Os registros existentes permanecem sem vínculo até a atribuição pelo admin.

O schema em `database/schema.sql` é um exemplo PostgreSQL. Para desenvolvimento, a API continua com `ddl-auto=update`; os testes usam H2 isolado e `create-drop`. Não execute os scripts de exemplo sobre um banco em produção sem revisar as alterações.

## Vitrine e comparação de compras

A experiência de cliente usa as rotas `/`, `/explorar`, `/comparar`, `/lista` e `/conta`. Login é necessário para salvar listas; a consulta de produtos e preços é pública. O administrador publica coleções em `/vitrine` e configura medidas e grupos equivalentes no catálogo. O vendedor envia a foto da oferta em `/precos`, vinculada ao par produto + mercado. Atualizar o preço preserva essa foto e não altera ofertas de outros mercados.

A embalagem mantém seu preço em destaque. Valores por kg/L/un só aparecem com medida estruturada válida. Embalagens diferentes exigem o mesmo grupo, marca e dimensão. A lista compara os mesmos produtos e quantidades: somente mercados com todos os preços concorrem ao menor total; os demais mostram subtotal e itens sem preço. A compra dividida informa mercados envolvidos e diferença de valores, sem incluir entrega ou deslocamento.

Fotos JPG/PNG de até 3 MB são verificadas e reencodificadas no servidor; os arquivos persistem no PostgreSQL (`imagens.conteudo`), sem depender do disco temporário da hospedagem. As URLs são públicas e imutáveis. Cada substituição gera uma nova imagem; imagens antigas são conservadas nesta versão. Não há credencial adicional para upload.

Para bases existentes com `ddl-auto=validate`, revise e aplique `database/migrations-retail.sql` antes da atualização. Com `update`, o Hibernate cria as estruturas aditivas. Produtos antigos continuam comparáveis por embalagem; o administrador deve preencher suas medidas para habilitar kg/L/un. Não são criados preços, imagens de produtos ou coleções fictícias em produção.

## Validação

```powershell
npm --prefix frontend run build
npm --prefix frontend run lint
npm --prefix frontend test
cd backend
.\gradlew.bat test
```

Os testes de frontend exigem Node 22.13 ou superior. Os doze testes de integração Java iniciam a API real em porta aleatória com H2 e verificam cadastro, permissões, isolamento de listas, persistência, validações, preços atuais e contas desativadas, além de edição por vendedor, bloqueio entre vendedores, atribuição pelo administrador, preços por mercado, bloqueio de transferências indevidas e tentativas de escalada de perfil. Oito testes de frontend cobrem identidade dos produtos, registros históricos, preços inválidos, cálculo em centavos e consistência da sessão, incluindo expiração e limpeza da identidade.

A revisão visual também exercitou a aplicação com uma API local e dados de teste. As capturas atuais em `docs/screenshots/telas-unificadas` usam dados locais de teste, não dados de produção. As capturas anteriores ficam como registro das etapas de revisão.

## Estrutura

- `frontend/src/pages`: telas compartilhadas, sem diretórios por perfil.
- `frontend/src/services`: contratos com a API.
- `frontend/src/hooks/usePermissions.ts`: ações disponíveis retornadas pela API.
- `backend/src/main/java/br/com/quantota/service/PermissaoService.java`: decisões de acesso e vínculo de mercados.
- `backend/src/main/java/br/com/quantota/service/ListaCompraService.java`: estimativas de listas e isolamento entre contas.
- `backend/src/main/java/br/com/quantota`: controladores, serviços, entidades e repositórios.
- `backend/src/test`: testes da API.
- `docs/requisitos.md`: escopo e regras do MVP.
- `docs/repaginacao.md`: alterações e validações da revisão.

Desenvolvido por Felipe Lima, Francisco Mikael e Pietro de Almeida.
