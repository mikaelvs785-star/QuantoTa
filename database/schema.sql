CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(30),
    perfil VARCHAR(30) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS produtos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(255),
    unidade_medida VARCHAR(255),
    marca VARCHAR(255),
    descricao VARCHAR(1000),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS mercados (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    endereco VARCHAR(255),
    bairro VARCHAR(255),
    cidade VARCHAR(255),
    estado VARCHAR(255),
    telefone VARCHAR(50),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS solicitacoes_vendedor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    nome_mercado VARCHAR(255) NOT NULL,
    cnpj_mercado VARCHAR(30) NOT NULL,
    endereco_mercado VARCHAR(255),
    bairro VARCHAR(255),
    cidade VARCHAR(255),
    estado VARCHAR(255),
    telefone_mercado VARCHAR(50),
    cargo_vendedor VARCHAR(255),
    observacao VARCHAR(1000),
    status VARCHAR(30) NOT NULL,
    motivo_analise VARCHAR(1000),
    data_solicitacao TIMESTAMP NOT NULL,
    data_analise TIMESTAMP,
    admin_responsavel_id BIGINT,
    CONSTRAINT fk_solic_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_solic_admin FOREIGN KEY (admin_responsavel_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS precos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    produto_id BIGINT NOT NULL,
    mercado_id BIGINT NOT NULL,
    usuario_cadastro_id BIGINT,
    valor DECIMAL(10,2) NOT NULL,
    data_coleta DATE NOT NULL,
    observacao VARCHAR(255),
    data_cadastro TIMESTAMP,
    data_atualizacao TIMESTAMP,
    CONSTRAINT fk_preco_produto FOREIGN KEY (produto_id) REFERENCES produtos(id),
    CONSTRAINT fk_preco_mercado FOREIGN KEY (mercado_id) REFERENCES mercados(id),
    CONSTRAINT fk_preco_usuario FOREIGN KEY (usuario_cadastro_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS listas_compra (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    nome_lista VARCHAR(255) NOT NULL,
    data_criacao DATE NOT NULL,
    CONSTRAINT fk_lista_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS itens_lista_compra (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lista_compra_id BIGINT NOT NULL,
    produto_id BIGINT NOT NULL,
    quantidade INT NOT NULL,
    CONSTRAINT fk_item_lista FOREIGN KEY (lista_compra_id) REFERENCES listas_compra(id),
    CONSTRAINT fk_item_produto FOREIGN KEY (produto_id) REFERENCES produtos(id)
);
