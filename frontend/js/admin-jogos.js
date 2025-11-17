let jogos_lista = [];
let plataformas_lista = [];
let precos_lista = [];
let precos_temporarios = [];
let etapa_atual = 1;

document.addEventListener('DOMContentLoaded', async function() {
  console.log('✅ Página admin de jogos carregada');
  
  await carregarDados();
  configurarEventos();
});

async function carregarDados() {
  console.log('📥 Carregando dados...');
  
  try {
    const jogos_resultado = await listarJogos();
    if (jogos_resultado && jogos_resultado.jogos) {
      jogos_lista = jogos_resultado.jogos;
      console.log(`✅ ${jogos_lista.length} jogos carregados`);
      mostrarTabelaJogos();
    }
    
    const plataformas_resultado = await listarPlataformas();
    if (plataformas_resultado && plataformas_resultado.plataformas) {
      plataformas_lista = plataformas_resultado.plataformas;
      console.log(`✅ ${plataformas_lista.length} plataformas carregadas`);
      preencherSelectPlataformas();
    }
    
    const precos_resultado = await listarPrecos();
    if (precos_resultado && precos_resultado.precos) {
      precos_lista = precos_resultado.precos;
      console.log(`✅ ${precos_lista.length} preços carregados`);
    }
    
  } catch (erro) {
    console.error('❌ Erro:', erro);
  }
}

function configurarEventos() {
  console.log('⚙️ Configurando eventos...');
}

function preencherSelectPlataformas() {
  const select = document.getElementById('selectPlataforma');
  
  select.innerHTML = '<option value="">-- Selecione uma plataforma --</option>';
  
  plataformas_lista.forEach(plataforma => {
    const option = document.createElement('option');
    option.value = plataforma.id;
    option.textContent = plataforma.nome;
    select.appendChild(option);
  });
}

function irParaEtapa2() {
  console.log('➡️ Indo para etapa 2...');
  
  const titulo = document.getElementById('inputTitulo').value.trim();
  const desenvolvedora = document.getElementById('inputDesenvolvedora').value.trim();
  const genero = document.getElementById('inputGenero').value.trim();
  const descricao = document.getElementById('inputDescricao').value.trim();
  const data = document.getElementById('inputData').value;

  // ✔️ validação correta
  if (!titulo || !desenvolvedora || !genero || !descricao || !data) {
    mostrarMensagem('⚠️ Preencha todos os campos!', 'warning');
    return;
  }
  
  etapa_atual = 2;
  document.getElementById('etapa1').classList.remove('ativa');
  document.getElementById('etapa2').classList.add('ativa');
  
  document.getElementById('progressBar').style.width = '50%';
  document.getElementById('progressText').textContent = 'Etapa 2 de 2';
  
  document.getElementById('formTitulo').innerHTML = 
    `<i class="bi bi-tag"></i> ${titulo} - Adicionar Preços`;
}

function voltarParaEtapa1() {
  console.log('⬅️ Voltando para etapa 1...');
  
  etapa_atual = 1;
  document.getElementById('etapa2').classList.remove('ativa');
  document.getElementById('etapa1').classList.add('ativa');
  
  document.getElementById('progressBar').style.width = '25%';
  document.getElementById('progressText').textContent = 'Etapa 1 de 2';
  
  document.getElementById('formTitulo').innerHTML = 
    '<i class="bi bi-plus-circle"></i> Criar Novo Jogo';
}

function adicionarPrecoTemporario() {
  console.log('➕ Adicionando preço temporário...');
  
  const plataforma_id = document.getElementById('selectPlataforma').value;
  const valor = document.getElementById('inputValor').value;

  // ✔️ validação
  if (!plataforma_id || !valor) {
    mostrarMensagem('⚠️ Preencha todos os campos!', 'warning');
    return;
  }
  
  const plataforma = plataformas_lista.find(p => p.id == plataforma_id);
  
  const preco_temp = {
    id_temporario: Date.now(),
    plataforma_id: parseInt(plataforma_id),
    plataforma_nome: plataforma.nome,
    valor: parseFloat(valor)
  };
  
  precos_temporarios.push(preco_temp);
  console.log(`✅ Preço adicionado temporariamente. Total: ${precos_temporarios.length}`);
  
  document.getElementById('selectPlataforma').value = '';
  document.getElementById('inputValor').value = '';
  
  mostrarTabelaPrecoTemporarios();
}

function mostrarTabelaPrecoTemporarios() {
  console.log('📊 Mostrando preços temporários...');
  
  if (precos_temporarios.length === 0) {
    document.getElementById('areaPrecos').innerHTML = `
      <div class="alert alert-info">
        <i class="bi bi-info-circle"></i> 
        Nenhum preço adicionado ainda. Adicione pelo menos um para continuar.
      </div>
    `;
    return;
  }
  
  const linhas = precos_temporarios.map((preco, index) => `
    <tr>
      <td>${preco.plataforma_nome}</td>
      <td>R$ ${preco.valor.toFixed(2).replace('.', ',')}</td>
      <td>
        <button 
          class="btn btn-sm btn-danger btn-acao" 
          onclick="removerPrecoTemporario(${index})"
        >
          <i class="bi bi-trash"></i> Remover
        </button>
      </td>
    </tr>
  `).join('');
  
  const html = `
    <div class="table-responsive">
      <table class="table table-hover tabela-precos">
        <thead class="table-dark">
          <tr>
            <th>Plataforma</th>
            <th>Preço</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          ${linhas}
        </tbody>
      </table>
    </div>
  `;
  
  document.getElementById('areaPrecos').innerHTML = html;
}

function removerPrecoTemporario(index) {
  console.log(`🗑 Removendo preço no índice ${index}...`);
  
  precos_temporarios.splice(index, 1);
  mostrarTabelaPrecoTemporarios();
}

async function salvarJogoCompleto() {
  console.log('💾 Salvando jogo completo...');
  
  if (precos_temporarios.length === 0) {
    mostrarMensagem('⚠️ Adicione pelo menos um preço!', 'warning');
    return;
  }
  
  const titulo = document.getElementById('inputTitulo').value.trim();
  const desenvolvedora = document.getElementById('inputDesenvolvedora').value.trim();
  const genero = document.getElementById('inputGenero').value.trim();
  const descricao = document.getElementById('inputDescricao').value.trim();
  const data = document.getElementById('inputData').value;
  
  const dados_jogo = {
    titulo: titulo,
    desenvolvedora: desenvolvedora,
    genero: genero,
    descricao: descricao,
    data_lancamento: data
  };
  
  try {
    console.log('📤 Criando jogo...');
    const resultado_jogo = await criarJogo(dados_jogo);

    if (!resultado_jogo || !resultado_jogo.jogo) {
      mostrarMensagem('❌ Erro ao criar jogo', 'danger');
      return;
    }
    
    const jogo_id = resultado_jogo.jogo.id;
    console.log(`✅ Jogo criado com ID ${jogo_id}`);
    
    console.log('📤 Adicionando preços...');
    
    for (let preco_temp of precos_temporarios) {
      const dados_preco = {
        jogo_id: jogo_id,
        plataforma_id: preco_temp.plataforma_id,
        valor: preco_temp.valor
      };
      
      console.log(`  ➕ Adicionando preço para ${preco_temp.plataforma_nome}...`);
      await criarPreco(dados_preco);
    }
    
    mostrarMensagem('✅ Jogo e preços salvos com sucesso!', 'success');
    
    setTimeout(() => {
      limparFormulario();
      voltarParaEtapa1();
      precos_temporarios = [];
      carregarDados();
    }, 2000);
    
  } catch (erro) {
    console.error('❌ Erro:', erro);
    mostrarMensagem('❌ Erro ao salvar jogo', 'danger');
  }
}

function mostrarTabelaJogos() {
  console.log('📊 Mostrando tabela...');
  
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
        <button 
          class="btn btn-sm btn-warning btn-acao" 
          onclick="editarJogo(${jogo.id})"
        >
          <i class="bi bi-pencil"></i> Editar
        </button>
        
        <button 
          class="btn btn-sm btn-danger btn-acao" 
          onclick="confirmarDelecao(${jogo.id})"
        >
          <i class="bi bi-trash"></i> Deletar
        </button>
      </td>
    </tr>
  `).join('');
  
  const html = `
    <div class="table-responsive">
      <table class="table table-hover tabela-precos">
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
  
  document.getElementById('areaTabela').innerHTML = html;
}

function editarJogo(jogo_id) {
  console.log(`✏️ Editando jogo ${jogo_id}...`);
  
  const jogo = jogos_lista.find(j => j.id === jogo_id);
  
  if (!jogo) {
    alert('Jogo não encontrado');
    return;
  }
  
  document.getElementById('inputJogoId').value = jogo.id;
  document.getElementById('inputTitulo').value = jogo.titulo;
  document.getElementById('inputDesenvolvedora').value = jogo.desenvolvedora;
  document.getElementById('inputGenero').value = jogo.genero;
  document.getElementById('inputDescricao').value = jogo.descricao;
  document.getElementById('inputData').value = jogo.data_lancamento;
  
  etapa_atual = 1;
  document.getElementById('etapa1').classList.add('ativa');
  document.getElementById('etapa2').classList.remove('ativa');
  
  document.getElementById('formTitulo').innerHTML = 
    `<i class="bi bi-pencil-square"></i> Editando: ${jogo.titulo}`;
  
  document.getElementById('progressBar').style.width = '25%';
  document.getElementById('progressText').textContent = 'Etapa 1 de 2';
  
  precos_temporarios = [];
  
  document.querySelector('#formTitulo').scrollIntoView({ behavior: 'smooth' });
}

function confirmarDelecao(jogo_id) {
  console.log(`🗑 Confirmando deleção de ${jogo_id}...`);
  
  if (confirm('⚠️ Tem certeza que quer deletar este jogo?')) {
    deletarJogoConfirmado(jogo_id);
  }
}

async function deletarJogoConfirmado(jogo_id) {
  console.log(`🗑 Deletando jogo ${jogo_id}...`);
  
  try {
    const resultado = await deletarJogo(jogo_id);
    
    if (resultado) {
      alert('✅ Jogo deletado com sucesso!');
      await carregarDados();
    }
    
  } catch (erro) {
    console.error('❌ Erro:', erro);
    alert('Erro ao deletar jogo');
  }
}

function limparFormulario() {
  document.getElementById('inputJogoId').value = '';
  document.getElementById('inputTitulo').value = '';
  document.getElementById('inputDesenvolvedora').value = '';
  document.getElementById('inputGenero').value = '';
  document.getElementById('inputDescricao').value = '';
  document.getElementById('inputData').value = '';
  document.getElementById('selectPlataforma').value = '';
  document.getElementById('inputValor').value = '';
  document.getElementById('mensagemForm').innerHTML = '';
  
  precos_temporarios = [];
  
  document.getElementById('areaPrecos').innerHTML = `
    <div class="alert alert-info">
      <i class="bi bi-info-circle"></i> 
      Nenhum preço adicionado ainda. Adicione pelo menos um para continuar.
    </div>
  `;
}

function mostrarMensagem(texto, tipo) {
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

function formatarData(data) {
  if (!data) return '-';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}
