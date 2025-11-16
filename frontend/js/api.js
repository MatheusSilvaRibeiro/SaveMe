const URL_BASE = 'http://localhost:3000/api';

// ======================================================
// Função genérica de requisições
// ======================================================
async function fazRequisicao(endpoint, metodo = 'GET', dados = null) {
  try {
    const url = `${URL_BASE}${endpoint}`;
    console.log(`📡 Requisição ${metodo}: ${url}`);
    
    const opcoes = {
      method: metodo,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (dados) {
      opcoes.body = JSON.stringify(dados);
    }
    
    const resposta = await fetch(url, opcoes);
    console.log(`📡 Status: ${resposta.status}`);
    
    if (!resposta.ok) {
      console.error(`Erro HTTP ${resposta.status}`);
      throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
    }
    
    const dados_resposta = await resposta.json();
    console.log('✅ Dados recebidos:', dados_resposta);
    
    return dados_resposta;
  } catch (erro) {
    console.error('❌ Erro na requisição:', erro);
    return null;
  }
}

// ======================================================
// JOGOS
// ======================================================
async function listarJogos() {
  console.log('🔍 GET /jogos');
  return await fazRequisicao('/jogos', 'GET');
}

async function buscarJogo(nome) {
  console.log(`🔍 Buscando jogo: ${nome}`);

  if (!nome || nome.trim() === "") {
    console.log("❌ Nome vazio, retornando lista vazia");
    return [];
  }

  try {
    const resultado = await listarJogos();

    if (!resultado || !resultado.jogos) {
      console.log("Nenhum resultado encontrado.");
      return [];
    }

    const filtrados = resultado.jogos.filter(jogo =>
      jogo.titulo.toLowerCase().includes(nome.toLowerCase())
    );

    return filtrados;
  } catch (erro) {
    console.error("Erro ao buscar jogo:", erro);
    return [];
  }
}

// ======================================================
// PREÇOS
// ======================================================
async function buscarPrecosPorJogo(jogo_id) {
  console.log(`💰 GET /precos/jogo/${jogo_id}`);
  return await fazRequisicao(`/precos/jogo/${jogo_id}`, 'GET');
}

async function listarPrecos() {
  console.log('💰 GET /precos');
  return await fazRequisicao('/precos', 'GET');
}

async function criarPreco(preco_data) {
  console.log('➕ POST /precos', preco_data);
  return await fazRequisicao('/precos', 'POST', preco_data);
}

async function atualizarPreco(preco_id, preco_data) {
  console.log(`✏️ PUT /precos/${preco_id}`, preco_data);
  return await fazRequisicao(`/precos/${preco_id}`, 'PUT', preco_data);
}

async function deletarPreco(preco_id) {
  console.log(`🗑 DELETE /precos/${preco_id}`);
  return await fazRequisicao(`/precos/${preco_id}`, 'DELETE');
}

// ======================================================
// PLATAFORMAS
// ======================================================
async function listarPlataformas() {
  console.log('🎮 GET /plataformas');
  return await fazRequisicao('/plataformas', 'GET');
}

async function criarPlataforma(plataforma_data) {
  console.log('➕ POST /plataformas', plataforma_data);
  return await fazRequisicao('/plataformas', 'POST', plataforma_data);
}

async function atualizarPlataforma(plataforma_id, plataforma_data) {
  console.log(`✏️ PUT /plataformas/${plataforma_id}`, plataforma_data);
  return await fazRequisicao(`/plataformas/${plataforma_id}`, 'PUT', plataforma_data);
}

async function deletarPlataforma(plataforma_id) {
  console.log(`🗑 DELETE /plataformas/${plataforma_id}`);
  return await fazRequisicao(`/plataformas/${plataforma_id}`, 'DELETE');
}

// ======================================================
// USUÁRIOS
// ======================================================
async function criarUsuario(usuario_data) {
  console.log('➕ POST /usuarios', usuario_data);
  return await fazRequisicao('/usuarios', 'POST', usuario_data);
}

// ======================================================
// JOGOS - CRUD
// ======================================================
async function criarJogo(jogo_data) {
  console.log('➕ POST /jogos', jogo_data);
  return await fazRequisicao('/jogos', 'POST', jogo_data);
}

async function atualizarJogo(jogo_id, jogo_data) {
  console.log(`✏️ PUT /jogos/${jogo_id}`, jogo_data);
  return await fazRequisicao(`/jogos/${jogo_id}`, 'PUT', jogo_data);
}

async function deletarJogo(jogo_id) {
  console.log(`🗑 DELETE /jogos/${jogo_id}`);
  return await fazRequisicao(`/jogos/${jogo_id}`, 'DELETE');
}
