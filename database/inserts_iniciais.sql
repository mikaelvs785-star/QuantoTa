INSERT INTO usuarios (nome, email, senha, telefone, perfil, ativo, data_criacao)
VALUES
('Administrador', 'admin@quantota.com', '123456', '(61) 99999-0000', 'ADMIN', TRUE, NOW()),
('Maria Cliente', 'maria@quantota.com', '123456', '(61) 99999-1111', 'USER', TRUE, NOW());

INSERT INTO produtos (nome, categoria, unidade_medida, marca, descricao, ativo)
VALUES
('Banana prata', 'Frutas', 'kg', 'Sem marca', 'Banana prata fresca', TRUE),
('Arroz 5kg', 'Mercearia', 'pacote', 'Tio João', 'Arroz branco tipo 1', TRUE),
('Leite integral 1L', 'Laticínios', 'caixa', 'Piracanjuba', 'Leite UHT integral', TRUE);

INSERT INTO mercados (nome, endereco, bairro, cidade, estado, telefone, ativo)
VALUES
('Mercado Econômico', 'Rua das Flores, 100', 'Centro', 'Brasília', 'DF', '(61) 3333-0001', TRUE),
('SuperPreço', 'Av. Central, 200', 'Asa Norte', 'Brasília', 'DF', '(61) 3333-0002', TRUE);

INSERT INTO precos (produto_id, mercado_id, usuario_cadastro_id, valor, data_coleta, observacao, data_cadastro, data_atualizacao)
VALUES
(1, 1, 1, 4.99, CURDATE(), 'Oferta da semana', NOW(), NOW()),
(1, 2, 1, 5.49, CURDATE(), 'Preço regular', NOW(), NOW()),
(2, 1, 1, 24.90, CURDATE(), 'Pacote econômico', NOW(), NOW()),
(2, 2, 1, 26.50, CURDATE(), 'Preço regular', NOW(), NOW()),
(3, 1, 1, 5.89, CURDATE(), 'Leite integral', NOW(), NOW()),
(3, 2, 1, 6.19, CURDATE(), 'Leite integral', NOW(), NOW());
