/* PUBLIC.JS — Lógica da página pública do SaveMe */

// Estado global da página
let jogos_encontrados = [];
let precos_atuais = [];

// Quando a página carrega
document.addEventListener('DOMContentLoaded', function () {
  console.log('Página pública carregada');
  configurarEventos();
});

// Registra eventos da interface
function configurarEventos() {

  // Botão "Buscar"
  document.getElementById('btnBuscar')
    .addEventListener('click', buscarJogos);

  // Enter dentro do campo de busca
  document.getElementById('buscarJogo')
    .addEventListener('keypress', function (evento) {
      if (evento.key === 'Enter') buscarJogos();
    });
}

// Busca jogos pelo nome digitado
async function buscarJogos() {
  console.log('Iniciando busca...');

  const termo = document.getElementById('buscarJogo').value.trim();
  if (termo === '') {
    alert('Digite o nome de um jogo.');
    return;
  }

  mostraCarregando();

  try {
    // Chamada à API
    const resultado = await buscarJogo(termo);

    jogos_encontrados = resultado || [];
    console.log(jogos_encontrados.length + ' jogos encontrados');

    mostrarResultados();

  } catch (erro) {
    console.error('Erro ao buscar jogos', erro);
    alert('Erro ao buscar jogos.');
  }
}

// Exibe o loading
function mostraCarregando() {
  document.getElementById('resultados').innerHTML = `
    <div class="loading">
      <div class="spinner-border loading-spinner text-primary"></div>
      <p class="text-muted">Buscando jogos...</p>
    </div>
  `;
}

// Monta lista de resultados
async function mostrarResultados() {

  if (jogos_encontrados.length === 0) {
    document.getElementById('resultados').innerHTML = `
      <div class="message-box message-empty">
        <i class="bi bi-exclamation-triangle"></i>
        Nenhum jogo encontrado.
      </div>
    `;
    return;
  }

  let html = '';

  // Monta card de cada jogo
  for (let jogo of jogos_encontrados) {
    html += await montarCardJogo(jogo);
  }

  document.getElementById('resultados').innerHTML = html;
}

// Monta card visual de cada jogo
async function montarCardJogo(jogo) {
  console.log('Montando card de:', jogo.titulo);

  let tabela_precos_html = '';

  try {
    const precos = await buscarPrecosPorJogo(jogo.id);

    if (!precos || !precos.precos || precos.precos.length === 0) {
      tabela_precos_html = `
        <div class="message-box message-empty">
          <i class="bi bi-info-circle"></i>
          Nenhum preço cadastrado.
        </div>
      `;
    } else {
      tabela_precos_html = montarTabelaPrecos(precos.precos);
    }

  } catch (erro) {
    console.error('Erro ao carregar preços', erro);
    tabela_precos_html = `
      <div class="message-box message-empty">
        <i class="bi bi-info-circle"></i>
        Não foi possível carregar os preços.
      </div>
    `;
  }

  return `
    <div class="jogo-card">

      <div class="jogo-header">
        <h2 class="jogo-titulo">
          <i class="bi bi-controller"></i> ${jogo.titulo}
        </h2>
        <p class="jogo-desenvolvedora">
          <i class="bi bi-person"></i> ${jogo.desenvolvedora}
        </p>
      </div>

      <div class="jogo-body">

        <div class="jogo-info">
          <div class="info-item">
            <div class="info-label"><i class="bi bi-tag"></i> Gênero</div>
            <div class="info-value">${jogo.genero}</div>
          </div>

          <div class="info-item">
            <div class="info-label"><i class="bi bi-calendar"></i> Lançamento</div>
            <div class="info-value">${formatarData(jogo.data_lancamento)}</div>
          </div>
        </div>

        <div class="jogo-descricao">
          <strong>Descrição:</strong>
          <p>${jogo.descricao}</p>
        </div>

        <div>
          <h5 class="precos-title"><i class="bi bi-tag-fill"></i> Preços por Plataforma</h5>
          ${tabela_precos_html}
        </div>

      </div>

    </div>
  `;
}

// Monta tabela com todos os preços
function montarTabelaPrecos(precos) {

  if (!precos || precos.length === 0) {
    return '<p>Sem preços disponíveis.</p>';
  }

  // Ordena por plataforma
  const lista = [...precos]
    .map(p => ({ ...p, valor: parseFloat(p.valor) }))
    .sort((a, b) => a.plataforma_id - b.plataforma_id);

  const menor = Math.min(...lista.map(p => p.valor));

  const linhas = lista.map(preco => {
    const destaque = preco.valor === menor;

    return `
      <tr ${destaque ? 'style="background: rgba(40, 167, 69, 0.1);"' : ''}>
        <td>${preco.plataforma_nome}</td>
        <td>
          <span class="${destaque ? 'preco-menor' : 'preco-valor'}">
            R$ ${preco.valor.toFixed(2).replace('.', ',')}
            ${destaque ? '<span class="badge-menor">⭐ MELHOR PREÇO</span>' : ''}
          </span>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div style="overflow-x: auto;">
      <table class="tabela-precos">
        <thead>
          <tr>
            <th>Plataforma</th>
            <th>Preço</th>
          </tr>
        </thead>
        <tbody>${linhas}</tbody>
      </table>
    </div>
  `;
}

// Formata data YYYY-MM-DD → DD/MM/YYYY
function formatarData(data) {
  if (!data) return '-';
  const [a, m, d] = data.split('-');
  return `${d}/${m}/${a}`;
}
