# QuantoTá Mobile

Aplicativo consumidor para Android e iOS com Expo, React Native e TypeScript.

## Requisitos
- Node.js LTS
- Expo Go instalado no Android
- Backend QuantoTá acessível por HTTPS

## Configuração
1. Entre na pasta: `cd mobile`
2. Instale dependências: `npm install`
3. Copie `.env.example` para `.env`
4. Configure `EXPO_PUBLIC_API_URL` com a URL HTTPS real do backend Render (sem barra final).
5. Inicie: `npx expo start`
6. Leia o QR Code com o Expo Go no Android.

O computador e o celular devem estar na mesma rede Wi-Fi. Se a rede bloquear conexões locais, tente `npx expo start --tunnel`.

## Implementado nesta fundação
- Expo Router com navegação por abas.
- Login e cadastro de consumidor usando a API existente.
- JWT armazenado com Expo SecureStore.
- Perfil carregado por `GET /auth/profile`.
- Catálogo inicial consumindo `GET /produtos`.
- Estrutura inicial para Início, Comparador, Minha lista e Conta.
- Tema visual mobile próprio, mantendo a identidade verde do QuantoTá.

## Limites desta etapa
- Comparador e Minha lista ainda são telas iniciais; os contratos completos e ações serão integrados em etapas posteriores.
- A consulta de catálogo precisa ser testada com a URL e os parâmetros exatos aceitos pelo backend.
- Não há chaves administrativas nem acesso direto ao Supabase no aplicativo.
- Nenhuma tabela, usuário, dado, endpoint ou arquivo do site/backend foi alterado nesta etapa.
- Para compilar builds de loja, configure posteriormente EAS Build e os identificadores finais de publicação.
