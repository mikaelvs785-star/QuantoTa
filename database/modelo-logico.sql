


-- ...existing code...
/*
Relacionamentos:
*/
usuario 1:N lista_compra
lista_compra 1:N item_lista_compra
produto 1:N preco
mercado 1:N preco
produto 1:N item_lista_compra
*/

DROP TABLE IF EXISTS item_lista_compra;
DROP TABLE IF EXISTS preco;
DROP TABLE IF EXISTS lista_compra;
DROP TABLE IF EXISTS mercado;
DROP TABLE IF EXISTS produto;
DROP TABLE IF EXISTS usuario;

CREATE TABLE usuario (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produto (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  codigo VARCHAR(100),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mercado (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  endereco VARCHAR(300),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lista_compra (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200),
  usuario_id BIGINT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_lista_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuario(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE preco (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  produto_id BIGINT NOT NULL,
  mercado_id BIGINT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_preco_produto FOREIGN KEY (produto_id)
    REFERENCES produto(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_preco_mercado FOREIGN KEY (mercado_id)
    REFERENCES mercado(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE item_lista_compra (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  lista_compra_id BIGINT NOT NULL,
  produto_id BIGINT NOT NULL,
  quantidade INT DEFAULT 1,
  comprado BOOLEAN DEFAULT FALSE,
  preco_estimado DECIMAL(10,2),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_item_lista FOREIGN KEY (lista_compra_id)
    REFERENCES lista_compra(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_item_produto FOREIGN KEY (produto_id)
    REFERENCES produto(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
-- ...existing code...