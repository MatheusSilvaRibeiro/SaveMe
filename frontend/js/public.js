/*
  ====================================================
  PUBLIC.JS - LÓGICA DA PÁGINA PÚBLICA
  ====================================================
*/

// ====================================================
// VARIÁVEIS GLOBAIS
// ====================================================
let jogos_encontrados = [];
let precos_atuais = [];

// ====================================================
// QUANDO A PÁGINA CARREGA
// ====================================================
document.addEventListener('DOMContentLoaded', function () {
  console.log('✅ Página pública carregada');
  configurarEventos();
});

// ====================================================
// CONFIGURAR EVENTOS
// ====================================================
function configurarEventos() {
  document.getElementById('btnBuscar').addEventListener('click', buscarJogos);

  document.getElementById('buscarJogo').addEventListener('keypress', function (evento) {
    if (evento.key === 'Enter') buscarJogos();
  });
}

// ====================================================
// BUSCAR JOGOS
// ====================================================
async function buscarJogos() {
  console.log('🔍 Iniciando busca...');

  const inputBuscar = document.getElementById('buscarJogo');
  const termo_busca = inputBuscar.value.trim();

  if (termo_busca === '') {
    alert('⚠️ Digite o nome de um jogo para buscar!');
    return;
  }

  mostraCarregando();

  try {
    const resultado = await buscarJogo(termo_busca);

    jogos_encontrados = resultado || [];

    console.log(`✅ ${jogos_encontrados.length} jogos encontrados`);

    mostrarResultados();

  } catch (erro) {
    console.error('❌ Erro ao buscar jogos:', erro);
    alert('Erro ao buscar jogos');
  }
}

// ====================================================
// MOSTRAR LOADING
// ====================================================
function mostraCarregando() {
  document.getElementById('resultados').innerHTML = `
    <div class="loading">
      <div class="spinner-border loading-spinner text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
      <p class="text-muted">Buscando jogos...</p>
    </div>
  `;
}

// ====================================================
// MOSTRAR RESULTADOS
// ====================================================
async function mostrarResultados() {
  if (jogos_encontrados.length === 0) {
    document.getElementById('resultados').innerHTML = `
      <div class="message-box message-empty">
        <i class="bi bi-exclamation-triangle"></i>
        Nenhum jogo encontrado com esse nome.
      </div>
    `;
    return;
  }

  let html = '';

  for (let jogo of jogos_encontrados) {
    html += await montarCardJogo(jogo);
  }

  document.getElementById('resultados').innerHTML = html;
}

// ====================================================
// MONTAR CARD DO JOGO
// ====================================================
async function montarCardJogo(jogo) {
  console.log(`🎮 Montando card do jogo: ${jogo.titulo}`);

  let tabela_precos_html = '';

  try {
    const precos_resultado = await buscarPrecosPorJogo(jogo.id);

    if (!precos_resultado || !precos_resultado.precos || precos_resultado.precos.length === 0) {
      tabela_precos_html = `
        <div class="message-box message-empty">
          <i class="bi bi-info-circle"></i>
          Nenhum preço registrado para este jogo ainda.
        </div>
      `;
    } else {
      tabela_precos_html = montarTabelaPrecos(precos_resultado.precos);
    }

  } catch (erro) {
    console.error('❌ Erro ao buscar preços:', erro);
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
          <p style="margin: 10px 0 0 0;">${jogo.descricao}</p>
        </div>

        <div>
          <h5 class="precos-title"><i class="bi bi-tag-fill"></i> Preços por Plataforma</h5>
          ${tabela_precos_html}
        </div>

      </div>

    </div>
  `;
}

// ====================================================
// MONTAR TABELA DE PREÇOS
// ====================================================
function montarTabelaPrecos(precos) {

  if (!precos || precos.length === 0) {
    return '<p>Sem preços disponíveis</p>';
  }

  const precos_ordenados = [...precos].sort((a, b) => a.valor - b.valor);
  const menor_preco = precos_ordenados[0].valor;

  const linhas = precos.map(preco => {
    const eh_menor = preco.valor === menor_preco;

    return `
      <tr${eh_menor ? ' style="background: rgba(40, 167, 69, 0.1);"' : ''}>
        <td><i class="bi bi-shop"></i> ${preco.plataforma_nome}</td>
        <td>
          ${eh_menor
            ? `<span class="preco-menor">R$ ${preco.valor.toFixed(2).replace('.', ',')} <span class="badge-menor">⭐ MELHOR PREÇO!</span></span>`
            : `R$ ${preco.valor.toFixed(2).replace('.', ',')}`
          }
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

// ====================================================
// FORMATAR DATA
// ====================================================
function formatarData(data) {
  if (!data) return '-';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}
