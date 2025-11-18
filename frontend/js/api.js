const URL_BASE = 'http://localhost:3000/api';
// Função genérica de requisições

async function fazRequisicao(endpoint, metodo = 'GET', dados = null) {
  try {
    const url = `${URL_BASE}${endpoint}`;  // Monta a URL da API
    console.log(`📡 Requisição ${metodo}: ${url}`);
    
    const opcoes = {
      method: metodo,                     // Método HTTP (GET, POST...)
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (dados) {
      opcoes.body = JSON.stringify(dados); // Envia dados no corpo, se existir
    }
    
    const resposta = await fetch(url, opcoes); // Chama a API
    console.log(`📡 Status: ${resposta.status}`);
    
    if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);

    return await resposta.json();           // Retorna os dados da API
  } catch (erro) {
    console.error(' Erro na requisição:', erro);
    return null;                            // Em caso de erro, retorna null
  }
}


// JOGOS
async function listarJogos() {
  return await fazRequisicao('/jogos', 'GET'); // Busca todos os jogos
}

async function buscarJogo(nome) {

  const resultado = await listarJogos();       // Filtra jogos pelo nome

  return resultado.jogos.filter(jogo =>
    jogo.titulo.toLowerCase().includes(nome.toLowerCase())
  );
}

async function buscarJogoPorId(jogo_id) {
  const resultado = await fazRequisicao(`/jogos/${jogo_id}`, 'GET');
  return resultado;
}

async function buscarJogoPorId(jogo_id) {
  const resultado = await fazRequisicao(`/jogos/${jogo_id}`, 'GET');
  return resultado;
}

// PREÇOS
async function buscarPrecosPorJogo(jogo_id) {
  return await fazRequisicao(`/precos/jogo/${jogo_id}`, 'GET'); // Preços por jogo
}

async function listarPrecos() {
  return await fazRequisicao('/precos', 'GET'); // Lista todos os preços
}

async function criarPreco(preco_data) {
  return await fazRequisicao('/precos', 'POST', preco_data); // Cria preço
}

async function atualizarPreco(preco_id, preco_data) {
  return await fazRequisicao(`/precos/${preco_id}`, 'PUT', preco_data); // Atualiza
}

async function deletarPreco(preco_id) {
  return await fazRequisicao(`/precos/${preco_id}`, 'DELETE'); // Deleta
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
  return await fazRequisicao(`/plataformas/${plataforma_id}`, 'DELETE'); // Deleta
}

// USUÁRIOS
async function criarUsuario(usuario_data) {
  return await fazRequisicao('/usuarios', 'POST', usuario_data); // Cria usuário
}

// JOGOS - CRUD
async function criarJogo(jogo_data) {
  return await fazRequisicao('/jogos', 'POST', jogo_data); // Cria jogo
}

async function atualizarJogo(jogo_id, jogo_data) {
  return await fazRequisicao(`/jogos/${jogo_id}`, 'PUT', jogo_data); // Atualiza
}

async function deletarJogo(jogo_id) {
  return await fazRequisicao(`/jogos/${jogo_id}`, 'DELETE'); // Deleta
}
