const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'usuario_tcc',
    password: process.env.DB_PASSWORD || 'senha_grupo_123',
    database: process.env.DB_NAME || 'jogo_financeiro',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Testa a conexão logo na inicialização para exibir mensagens amigáveis ao grupo
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexão estabelecida com o banco de dados MySQL com sucesso!');
        connection.release();
    } catch (error) {
        console.error('\n❌ ERRO CRÍTICO: Falha ao tentar conectar no banco de dados.');
        
        switch (error.code) {
            case 'ER_ACCESS_DENIED_ERROR':
                console.error('👉 Solução: Verifique se o usuário (DB_USER) e a senha (DB_PASSWORD) no seu arquivo .env estão idênticos aos cadastrados no banco.');
                break;
            case 'ER_BAD_DB_ERROR':
                console.error(`👉 Solução: O banco de dados chamado "${process.env.DB_NAME || 'jogo_financeiro'}" não foi encontrado.`);
                console.error('👉 Verifique se você executou todo o código do `script_jogo_financeiro.sql` no MySQL Workbench da sua máquina.\n');
                break;
            case 'ECONNREFUSED':
                console.error('👉 Solução: Não consigo achar o serviço do banco no DB_HOST informado.');
                console.error('👉 Verifique se o seu MySQL/XAMPP está iniciado e rodando.\n');
                break;
            default:
                console.error(`👉 Erro desconhecido detectado pelo sistema: ${error.message}\n`);
                break;
        }
    }
})();

module.exports = pool;
