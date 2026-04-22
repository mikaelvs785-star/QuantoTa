async function cadastrarUsuario(event) {
  event.preventDefault();
  setStatusMessage('authStatus', 'Criando sua conta...', 'info');

  const payload = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value,
    perfil: 'USER'
  };

  try {
    await apiRequest('/usuarios', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    setStatusMessage('authStatus', 'Cadastro realizado com sucesso. Você já pode entrar.', 'success');
    showToast('Conta criada com sucesso!', 'success');
    event.target.reset();
    setTimeout(() => { window.location.href = 'login.html'; }, 700);
  } catch (error) {
    setStatusMessage('authStatus', `Erro ao cadastrar: ${error.message}`, 'error');
    showToast('Não foi possível concluir o cadastro.', 'error');
  }
}

async function fazerLogin(event) {
  event.preventDefault();
  setStatusMessage('authStatus', 'Entrando na sua conta...', 'info');

  const payload = {
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value
  };

  try {
    const usuario = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const usuarioPersistido = {
      ...usuario,
      nome: usuario.nome || payload.email.split('@')[0],
      perfil: usuario.perfil || usuario.role || 'USER'
    };

    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioPersistido));
    setStatusMessage('authStatus', usuario.mensagem || 'Login realizado com sucesso.', 'success');
    showToast('Login realizado com sucesso!', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 500);
  } catch (error) {
    setStatusMessage('authStatus', `Falha no login: ${error.message}`, 'error');
    showToast('Email ou senha inválidos.', 'error');
  }
}

function logout() {
  localStorage.removeItem('usuarioLogado');
  showToast('Você saiu da sua conta.', 'info');
  setTimeout(() => { window.location.href = '../index.html'; }, 300);
}
