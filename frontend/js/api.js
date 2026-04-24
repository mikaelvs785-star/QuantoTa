const API_BASE_URL = 'http://localhost:8080';

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  let payload = null;
  const text = await response.text();
  if (text) {
    try { payload = JSON.parse(text); } catch { payload = text; }
  }

  if (!response.ok) {
    const message = payload?.erro || payload?.message || payload || 'Erro na requisição';
    throw new Error(message);
  }

  return payload;
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(date) {
  if (!date) return '-';
  try {
    return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR');
  } catch {
    return date;
  }
}

function getUsuarioLogado() {
  try {
    return JSON.parse(localStorage.getItem('usuarioLogado'));
  } catch {
    return null;
  }
}

function salvarUsuarioLogado(usuario) {
  localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
  document.dispatchEvent(new CustomEvent('usuario-atualizado', { detail: usuario }));
}

function limparUsuarioLogado() {
  localStorage.removeItem('usuarioLogado');
  document.dispatchEvent(new CustomEvent('usuario-atualizado', { detail: null }));
}

function showMessage(targetId, message, type = 'success') {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.className = `notice ${type}`;
  target.textContent = message;
  target.classList.remove('hidden');
}

function clearMessage(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.textContent = '';
  target.className = 'notice hidden';
}

function ensureListaTemporaria() {
  const atual = localStorage.getItem('listaTemporaria');
  if (!atual) localStorage.setItem('listaTemporaria', JSON.stringify([]));
}
