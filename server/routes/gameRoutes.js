const express = require('express');
const router = express.Router();
const pool = require('../db');

// Rota de Comprar FII
router.post('/buy', async (req, res) => {
    const { id_jogador, id_fii, quantidade } = req.body;
    const taxa_corretagem = 2.50; // Taxa fixa definida como padrão

    if (!id_jogador || !id_fii || !quantidade || quantidade <= 0) {
        return res.status(400).json({ error: 'Parâmetros inválidos' });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Obter informações do jogador e ativo
        const [jogadores] = await connection.execute('SELECT saldo FROM jogador WHERE id = ? FOR UPDATE', [id_jogador]);
        const [ativos] = await connection.execute('SELECT valor_cota FROM ativos_fii WHERE id = ?', [id_fii]);

        if (jogadores.length === 0) throw new Error('Jogador não encontrado');
        if (ativos.length === 0) throw new Error('Fundo imobiliário não encontrado');

        const saldo = parseFloat(jogadores[0].saldo);
        const valor_cota = parseFloat(ativos[0].valor_cota);
        const valor_total_compra = (quantidade * valor_cota) + taxa_corretagem;

        // 2. Verificar se tem saldo suficiente
        if (saldo < valor_total_compra) {
            throw new Error(`Saldo insuficiente. Necessário: R$ ${valor_total_compra.toFixed(2)}, Atual: R$ ${saldo.toFixed(2)}`);
        }

        // 3. Checar carteira e calcular novo preço médio
        const [carteira] = await connection.execute('SELECT quantidade, preco_medio FROM carteira WHERE id_jogador = ? AND id_fii = ? FOR UPDATE', [id_jogador, id_fii]);
        
        let novo_preco_medio = valor_cota;
        let nova_quantidade = quantidade;

        if (carteira.length > 0) {
            const qtd_atual = parseInt(carteira[0].quantidade);
            const pm_atual = parseFloat(carteira[0].preco_medio);
            nova_quantidade = qtd_atual + quantidade;
            novo_preco_medio = ((qtd_atual * pm_atual) + (quantidade * valor_cota)) / nova_quantidade;

            await connection.execute('UPDATE carteira SET quantidade = ?, preco_medio = ? WHERE id_jogador = ? AND id_fii = ?', 
                                     [nova_quantidade, novo_preco_medio, id_jogador, id_fii]);
        } else {
            await connection.execute('INSERT INTO carteira (id_jogador, id_fii, quantidade, preco_medio) VALUES (?, ?, ?, ?)', 
                                     [id_jogador, id_fii, quantidade, valor_cota]);
        }

        // 4. Subtrair saldo
        await connection.execute('UPDATE jogador SET saldo = saldo - ? WHERE id = ?', [valor_total_compra, id_jogador]);

        // 5. Inserir no histórico
        await connection.execute('INSERT INTO historico_transacoes (id_jogador, id_fii, tipo_operacao, quantidade, valor_cota_operacao) VALUES (?, ?, ?, ?, ?)', 
                                 [id_jogador, id_fii, 'COMPRA', quantidade, valor_cota]);

        await connection.commit();
        res.json({ message: 'Compra realizada com sucesso', valor_total_pago: valor_total_compra, novo_saldo: saldo - valor_total_compra });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

// Rota de Vender FII
router.post('/sell', async (req, res) => {
    const { id_jogador, id_fii, quantidade } = req.body;

    if (!id_jogador || !id_fii || !quantidade || quantidade <= 0) {
        return res.status(400).json({ error: 'Parâmetros inválidos' });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [carteira] = await connection.execute('SELECT quantidade, preco_medio FROM carteira WHERE id_jogador = ? AND id_fii = ? FOR UPDATE', [id_jogador, id_fii]);
        if (carteira.length === 0 || carteira[0].quantidade < quantidade) {
            throw new Error('Quantidade insuficiente na carteira para venda');
        }

        const [ativos] = await connection.execute('SELECT valor_cota FROM ativos_fii WHERE id = ?', [id_fii]);
        if (ativos.length === 0) throw new Error('Ativo não encontrado');

        const valor_cota = parseFloat(ativos[0].valor_cota);
        const preco_medio = parseFloat(carteira[0].preco_medio);
        let valor_bruto = quantidade * valor_cota;
        let imposto = 0;

        // Venda rendeu lucro? Desconta 20% do lucro
        if (valor_cota > preco_medio) {
            const lucro = (valor_cota - preco_medio) * quantidade;
            imposto = lucro * 0.20;
        }

        const valor_liquido = valor_bruto - imposto;

        const nova_quantidade = carteira[0].quantidade - quantidade;
        if (nova_quantidade > 0) {
            await connection.execute('UPDATE carteira SET quantidade = ? WHERE id_jogador = ? AND id_fii = ?', [nova_quantidade, id_jogador, id_fii]);
        } else {
            // Se zerar a posição, podemos optar por excluir ou zerar. Deletaremos.
            await connection.execute('DELETE FROM carteira WHERE id_jogador = ? AND id_fii = ?', [id_jogador, id_fii]);
        }

        // Adiciona valor líquido ao saldo do jogador
        await connection.execute('UPDATE jogador SET saldo = saldo + ? WHERE id = ?', [valor_liquido, id_jogador]);

        // Histórico de Venda
        await connection.execute('INSERT INTO historico_transacoes (id_jogador, id_fii, tipo_operacao, quantidade, valor_cota_operacao) VALUES (?, ?, ?, ?, ?)', 
                                 [id_jogador, id_fii, 'VENDA', quantidade, valor_cota]);

        await connection.commit();
        res.json({ message: 'Venda realizada com sucesso', valor_liquido, imposto_pago: imposto });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

// Rota de Rendimento Mensal (Percorre carteira e deposita)
router.post('/yield', async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Pega todos que tem carteira ativa
        const [posicoes] = await connection.execute(`
            SELECT c.id_jogador, c.id_fii, c.quantidade, a.dividendo_mensal 
            FROM carteira c 
            JOIN ativos_fii a ON c.id_fii = a.id
            WHERE c.quantidade > 0
        `);

        let pagamentos_realizados = 0;

        for (const [index, pos] of posicoes.entries()) {
            const provento = pos.quantidade * parseFloat(pos.dividendo_mensal);

            if (provento > 0) {
                // Deposita no saldo do jogador
                await connection.execute('UPDATE jogador SET saldo = saldo + ? WHERE id = ?', [provento, pos.id_jogador]);

                // Registra o recebimento (tipo_operacao = RENDIMENTO, e valor_cota_operacao guarda o dividendo base)
                await connection.execute(
                    'INSERT INTO historico_transacoes (id_jogador, id_fii, tipo_operacao, quantidade, valor_cota_operacao) VALUES (?, ?, ?, ?, ?)', 
                    [pos.id_jogador, pos.id_fii, 'RENDIMENTO', pos.quantidade, pos.dividendo_mensal]
                );
                
                pagamentos_realizados++;
            }
        }

        await connection.commit();
        res.json({ message: 'Rendimentos distribuídos com sucesso', registros_processados: pagamentos_realizados });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

// Rota Manual de Volatilidade
router.post('/volatility', async (req, res) => {
    try {
        const changes = await runVolatility(pool);
        res.json({ message: 'Volatilidade aplicada com sucesso', ativos_atualizados: changes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Função a parte para ser exportada e usada pelo setInterval
async function runVolatility(dbPool) {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        const [ativos] = await connection.execute('SELECT id, valor_cota FROM ativos_fii');
        let changes = [];
        
        for (let ativo of ativos) {
            // Fator aleatório de -3% até +3% (-0.03 a 0.03)
            const variacao = (Math.random() * 0.06) - 0.03;
            let novo_valor = parseFloat(ativo.valor_cota) * (1 + variacao);
            if(novo_valor <= 0.01) novo_valor = 0.01; // Para não zerar o ativo
            
            await connection.execute('UPDATE ativos_fii SET valor_cota = ? WHERE id = ?', [novo_valor, ativo.id]);
            changes.push({ id_fii: ativo.id, variacao_percentual: (variacao * 100).toFixed(2) + '%', old_price: ativo.valor_cota, new_price: novo_valor });
        }

        await connection.commit();
        return changes;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = { router, runVolatility };
