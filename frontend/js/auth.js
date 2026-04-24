async function cadastrarUsuario(event) {
  event.preventDefault();
  clearMessage('cadastroFeedback');

  const payload = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value,
    telefone: document.getElementById('telefone').value,
    perfil: document.getElementById('tipoCadastro').value === 'VENDEDOR' ? 'VENDEDOR' : 'USER'
  };

  try {
    if (payload.perfil === 'VENDEDOR') {
      const vendedorPayload = {
        ...payload,
        nomeMercado: document.getElementById('nomeMercado').value,
        cnpjMercado: document.getElementById('cnpjMercado').value,
        enderecoMercado: document.getElementById('enderecoMercado').value,
        bairro: document.getElementById('bairroMercado').value,
        cidade: document.getElementById('cidadeMercado').value,
        estado: document.getElementById('estadoMercado').value,
        telefoneMercado: document.getElementById('telefoneMercado').value,
        cargoVendedor: document.getElementById('cargoVendedor').value,
        observacao: document.getElementById('observacaoVendedor').value,
      };
      await apiRequest('/auth/cadastro-vendedor', {
        method: 'POST',
        body: JSON.stringify(vendedorPayload)
      });
      showMessage('cadastroFeedback', 'Solicitação enviada. Aguarde a aprovação do admin para cadastrar preços.', 'success');
    } else {
      await apiRequest('/usuarios', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      showMessage('cadastroFeedback', 'Cadastro realizado com sucesso. Você já pode fazer login.', 'success');
    }
    event.target.reset();
    alternarCamposVendedor();
  } catch (error) {
    showMessage('cadastroFeedback', error.message, 'error');
  }
}

async function fazerLogin(event) {
  event.preventDefault();
  clearMessage('loginFeedback');

  const payload = {
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value
  };

  try {
    const usuario = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    salvarUsuarioLogado(usuario);
    showMessage('loginFeedback', usuario.mensagem, usuario.ativo ? 'success' : 'warning');
    setTimeout(() => window.location.href = 'dashboard.html', 500);
  } catch (error) {
    showMessage('loginFeedback', error.message, 'error');
  }
}

function alternarCamposVendedor() {
  const tipo = document.getElementById('tipoCadastro')?.value;
  const box = document.getElementById('camposVendedor');
  if (!box) return;
  box.classList.toggle('hidden', tipo !== 'VENDEDOR');
}

document.addEventListener('DOMContentLoaded', alternarCamposVendedor);
