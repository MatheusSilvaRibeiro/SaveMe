import pool from '../db.js';
import bcrypt from 'bcrypt';

export async function criarUsuario(req, res) {
  try {
    const { nome, email, usuario, senha } = req.body;

    // Validação
    if (!nome || !email || !usuario || !senha) {
      return res.status(400).json({ erro: 'Nome, email, usuário e senha são obrigatórios' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, usuario, senha) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, usuario',
      [nome, email, usuario, senhaHash]
    );

    return res.status(201).json({
      mensagem: 'Usuário criado com sucesso',
      usuario: result.rows[0]
    });

  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao criar usuário', detalhes: erro.message });
  }
}

export async function listarUsuarios(req, res) {
  try {
    const result = await pool.query('SELECT id, nome, email, usuario FROM usuarios ORDER BY id');
    return res.json({ total: result.rows.length, usuarios: result.rows });

  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao listar usuários', detalhes: erro.message });
  }
}

export async function buscarUsuario(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, nome, email, usuario FROM usuarios WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    return res.json(result.rows[0]);

  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao buscar usuário', detalhes: erro.message });
  }
}

export async function atualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    const { nome, email, usuario } = req.body;

    const result = await pool.query(
      'UPDATE usuarios SET nome = COALESCE($1, nome), email = COALESCE($2, email), usuario = COALESCE($3, usuario) WHERE id = $4 RETURNING id, nome, email, usuario',
      [nome, email, usuario, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    return res.json({
      mensagem: 'Usuário atualizado com sucesso',
      usuario: result.rows[0]
    });

  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao atualizar usuário', detalhes: erro.message });
  }
}

export async function deletarUsuario(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM usuarios WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    return res.json({ mensagem: 'Usuário deletado com sucesso' });

  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao deletar usuário', detalhes: erro.message });
  }
}
