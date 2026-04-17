USE quantota;

INSERT INTO usuarios (nome, email, senha, perfil) VALUES
('Administrador', 'admin@quantota.com', '123456', 'ADMIN'),
('Usuário Teste', 'user@quantota.com', '123456', 'USER');

INSERT INTO produtos (nome, categoria, unidade_medida, marca, descricao, ativo) VALUES
('Banana Prata', 'Frutas', 'kg', 'Sem marca', 'Banana prata para consumo diário', true),
('Arroz 5kg', 'Grãos', 'pacote', 'Tio João', 'Arroz branco tipo 1', true),
('Leite Integral 1L', 'Laticínios', 'litro', 'Italac', 'Leite integral longa vida', true);

INSERT INTO mercados (nome, endereco, bairro, cidade, estado, telefone, ativo) VALUES
('Mercado Central', 'Rua A, 100', 'Centro', 'Brasília', 'DF', '(61) 99999-0001', true),
('Super Economia', 'Av. B, 200', 'Sul', 'Brasília', 'DF', '(61) 99999-0002', true);

INSERT INTO precos (produto_id, mercado_id, valor, data_coleta, observacao) VALUES
(1, 1, 5.99, CURDATE(), 'Preço promocional'),
(1, 2, 6.49, CURDATE(), 'Preço normal'),
(2, 1, 28.90, CURDATE(), 'Pacote 5kg'),
(2, 2, 27.50, CURDATE(), 'Mais barato hoje'),
(3, 1, 4.99, CURDATE(), 'Caixa com 1L'),
(3, 2, 5.25, CURDATE(), 'Sem promoção');
