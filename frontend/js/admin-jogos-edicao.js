// =========================
// EDITAR JOGO
// =========================

async function carregarParaEdicao(id) {
  console.log(` Carregando jogo ${id} para edição...`);

  try {
    const resultado = await buscarJogoPorId(id);

    console.log(" Resultado bruto:", resultado);
    console.log(" JSON resultado:", JSON.stringify(resultado, null, 2));

    // VALIDAÇÃO FALTAVA IF
    if (!resultado || !resultado.jogo) {
      console.error(" Estrutura inválida, esperado { jogo: { ... } }");
      console.error(" Recebido:", resultado);
      alert("Erro ao carregar jogo.");
      return;
    }

    const jogo = resultado.jogo;
    console.log(" Jogo carregado:", jogo);

    modo_edicao = true;
    jogo_editando_id = id;

    document.getElementById("inputTitulo").value = jogo.titulo;
    document.getElementById("inputDesenvolvedora").value = jogo.desenvolvedora;
    document.getElementById("inputGenero").value = jogo.genero;
    document.getElementById("inputDescricao").value = jogo.descricao;
    document.getElementById("inputData").value = jogo.data_lancamento;

    await carregarPrecos(id);

    document.getElementById("etapa1").classList.add("ativa");
    document.getElementById("etapa2").classList.remove("ativa");

    document.getElementById("formTitulo").innerHTML =
      `<i class="bi bi-pencil-square"></i> Editando: ${jogo.titulo}`;

    document.querySelector("#formTitulo").scrollIntoView({ behavior: "smooth" });

    alert(` Editando: ${jogo.titulo}`);

  } catch (erro) {
    console.error(" Erro ao carregar jogo:", erro);
    console.error(" Stack:", erro.stack);
    alert("Erro ao carregar jogo para edição");
  }
}

// =========================
// PREÇOS
// =========================

async function carregarPrecos(jogoId) {
  const resposta = await fazRequisicao(`/precos/jogo/${jogoId}`, "GET");

  // VALIDAÇÃO CORRIGIDA
  if (!resposta || !resposta.precos) {
    precosTemporarios = [];
    renderizarTabelaPrecos();
    return;
  }

  precosTemporarios = resposta.precos;
  renderizarTabelaPrecos();
}

function renderizarTabelaPrecos() {
  const area = document.getElementById("areaPrecos");

  if (precosTemporarios.length === 0) {
    area.innerHTML = `
      <div class="alert alert-info">
        Nenhum preço adicionado ainda.
      </div>`;
    return;
  }

  let html = `
    <table class="table table-sm table-bordered">
      <thead>
        <tr><th>Plataforma</th><th>Preço</th></tr>
      </thead>
      <tbody>
  `;

  precosTemporarios.forEach(item => {
    html += `
      <tr>
        <td>${item.plataforma_nome}</td>
        <td>
          <input type="number" value="${item.valor}" class="form-control"
          data-id="${item.id}" onchange="alterarPreco(${item.id}, this.value)" />
        </td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  area.innerHTML = html;
}

function alterarPreco(precoId, novoPreco) {
  const preco = precosTemporarios.find(p => p.id === precoId);
  if (preco) {
    preco.valor = novoPreco;
    atualizarPrecoBackend(precoId, novoPreco);
  }
}

// =========================
// ETAPAS DO CADASTRO
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
// ADICIONAR PREÇO TEMPORÁRIO
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
    area.innerHTML = `
      <div class="alert alert-info">
        Nenhum preço adicionado ainda.
      </div>`;
    return;
  }

  let html = `
    <table class="table table-sm table-bordered">
      <thead class="table-secondary">
        <tr>
          <th>Plataforma</th>
          <th>Preço (R$)</th>
        </tr>
      </thead>
      <tbody>
  `;

  precosTemporarios.forEach(item => {
    html += `
      <tr>
        <td>${item.plataforma_id}</td>
        <td>${item.valor}</td>
      </tr>
    `;
  });

  html += "</tbody></table>";

  area.innerHTML = html;
}

// =========================
// SALVAR JOGO COMPLETO
// =========================

async function salvarJogoCompleto() {
  console.log(' Salvando jogo...');

  const dados = {
    titulo: document.getElementById("inputTitulo").value,
    desenvolvedora: document.getElementById("inputDesenvolvedora").value,
    genero: document.getElementById("inputGenero").value,
    descricao: document.getElementById("inputDescricao").value,
    data_lancamento: document.getElementById("inputData").value
  };

  try {
    if (modo_edicao && jogo_editando_id) {
      console.log(` Atualizando jogo ${jogo_editando_id}...`);

      const resposta = await atualizarJogo(jogo_editando_id, dados);

      if (resposta) {
        alert(" Jogo atualizado com sucesso!");

        for (let preco of precosTemporarios) {
          if (preco.id) {
            await atualizarPreco(preco.id, { valor: preco.valor });
          } else {
            await criarPreco({
              jogo_id: jogo_editando_id,
              plataforma_id: preco.plataforma_id,
              valor: preco.valor
            });
          }
        }

        window.location.reload();
      } else {
        alert(" Erro ao atualizar jogo.");
      }

    } else {
      console.log(' Criando novo jogo...');

      const resposta = await criarJogo(dados);

      if (resposta?.jogo) {
        alert(" Jogo criado com sucesso!");

        for (let preco of precosTemporarios) {
          await criarPreco({
            jogo_id: resposta.jogo.id,
            plataforma_id: preco.plataforma_id,
            valor: preco.valor
          });
        }

        window.location.reload();
      } else {
        alert(" Erro ao criar jogo.");
      }
    }

  } catch (erro) {
    console.error(' Erro:', erro);
    alert(" Erro ao salvar jogo");
  }
}
