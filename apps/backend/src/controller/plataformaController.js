// Importa o pool de conexão do banco de dados PostgreSQL
import pool from '../db.js';

// ============ CRIAR PLATAFORMA ============
// Função que cria uma nova plataforma (loja de games)
export async function criarPlataforma(req, res) {
  try {
    // Desestrutura os dados que vêm do body da requisição
    // req.body = { nome, url }
    const { nome, url } = req.body;

    // Validação: Verifica se nome foi informado (é obrigatório)
    if (!nome) {
      // Retorna erro 400 (Bad Request) se faltar nome
      return res.status(400).json({ erro: 'Nome da plataforma é obrigatório' });
    }

    // Executa a query INSERT no banco de dados
    // $1, $2 = placeholders para evitar SQL injection
    // RETURNING * = retorna todos os dados da plataforma criada
    const result = await pool.query(
      'INSERT INTO plataformas (nome, url) VALUES ($1, $2) RETURNING *',
      [nome, url]  // Valores que vão substituir os placeholders
    );

    // Retorna status 201 (Created) com mensagem de sucesso
    // result.rows[0] = primeiro registro retornado (a plataforma criada)
    res.status(201).json({ 
      mensagem: 'Plataforma criada com sucesso', 
      plataforma: result.rows[0] 
    });

  } catch (erro) {
    // Se houver erro, mostra no console do servidor
    console.error(erro);
    // Retorna erro 500 (Internal Server Error) com detalhes do erro
    res.status(500).json({ 
      erro: 'Erro ao criar plataforma', 
      detalhes: erro.message 
    });
  }
}

// ============ LISTAR TODAS AS PLATAFORMAS ============
// Função que retorna todas as plataformas do banco
export async function listarPlataformas(req, res) {
  try {
    // SELECT * = pega todos os campos
    // ORDER BY nome = ordena alfabeticamente pelo nome
    const result = await pool.query('SELECT * FROM plataformas ORDER BY nome');

    // Retorna status 200 (OK) com lista de plataformas
    res.json({ 
      total: result.rows.length,  // Quantidade de plataformas
      plataformas: result.rows    // Array com todas as plataformas
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ 
      erro: 'Erro ao listar plataformas', 
      detalhes: erro.message 
    });
  }
}

// ============ BUSCAR PLATAFORMA POR ID ============
// Função que retorna uma plataforma específica pelo ID
export async function buscarPlataforma(req, res) {
  try {
    // Desestrutura o parâmetro de rota :id
    // Vem da URL: /plataformas/:id
    const { id } = req.params;

    // Busca a plataforma com o ID especificado
    // WHERE id = $1 = condição de busca
    const result = await pool.query('SELECT * FROM plataformas WHERE id = $1', [id]);

    // Verifica se encontrou algum resultado
    if (result.rows.length === 0) {
      // Se não encontrou, retorna erro 404 (Not Found)
      return res.status(404).json({ erro: 'Plataforma não encontrada' });
    }

    // Retorna a primeira (e única) plataforma encontrada
    res.json(result.rows[0]);

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ 
      erro: 'Erro ao buscar plataforma', 
      detalhes: erro.message 
    });
  }
}

// ============ ATUALIZAR PLATAFORMA ============
// Função que atualiza uma plataforma existente
export async function atualizarPlataforma(req, res) {
  try {
    // Pega o ID da URL
    const { id } = req.params;

    // Pega os dados que podem ser atualizados do body
    const { nome, url } = req.body;

    // COALESCE = função SQL que retorna o primeiro valor não-nulo
    // Se o novo valor for null, mantém o valor anterior
    const result = await pool.query(
      'UPDATE plataformas SET nome = COALESCE($1, nome), url = COALESCE($2, url) WHERE id = $3 RETURNING *',
      [nome, url, id]  // Ordem: novos valores + id
    );

    // Verifica se a plataforma foi encontrada
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Plataforma não encontrada' });
    }

    // Retorna a plataforma atualizada
    res.json({ 
      mensagem: 'Plataforma atualizada com sucesso', 
      plataforma: result.rows[0] 
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ 
      erro: 'Erro ao atualizar plataforma', 
      detalhes: erro.message 
    });
  }
}

// ============ DELETAR PLATAFORMA ============
// Função que remove uma plataforma do banco
export async function deletarPlataforma(req, res) {
  try {
    // Pega o ID da URL
    const { id } = req.params;

    // DELETE FROM = comando para deletar
    // WHERE id = $1 = deleta APENAS a plataforma com esse ID
    // RETURNING id = retorna o ID da plataforma deletada (confirma que foi deletada)
    const result = await pool.query('DELETE FROM plataformas WHERE id = $1 RETURNING id', [id]);

    // Verifica se a plataforma existia
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Plataforma não encontrada' });
    }

    // Retorna mensagem de sucesso
    res.json({ mensagem: 'Plataforma deletada com sucesso' });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ 
      erro: 'Erro ao deletar plataforma', 
      detalhes: erro.message 
    });
  }
}