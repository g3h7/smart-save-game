-- DML: Dados de Teste Iniciais para o EduCa$h

USE educash;

-- Desativa checagem de chaves estrangeiras temporariamente para inserções limpas
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE investimentos_fii;
TRUNCATE TABLE carteiras;
TRUNCATE TABLE usuarios;
SET FOREIGN_KEY_CHECKS = 1;

-- Inserção de Usuários de Teste (Senha hashada equivalente a '12345678')
INSERT INTO usuarios (id, username, email, password_hash, criado_em) VALUES
(1, 'player_senior', 'senior@educash.com', '$2a$10$eImiTXuGPui12.D5bM9nK.VnFp4Zt1F0Vw6B24/hWnE4eZc7eG1fW', NOW()),
(2, 'player_junior', 'junior@educash.com', '$2a$10$eImiTXuGPui12.D5bM9nK.VnFp4Zt1F0Vw6B24/hWnE4eZc7eG1fW', NOW());

-- Inserção de Carteiras correspondentes
INSERT INTO carteiras (usuario_id, saldo, cdi, cofre, fii, lucro, xp, level, criado_em) VALUES
(1, 1500.50, 5000.00, 2000.00, 350.00, 120.45, 450, 5, NOW()),
(2, 50.00, 0.00, 0.00, 0.00, 0.00, 0, 1, NOW());

-- Inserção de Investimentos FII para o usuário sênior
INSERT INTO investimentos_fii (usuario_id, ticker, valor, cotas, criado_em) VALUES
(1, 'MXRF11', 100.00, 10, NOW()),
(1, 'HGLG11', 250.00, 2, NOW());
