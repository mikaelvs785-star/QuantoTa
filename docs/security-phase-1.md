# Fase 1 — segurança

Esta branch propõe endurecimento da autenticação e CORS. Nenhuma alteração foi aplicada à main.

## Mudanças
- Login aceita somente senhas BCrypt. **Contas legadas com senhas em texto puro não conseguirão entrar** até uma migração segura ou redefinição de senha. Verifique o banco antes do merge; não converta senhas em claro para logs ou commits.
- Limite de 5 falhas por IP de conexão em janela de 15 minutos, retornando HTTP 429. Usa armazenamento em memória por instância: para produção com múltiplas réplicas, adotar Redis/gateway compartilhado e política de limpeza/limites de memória.
- Não confiar em X-Forwarded-For sem proxy explicitamente confiável. Atrás de um proxy reverso, configure a identificação correta do cliente e valide os limites por IP e por conta.
- CORS aceita origens explícitas, configuradas por APP_CORS_ALLOWED_ORIGINS (lista separada por vírgulas). Padrão local: http://localhost:5173.

## Validação obrigatória antes de merge
1. Executar `cd backend && ./gradlew test` (Windows: `gradlew.bat test`).
2. Testar login BCrypt válido, inválido, bloqueio 429 e recuperação após a janela.
3. Verificar CORS para origem autorizada e não autorizada, inclusive preflight OPTIONS.
4. Testar em ambiente de homologação com proxy e mais de uma instância se aplicável.
5. Planejar recuperação de contas legadas, monitorar impacto e fazer backup do banco.

## Fora deste PR
Migração versionada do banco, revisão do armazenamento do JWT no navegador e política de autenticação distribuída. Esses itens exigem desenho e rollout separados.
