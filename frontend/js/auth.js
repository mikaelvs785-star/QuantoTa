async function cadastrarUsuario(event) {
  event.preventDefault();

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
    alert('Cadastro realizado com sucesso!');
    window.location.href = 'login.html';
  } catch (error) {
    alert('Erro ao cadastrar: ' + error.message);
  }
}

async function fazerLogin(event) {
  event.preventDefault();

  const payload = {
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value
  };

  try {
    const usuario = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    alert(usuario.mensagem);
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert('Falha no login: ' + error.message);
  }
}

function logout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = '../index.html';
}
