CREATE DATABASE IF NOT EXISTS quantota;
USE quantota;

CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) NOT NULL
);

CREATE TABLE produtos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    unidade_medida VARCHAR(100),
    marca VARCHAR(100),
    descricao TEXT,
    ativo BOOLEAN NOT NULL
);

CREATE TABLE mercados (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    endereco VARCHAR(255),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    telefone VARCHAR(30),
    ativo BOOLEAN NOT NULL
);

CREATE TABLE precos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    produto_id BIGINT NOT NULL,
    mercado_id BIGINT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_coleta DATE NOT NULL,
    observacao VARCHAR(255),
    CONSTRAINT fk_preco_produto FOREIGN KEY (produto_id) REFERENCES produtos(id),
    CONSTRAINT fk_preco_mercado FOREIGN KEY (mercado_id) REFERENCES mercados(id)
);

CREATE TABLE listas_compra (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    nome_lista VARCHAR(255) NOT NULL,
    data_criacao DATE NOT NULL,
    CONSTRAINT fk_lista_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE itens_lista_compra (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lista_compra_id BIGINT NOT NULL,
    produto_id BIGINT NOT NULL,
    quantidade INT NOT NULL,
    CONSTRAINT fk_item_lista FOREIGN KEY (lista_compra_id) REFERENCES listas_compra(id),
    CONSTRAINT fk_item_produto FOREIGN KEY (produto_id) REFERENCES produtos(id)
);
