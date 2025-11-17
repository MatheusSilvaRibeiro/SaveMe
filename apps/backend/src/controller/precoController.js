import pool from '../db.js';

//  CRIAR PREÇO 
export async function criarPreco(req, res) {
  try {
    const { jogo_id, plataforma_id, valor } = req.body;

    if (!jogo_id || !plataforma_id || !valor) {
      return res.status(400).json({
        erro: "Jogo ID, Plataforma ID e Valor são obrigatórios"
      });
    }

    const jogoExiste = await pool.query(
      'SELECT id FROM jogos WHERE id = $1',
      [jogo_id]
    );
    if (jogoExiste.rows.length === 0) {
      return res.status(404).json({ erro: 'Jogo não encontrado' });
    }

    const plataformaExiste = await pool.query(
      'SELECT id FROM plataformas WHERE id = $1',
      [plataforma_id]
    );
    if (plataformaExiste.rows.length === 0) {
      return res.status(404).json({ erro: 'Plataforma não encontrada' });
    }

    const result = await pool.query(
      'INSERT INTO precos (jogo_id, plataforma_id, valor) VALUES ($1, $2, $3) RETURNING *',
      [jogo_id, plataforma_id, valor]
    );

    res.status(201).json({
      mensagem: 'Preço criado com sucesso',
      preco: result.rows[0]
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      erro: 'Erro ao criar preço',
      detalhes: erro.message
    });
  }
}

// LISTAR TODOS OS PREÇOS 
export async function listarPrecos(req, res) {
  try {
    const result = await pool.query(
      `SELECT 
        precos.*,
        jogos.titulo AS jogo_titulo,
        plataformas.nome AS plataforma_nome
      FROM precos
      LEFT JOIN jogos ON precos.jogo_id = jogos.id
      LEFT JOIN plataformas ON precos.plataforma_id = plataformas.id
      ORDER BY precos.id`
    );

    res.json({
      total: result.rows.length,
      precos: result.rows
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      erro: 'Erro ao listar preços',
      detalhes: erro.message
    });
  }
}

//  BUSCAR PREÇO POR ID 
export async function buscarPreco(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        precos.*,
        jogos.titulo AS jogo_titulo,
        plataformas.nome AS plataforma_nome
      FROM precos
      LEFT JOIN jogos ON precos.jogo_id = jogos.id
      LEFT JOIN plataformas ON precos.plataforma_id = plataformas.id
      WHERE precos.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Preço não encontrado' });
    }

    res.json(result.rows[0]);

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      erro: 'Erro ao buscar preço',
      detalhes: erro.message
    });
  }
}

// BUSCAR PREÇOS POR JOGO 
export async function buscarPrecosPorJogo(req, res) {
  try {
    const { jogo_id } = req.params;

    const result = await pool.query(
      `SELECT 
        precos.*,
        jogos.titulo AS jogo_titulo,
        plataformas.nome AS plataforma_nome
      FROM precos
      LEFT JOIN jogos ON precos.jogo_id = jogos.id
      LEFT JOIN plataformas ON precos.plataforma_id = plataformas.id
      WHERE precos.jogo_id = $1
      ORDER BY precos.valor ASC`,
      [jogo_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Nenhum preço encontrado para este jogo' });
    }

    res.json({
      total: result.rows.length,
      precos: result.rows
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      erro: 'Erro ao buscar preços por jogo',
      detalhes: erro.message
    });
  }
}

// ATUALIZAR PREÇO 
export async function atualizarPreco(req, res) {
  try {
    const { id } = req.params;
    const { valor } = req.body;

    const result = await pool.query(
      'UPDATE precos SET valor = COALESCE($1, valor) WHERE id = $2 RETURNING *',
      [valor, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Preço não encontrado' });
    }

    res.json({
      mensagem: 'Preço atualizado com sucesso',
      preco: result.rows[0]
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      erro: 'Erro ao atualizar preço',
      detalhes: erro.message
    });
  }
}

// ============ DELETAR PREÇO ============
export async function deletarPreco(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM precos WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Preço não encontrado' });
    }

    res.json({ mensagem: 'Preço deletado com sucesso' });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      erro: 'Erro ao deletar preço',
      detalhes: erro.message
    });
  }
}
