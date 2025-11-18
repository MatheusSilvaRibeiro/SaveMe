// =========================
// CONFIGURAÇÕES INICIAIS
// =========================

let precosTemporarios = [];
let modo_edicao = false;
let jogo_editando_id = null;

// =========================
// BUSCAR E MONTAR TABELA
// =========================

async function carregarJogos() {
  const area = document.getElementById("areaTabela");
  area.innerHTML = `
    <div class="text-center py-4">
      <div class="spinner-border" role="status"></div>
      <p class="mt-2">Carregando jogos...</p>
    </div>
  `;

  const dados = await listarJogos();

  if (!dados?.jogos) {
    area.innerHTML = `<p class="text-danger">Erro ao carregar jogos.</p>`;
    return;
  }

  area.innerHTML = montarTabelaJogos(dados.jogos);
}

function montarTabelaJogos(lista) {
  const linhas = lista.map(j => `
    <tr>
      <td>${j.id}</td>
      <td>${j.titulo}</td>
      <td>${j.genero}</td>
      <td>${j.desenvolvedora}</td>
      <td>${j.data_lancamento?.slice(0, 10) ?? "-"}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="carregarParaEdicao(${j.id})">
          <i class="bi bi-pencil"></i> Editar
        </button>
        <button class="btn btn-danger btn-sm" onclick="confirmarDelete(${j.id})">
          <i class="bi bi-trash"></i> Excluir
        </button>
      </td>
    </tr>
  `).join('');

  return `
    <table class="table table-striped table-hover">
      <thead class="table-dark">
        <tr>
          <th>ID</th><th>Título</th><th>Gênero</th><th>Desenvolvedora</th><th>Lançamento</th><th>Ações</th>
        </tr>
      </thead>
      <tbody>${linhas}</tbody>
    </table>
  `;
}

// =========================
// DELETAR
// =========================

async function confirmarDelete(id) {
  if (!confirm("Tem certeza que deseja excluir este jogo?")) return;

  const resposta = await deletarJogo(id);

  alert(resposta?.mensagem ? "Jogo removido com sucesso!" : "Erro ao remover jogo.");

  if (resposta?.mensagem) carregarJogos();
}

// =========================
// ETAPAS
// =========================

function irParaEtapa2() {
  const t = document.getElementById("inputTitulo").value.trim();
  const d = document.getElementById("inputDesenvolvedora").value.trim();
  const g = document.getElementById("inputGenero").value.trim();
  const dt = document.getElementById("inputData").value;

  if (!t || !d || !g || !dt) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  document.getElementById("etapa1").classList.remove("ativa");
  document.getElementById("etapa2").classList.add("ativa");
  atualizarProgresso(50, "Etapa 2 de 2");
}

function voltarParaEtapa1() {
  document.getElementById("etapa2").classList.remove("ativa");
  document.getElementById("etapa1").classList.add("ativa");
  atualizarProgresso(0, "Etapa 1 de 2");
}

function atualizarProgresso(perc, texto) {
  document.getElementById("progressBar").style.width = perc + "%";
  document.getElementById("progressText").innerText = texto;
}

// =========================
// PREÇOS
// =========================

function adicionarPrecoTemporario() {
  const plataforma = document.getElementById("selectPlataforma").value;
  const valor = document.getElementById("inputValor").value;

  if (!plataforma || !valor) {
    alert("Preencha todos os campos de preço!");
    return;
  }

  precosTemporarios.push({ plataforma_id: plataforma, valor });
  renderizarPrecos();
}

function renderizarPrecos() {
  const area = document.getElementById("areaPrecos");

  if (precosTemporarios.length === 0) {
    area.innerHTML = `<div class="alert alert-info">Nenhum preço adicionado ainda.</div>`;
    return;
  }

  const linhas = precosTemporarios.map(item => `
    <tr>
      <td>${item.plataforma_id}</td>
      <td>${item.valor}</td>
    </tr>
  `).join('');

  area.innerHTML = `
    <table class="table table-sm table-bordered">
      <thead class="table-secondary">
        <tr><th>Plataforma</th><th>Preço (R$)</th></tr>
      </thead>
      <tbody>${linhas}</tbody>
    </table>
  `;
}

// =========================
// SALVAR
// =========================

async function salvarJogoCompleto() {
  const dados = {
    titulo: document.getElementById("inputTitulo").value,
    desenvolvedora: document.getElementById("inputDesenvolvedora").value,
    genero: document.getElementById("inputGenero").value,
    descricao: document.getElementById("inputDescricao").value,
    data_lancamento: document.getElementById("inputData").value
  };

  try {
    const resposta = modo_edicao && jogo_editando_id
      ? await atualizarJogo(jogo_editando_id, dados)
      : await criarJogo(dados);

    if (!resposta?.jogo && !resposta?.mensagem) {
      alert("Erro ao salvar jogo.");
      return;
    }

    // Corrige variável errada (jogoId não existia)
    const jogoId = modo_edicao ? jogo_editando_id : resposta.jogo.id;

    for (let preco of precosTemporarios) {
      if (preco.id) {
        await atualizarPreco(preco.id, { valor: preco.valor });
      } else {
        await criarPreco({
          jogo_id: jogoId,
          plataforma_id: preco.plataforma_id,
          valor: preco.valor
        });
      }
    }

    alert("✅ Jogo salvo com sucesso!");
    window.location.reload();

  } catch (erro) {
    console.error('❌ Erro:', erro);
    alert("❌ Erro ao salvar jogo");
  }
}

// =========================
// INICIALIZAÇÃO
// =========================

window.onload = async () => {
  await carregarJogos();
  const select = document.getElementById("selectPlataforma");
  const dados = await listarPlataformas();

  dados?.plataformas?.forEach(p => {
    select.innerHTML += `<option value="${p.id}">${p.nome}</option>`;
  });
};
