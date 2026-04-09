-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS jogo_financeiro;
USE jogo_financeiro;

-- Criação da tabela de jogadores
CREATE TABLE IF NOT EXISTS jogador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    saldo DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    nivel INT NOT NULL DEFAULT 1
);

-- Criação da tabela de ativos FII
CREATE TABLE IF NOT EXISTS ativos_fii (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticker VARCHAR(10) NOT NULL UNIQUE,
    valor_cota DECIMAL(10,2) NOT NULL,
    dividendo_mensal DECIMAL(10,4) NOT NULL -- Valor em R$ pago por cota ao mês
);

-- Criação da tabela de carteira do jogador
CREATE TABLE IF NOT EXISTS carteira (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_jogador INT NOT NULL,
    id_fii INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 0,
    preco_medio DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_jogador) REFERENCES jogador(id) ON DELETE CASCADE,
    FOREIGN KEY (id_fii) REFERENCES ativos_fii(id) ON DELETE RESTRICT
);

-- Criação da tabela de histórico de transações
CREATE TABLE IF NOT EXISTS historico_transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_jogador INT NOT NULL,
    id_fii INT NOT NULL,
    tipo_operacao ENUM('COMPRA', 'VENDA', 'RENDIMENTO') NOT NULL,
    quantidade INT NOT NULL,
    valor_cota_operacao DECIMAL(10,2) NOT NULL,
    data_operacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_jogador) REFERENCES jogador(id) ON DELETE CASCADE,
    FOREIGN KEY (id_fii) REFERENCES ativos_fii(id) ON DELETE RESTRICT
);

-- Criação do usuário do TCC com o princípio de privilégio mínimo
CREATE USER IF NOT EXISTS 'usuario_tcc'@'localhost' IDENTIFIED BY 'senha_grupo_123';

-- Remoção de todos os privilégios prévios por garantia e atribuição apenas dos necessários
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'usuario_tcc'@'localhost';
GRANT SELECT, INSERT, UPDATE ON jogo_financeiro.* TO 'usuario_tcc'@'localhost';
FLUSH PRIVILEGES;

-- Inserção de 5 FIIs de exemplo na tabela
INSERT INTO ativos_fii (ticker, valor_cota, dividendo_mensal) VALUES
('MXRF11', 10.45, 0.1100),  -- Fundo de Papel
('HGLG11', 165.20, 1.1000), -- Fundo de Logística
('KNRI11', 161.80, 1.0000), -- Fundo Híbrido (Lajes e Galpões)
('XPLG11', 108.50, 0.7800), -- Fundo de Logística
('VISC11', 120.30, 0.8500)  -- Fundo de Shoppings
ON DUPLICATE KEY UPDATE 
    valor_cota = VALUES(valor_cota), 
    dividendo_mensal = VALUES(dividendo_mensal);
