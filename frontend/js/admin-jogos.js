/*
  ====================================================
  ADMIN-JOGOS.JS - CRUD DE JOGOS
  ====================================================
  
  Responsável por:
  - CREATE: Adicionar novo jogo
  - READ: Listar jogos
  - UPDATE: Editar jogo
  - DELETE: Deletar jogo
*/

// ====================================================
// VARIÁVEIS GLOBAIS
// ====================================================

let jogos_lista = [];          // Lista de jogos carregados
let modo_edicao = false;       // true = editando / false = criando
let jogo_em_edicao_id = null;  // ID do jogo em edição

// ====================================================
// AO CARREGAR A PÁGINA
// ====================================================

document.addEventListener('DOMContentLoaded', async function() {
  console.log('✅ Página Admin Jogos carregada');

  await carregarJogos();
  configurarEventos();
});


// ====================================================
// FUNÇÃO: CARREGAR JOGOS
// ====================================================

async function carregarJogos() {
  console.log('📥 Carregando jogos...');

  try {
    const resultado = await listarJogos();

    if (resultado && resultado.jogos) {
      jogos_lista = resultado.jogos;

      console.log(`✅ ${jogos_lista.length} jogos carregados`);

      document.getElementById('totalJogos').textContent = jogos_lista.length;

      mostrarTabelaJogos();
    }

  } catch (erro) {
    console.error('❌ Erro ao carregar jogos:', erro);

    document.getElementById('areaTabela').innerHTML =
      '<div class="alert alert-danger">Erro ao carregar jogos</div>';
  }
}


// ====================================================
// CONFIGURAR EVENTOS
// ====================================================

function configurarEventos() {
  document.getElementById('formJogo').addEventListener('submit', salvarJogo);
  document.getElementById('btnCancelar').addEventListener('click', cancelarEdicao);
}


// ====================================================
// SALVAR JOGO (CREATE ou UPDATE)
// ====================================================

async function salvarJogo(evento) {
  evento.preventDefault();

  console.log('💾 Salvando jogo...');

  const titulo = document.getElementById('inputTitulo').value.trim();
  const desenvolvedora = document.getElementById('inputDesenvolvedora').value.trim();
  const genero = document.getElementById('inputGenero').value.trim();
  const descricao = document.getElementById('inputDescricao').value.trim();
  const data_lancamento = document.getElementById('inputData').value;
  const jogo_id = document.getElementById('inputJogoId').value;

  // ======== Validação ========
  if (!titulo || !desenvolvedora || !genero || !descricao || !data_lancamento) {
    mostrarMensagemForm('⚠️ Preencha todos os campos!', 'warning');
    return;
  }

  const dados_jogo = {
    titulo,
    desenvolvedora,
    genero,
    descricao,
    data_lancamento
  };

  try {
    let resultado;

    if (modo_edicao && jogo_id) {
      console.log(`✏️ Atualizando jogo ${jogo_id}...`);
      resultado = await atualizarJogo(jogo_id, dados_jogo);
    } else {
      console.log('➕ Criando novo jogo...');
      resultado = await criarJogo(dados_jogo);
    }

    if (resultado) {
      mostrarMensagemForm('✅ Jogo salvo com sucesso!', 'success');

      limparFormulario();
      cancelarEdicao();
      await carregarJogos();
    }

  } catch (erro) {
    console.error('❌ Erro ao salvar:', erro);
    mostrarMensagemForm('❌ Erro ao salvar jogo', 'danger');
  }
}


// ====================================================
// MOSTRAR TABELA
// ====================================================

function mostrarTabelaJogos() {
  console.log('📊 Exibindo tabela de jogos...');

  if (jogos_lista.length === 0) {
    document.getElementById('areaTabela').innerHTML =
      '<div class="alert alert-info">Nenhum jogo cadastrado ainda</div>';
    return;
  }

  const linhas = jogos_lista.map(jogo => `
    <tr>
      <td>${jogo.id}</td>
      
      <td>
        <strong>${jogo.titulo}</strong>
        <br>
        <small class="text-muted">${jogo.desenvolvedora}</small>
      </td>
      
      <td>${jogo.genero}</td>
      
      <td>${formatarData(jogo.data_lancamento)}</td>

      <td>
        <button class="btn btn-sm btn-warning btn-acao" onclick="editarJogo(${jogo.id})">
          <i class="bi bi-pencil"></i> Editar
        </button>

        <button class="btn btn-sm btn-danger btn-acao" onclick="confirmarDelecao(${jogo.id})">
          <i class="bi bi-trash"></i> Deletar
        </button>
      </td>
    </tr>
  `).join('');

  document.getElementById('areaTabela').innerHTML = `
    <div class="table-responsive">
      <table class="table table-hover table-jogos">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Jogo</th>
            <th>Gênero</th>
            <th>Lançamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          ${linhas}
        </tbody>
      </table>
    </div>
  `;
}


// ====================================================
// EDITAR JOGO
// ====================================================

function editarJogo(jogo_id) {
  console.log(`✏️ Editando jogo ${jogo_id}...`);

  const jogo = jogos_lista.find(j => j.id === jogo_id);

  if (!jogo) {
    alert('Jogo não encontrado');
    return;
  }

  document.getElementById('inputTitulo').value = jogo.titulo;
  document.getElementById('inputDesenvolvedora').value = jogo.desenvolvedora;
  document.getElementById('inputGenero').value = jogo.genero;
  document.getElementById('inputDescricao').value = jogo.descricao;
  document.getElementById('inputData').value = jogo.data_lancamento;
  document.getElementById('inputJogoId').value = jogo.id;

  modo_edicao = true;
  jogo_em_edicao_id = jogo_id;

  document.getElementById('formTitulo').innerHTML =
    `<i class="bi bi-pencil-square"></i> Editando: ${jogo.titulo}`;

  document.getElementById('btnSalvar').textContent = '✏️ Atualizar Jogo';
  document.getElementById('btnCancelar').style.display = 'block';

  document.getElementById('formJogo').scrollIntoView({ behavior: 'smooth' });
}


// ====================================================
// CANCELAR EDIÇÃO
// ====================================================

function cancelarEdicao() {
  console.log('❌ Cancelando edição');

  limparFormulario();

  modo_edicao = false;
  jogo_em_edicao_id = null;

  document.getElementById('formTitulo').innerHTML =
    '<i class="bi bi-plus-circle"></i> Adicionar Novo Jogo';

  document.getElementById('btnSalvar').innerHTML =
    '<i class="bi bi-check-circle"></i> Salvar Jogo';

  document.getElementById('btnCancelar').style.display = 'none';
}


// ====================================================
// CONFIRMAR DELEÇÃO
// ====================================================

function confirmarDelecao(jogo_id) {
  if (confirm('⚠️ Deseja realmente deletar este jogo?')) {
    deletarJogoConfirmado(jogo_id);
  }
}


// ====================================================
// DELETAR JOGO
// ====================================================

async function deletarJogoConfirmado(jogo_id) {
  console.log(`🗑 Deletando jogo ${jogo_id}...`);

  try {
    const resultado = await deletarJogo(jogo_id);

    if (resultado) {
      alert('✅ Jogo deletado!');
      await carregarJogos();
    }

  } catch (erro) {
    console.error('❌ Erro ao deletar:', erro);
    alert('Erro ao deletar jogo');
  }
}


// ====================================================
// LIMPAR FORMULÁRIO
// ====================================================

function limparFormulario() {
  document.getElementById('formJogo').reset();
  document.getElementById('inputJogoId').value = '';
  document.getElementById('mensagemForm').innerHTML = '';
}


// ====================================================
// MOSTRAR MENSAGEM
// ====================================================

function mostrarMensagemForm(texto, tipo) {
  const html = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${texto}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;

  document.getElementById('mensagemForm').innerHTML = html;

  setTimeout(() => {
    document.getElementById('mensagemForm').innerHTML = '';
  }, 5000);
}


// ====================================================
// FORMATAR DATA
// ====================================================

function formatarData(data) {
  if (!data) return '-';
  
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}


/*
  ====================================================
  FIM DO ARQUIVO
  ====================================================
*/
