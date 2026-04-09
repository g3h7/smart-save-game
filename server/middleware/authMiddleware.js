require('dotenv').config();

const authMiddleware = (req, res, next) => {
    // Acesso livre para navegação e consultas GET
    if (req.method === 'GET') {
        return next();
    }

    // Ações destrutivas ou de escrita financeira exigem o Header Seguro
    const apiKey = req.headers['x-api-key'];
    const validKey = process.env.API_KEY || 'tcc_grupo_7';

    if (!apiKey || apiKey !== validKey) {
        return res.status(401).json({ 
            error: 'Acesso negado. Ações de modificação exigem o envio do header x-api-key correto para a API.' 
        });
    }

    next();
};

module.exports = authMiddleware;
