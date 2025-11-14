// Importa o pool de conexão do banco de dados PostgreSQL
import pool from '../db.js';

// ============ CRIAR JOGO ============
// Função que cria um novo jogo no banco
export async function criarJogo(req, res) {
  try {
    // Desestrutura os dados que vêm do body da requisição
    // req.body = { titulo, desenvolvedora, genero, descricao, data_lancamento }
    const { titulo, desenvolvedora, genero, descricao, data_lancamento } = req.body;

    // Validação: Verifica se titulo foi informado (é obrigatório)
    if (!titulo) {
      // Retorna erro 400 (Bad Request) se faltar título
      return res.status(400).json({ erro: 'Título do jogo é obrigatório' });
    }

    // Executa a query INSERT no banco de dados
    // $1, $2, $3, $4, $5 = placeholders para evitar SQL injection
    // RETURNING * = retorna todos os dados do jogo criado
    const result = await pool.query(
      'INSERT INTO jogos (titulo, desenvolvedora, genero, descricao, data_lancamento) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [titulo, desenvolvedora, genero, descricao, data_lancamento]  // Valores que vão substituir os placeholders
    );

    // Retorna status 201 (Created) com mensagem de sucesso
    res.status(201).json({ 
      mensagem: 'Jogo criado com sucesso', 
      jogo: result.rows[0] 
    });

  } catch (erro) {
    // Se houver erro, mostra no console do servidor
    console.error(erro);
    // Retorna erro 500 (Internal Server Error) com detalhes do erro
    res.status(500).json({ 
      erro: 'Erro ao criar jogo', 
      detalhes: erro.message 
    });
  }
}

// ============ LISTAR TODOS OS JOGOS ============
// Função que retorna todos os jogos do banco
export async function listarJogos(req, res) {
  try {
    // SELECT * = pega todos os campos
    // ORDER BY titulo = ordena alfabeticamente pelo título
    const result = await pool.query('SELECT * FROM jogos ORDER BY titulo');

    // Retorna status 200 (OK) com lista de jogos
    res.json({ 
      total: result.rows.length,  // Quantidade de jogos
      jogos: result.rows          // Array com todos os jogos
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ 
      erro: 'Erro ao listar jogos', 
      detalhes: erro.message 
    });
  }
}

// ============ BUSCAR JOGO POR ID ============
// Função que retorna um jogo específico pelo ID
export async function buscarJogo(req, res) {
  try {
    // Desestrutura o parâmetro de rota :id
    // Vem da URL: /jogos/:id
    const { id } = req.params;

    // Busca o jogo com o ID especificado
    // WHERE id = $1 = condição de busca
    const result = await pool.query('SELECT * FROM jogos WHERE id = $1', [id]);

    // Verifica se encontrou algum resultado
    if (result.rows.length === 0) {
      // Se não encontrou, retorna erro 404 (Not Found)
      return res.status(404).json({ erro: 'Jogo não encontrado' });
    }

    // Retorna o primeiro (e único) jogo encontrado
    res.json(result.rows[0]);

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ 
      erro: 'Erro ao buscar jogo', 
      detalhes: erro.message 
    });
  }
}

// ============ ATUALIZAR JOGO ============
// Função que atualiza um jogo existente
export async function atualizarJogo(req, res) {
  try {
    // Pega o ID da URL
    const { id } = req.params;

    // Pega os dados que podem ser atualizados do body
    const { titulo, desenvolvedora, genero, descricao, data_lancamento } = req.body;

    // COALESCE = função SQL que retorna o primeiro valor não-nulo
    // Se o novo valor for null, mantém o valor anterior
    const result = await pool.query(
      'UPDATE jogos SET titulo = COALESCE($1, titulo), desenvolvedora = COALESCE($2, desenvolvedora), genero = COALESCE($3, genero), descricao = COALESCE($4, descricao), data_lancamento = COALESCE($5, data_lancamento) WHERE id = $6 RETURNING *',
      [titulo, desenvolvedora, genero, descricao, data_lancamento, id]  // Ordem: novos valores + id
    );

    // Verifica se o jogo foi encontrado
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Jogo não encontrado' });
    }

    // Retorna o jogo atualizado
    res.json({ 
      mensagem: 'Jogo atualizado com sucesso', 
      jogo: result.rows[0] 
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ 
      erro: 'Erro ao atualizar jogo', 
      detalhes: erro.message 
    });
  }
}

// ============ DELETAR JOGO ============
// Função que remove um jogo do banco
export async function deletarJogo(req, res) {
  try {
    // Pega o ID da URL
    const { id } = req.params;

    // DELETE FROM = comando para deletar
    // WHERE id = $1 = deleta APENAS o jogo com esse ID
    // RETURNING id = retorna o ID do jogo deletado (confirma que foi deletado)
    const result = await pool.query('DELETE FROM jogos WHERE id = $1 RETURNING id', [id]);

    // Verifica se o jogo existia
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Jogo não encontrado' });
    }

    // Retorna mensagem de sucesso
    res.json({ mensagem: 'Jogo deletado com sucesso' });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ 
      erro: 'Erro ao deletar jogo', 
      detalhes: erro.message 
    });
  }
}