require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authMiddleware = require('./middleware/authMiddleware');
const pool = require('./db');
const { router: gameRoutes, runVolatility } = require('./routes/gameRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações de Middleware Básicos
app.use(cors());
app.use(express.json());

// Rota de Teste Simples para o grupo não ver "Cannot GET /"
app.get('/', (req, res) => {
    res.send('EduCash API Online');
});

// Middleware de Autenticação Seletiva (Protege POST, PUT, DELETE. Libera GET)
app.use('/api', authMiddleware);

// Registra as rotas da regra de negócios de mercado financeiro
app.use('/api', gameRoutes);

// Caso o usuário acesse qualquer outra rota na porta 3000, 
// o servidor tentará carregar os arquivos estáticos (HTML/CSS) localizados na raiz (../)
app.use(express.static(path.join(__dirname, '../')));

// Loop de Volatilidade Autônoma Acionada a cada 5 minutos
const CINCO_MINUTOS = 5 * 60 * 1000;
setInterval(async () => {
    try {
        const changes = await runVolatility(pool);
        console.log(`[${new Date().toISOString()}] Volatilidade executada de forma autônoma. Ativos atualizados: ${changes.length}`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Erro na volatilidade do servidor: `, error.message);
    }
}, CINCO_MINUTOS);

// Ligando o Motor do Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor da EduCash API rodando de forma limpa na porta ${PORT}`);
    console.log(`🌐 Rota de Teste inicial: http://localhost:${PORT}/`);
});
