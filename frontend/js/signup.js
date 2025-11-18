const URL_BASE = 'http://localhost:3000/api';

// Requisição genérica para qualquer endpoint da API
async function fazRequisicao(endpoint, metodo = 'GET', dados = null) {
  try {
    const url = `${URL_BASE}${endpoint}`;  // URL final da requisição
    console.log(` ${metodo} → ${url}`);
    
    const opcoes = {
      method: metodo,                     // Método HTTP
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (dados) {
      opcoes.body = JSON.stringify(dados); // Envia dados (POST/PUT)
    }
    
    const resposta = await fetch(url, opcoes); // Chama a API
    console.log(` Status: ${resposta.status}`);
    
    if (!resposta.ok) throw new Error();

    return await resposta.json(); // Retorna o JSON da API
  } catch (erro) {
    console.error(' Erro na requisição:', erro);
    return null; // Retorno seguro
  }
}

// JOGOS
async function listarJogos() {
  return await fazRequisicao('/jogos', 'GET'); // Lista todos os jogos
}

async function buscarJogo(nome) {
  if (!nome || nome.trim() === "") return []; // Evita busca vazia

  const resultado = await listarJogos(); // Busca tudo
  if (!resultado || !resultado.jogos) return [];

  // Filtro por nome do jogo
  return resultado.jogos.filter(jogo =>
    jogo.titulo.toLowerCase().includes(nome.toLowerCase())
  );
}

// PREÇOS
async function buscarPrecosPorJogo(jogo_id) {
  return await fazRequisicao(`/precos/jogo/${jogo_id}`, 'GET'); // Preços do jogo
}

async function listarPrecos() {
  return await fazRequisicao('/precos', 'GET'); // Lista de preços
}

async function criarPreco(preco_data) {
  return await fazRequisicao('/precos', 'POST', preco_data); // Cria preço
}

async function atualizarPreco(preco_id, preco_data) {
  return await fazRequisicao(`/precos/${preco_id}`, 'PUT', preco_data); // Atualiza
}

async function deletarPreco(preco_id) {
  return await fazRequisicao(`/precos/${preco_id}`, 'DELETE'); // Remove
}

// PLATAFORMAS
async function listarPlataformas() {
  return await fazRequisicao('/plataformas', 'GET'); // Lista plataformas
}

async function criarPlataforma(plataforma_data) {
  return await fazRequisicao('/plataformas', 'POST', plataforma_data); // Cria
}

async function atualizarPlataforma(plataforma_id, plataforma_data) {
  return await fazRequisicao(`/plataformas/${plataforma_id}`, 'PUT', plataforma_data); // Atualiza
}

async function deletarPlataforma(plataforma_id) {
  return await fazRequisicao(`/plataformas/${plataforma_id}`, 'DELETE'); // Exclui
}

// USUÁRIOS
async function criarUsuario(usuario_data) {
  return await fazRequisicao('/usuarios', 'POST', usuario_data); // Novo usuário
}

// CRUD DE JOGOS
async function criarJogo(jogo_data) {
  return await fazRequisicao('/jogos', 'POST', jogo_data); // Cria jogo
}

async function atualizarJogo(jogo_id, jogo_data) {
  return await fazRequisicao(`/jogos/${jogo_id}`, 'PUT', jogo_data); // Atualiza
}

async function deletarJogo(jogo_id) {
  return await fazRequisicao(`/jogos/${jogo_id}`, 'DELETE'); // Deleta
}
