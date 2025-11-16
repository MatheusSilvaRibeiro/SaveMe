/*
  ====================================================
  SIGNUP.JS - LÓGICA DE CADASTRO DE USUÁRIOS
  ====================================================
*/

// ====================================================
// QUANDO A PÁGINA CARREGA
// ====================================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ Página de cadastro carregada');
  document.getElementById('formCadastro').addEventListener('submit', cadastrarUsuario);
});

// ====================================================
// FUNÇÃO: CADASTRAR USUÁRIO
// ====================================================

async function cadastrarUsuario(evento) {
  evento.preventDefault();
  console.log('📝 Iniciando cadastro...');

  // Pega valores
  const nome = document.getElementById('inputNome').value.trim();
  const email = document.getElementById('inputEmail').value.trim();
  const usuario = document.getElementById('inputUsuario').value.trim();
  const senha = document.getElementById('inputSenha').value;

  console.log('Dados:', { nome, email, usuario });

  // ====================================================
  // VALIDAÇÕES
  // ====================================================

  // Validação — estava faltando o IF aqui!
  if (!nome || !email || !usuario || !senha) {
    mostrarMensagem('⚠️ Preencha todos os campos!', 'warning');
    return;
  }

  if (!validarEmail(email)) {
    mostrarMensagem('⚠️ Email inválido!', 'warning');
    return;
  }

  if (senha.length < 6) {
    mostrarMensagem('⚠️ Senha deve ter no mínimo 6 caracteres!', 'warning');
    return;
  }

  // ====================================================
  // DESABILITA BOTÃO PARA EVITAR DUPLO CLIQUE
  // ====================================================

  const btnCadastro = document.querySelector('button[type="submit"]');
  btnCadastro.disabled = true;
  btnCadastro.innerHTML = '⏳ Cadastrando...';

  // ====================================================
  // ENVIA DADOS PARA A API
  // ====================================================

  try {
    const dados_usuario = { nome, email, usuario, senha };
    console.log('📤 Enviando dados para API...');

    const resultado = await fazRequisicao('/usuarios', 'POST', dados_usuario);

    console.log('Resposta API:', resultado);

    if (resultado && resultado.usuario) {
      mostrarMensagem('✅ Cadastro realizado com sucesso! Redirecionando...', 'success');

      document.getElementById('formCadastro').reset();

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);

    } else {
      mostrarMensagem('❌ Erro ao cadastrar. Tente novamente.', 'danger');
      btnCadastro.disabled = false;
      btnCadastro.innerHTML = '<i class="bi bi-check-circle"></i> Criar Conta';
    }

  } catch (erro) {
    console.error('❌ Erro:', erro);
    mostrarMensagem('❌ Erro na conexão. Tente novamente.', 'danger');
    btnCadastro.disabled = false;
    btnCadastro.innerHTML = '<i class="bi bi-check-circle"></i> Criar Conta';
  }
}

// ====================================================
// VALIDAR EMAIL
// ====================================================

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  return regex.test(email);
}

// ====================================================
// MOSTRAR MENSAGEM
// ====================================================

function mostrarMensagem(texto, tipo) {
  const areaMensagem = document.getElementById('mensagem');

  const html = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${texto}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;

  areaMensagem.innerHTML = html;
  areaMensagem.scrollIntoView({ behavior: 'smooth' });
}

/*
  ====================================================
  FIM DO ARQUIVO
  ====================================================
*/
