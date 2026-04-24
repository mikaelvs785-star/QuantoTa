const APP_STORAGE_KEYS = {
  usuario: 'usuarioLogado',
  lista: 'listaTemporaria',
  produtoSelecionado: 'produtoSelecionado',
  ultimasBuscas: 'ultimasBuscas'
};

function getUsuarioLogado() {
  try {
    return JSON.parse(localStorage.getItem(APP_STORAGE_KEYS.usuario));
  } catch {
    return null;
  }
}

function getPerfilUsuario() {
  const usuario = getUsuarioLogado();
  return usuario?.perfil || usuario?.role || 'VISITANTE';
}

function isAdmin() {
  return getPerfilUsuario() === 'ADMIN';
}

function requireAdminPage() {
  const aviso = document.getElementById('adminGate');
  if (!aviso) return;

  if (isAdmin()) {
    aviso.hidden = true;
    document.querySelectorAll('[data-admin-content]').forEach(el => el.hidden = false);
    return;
  }

  aviso.hidden = false;
  document.querySelectorAll('[data-admin-content]').forEach(el => el.hidden = true);
  showToast('Área administrativa visível apenas para contas admin.', 'error');
}

function updateNavByPerfil() {
  const usuario = getUsuarioLogado();
  const adminLinks = document.querySelectorAll('[data-nav-admin]');
  const authOnly = document.querySelectorAll('[data-auth-only]');
  const guestOnly = document.querySelectorAll('[data-guest-only]');
  const userName = document.querySelector('[data-user-name]');

  adminLinks.forEach(link => {
    link.style.display = isAdmin() ? 'inline-flex' : 'none';
  });

  authOnly.forEach(el => {
    el.style.display = usuario ? 'inline-flex' : 'none';
  });

  guestOnly.forEach(el => {
    el.style.display = usuario ? 'none' : 'inline-flex';
  });

  if (userName) {
    userName.textContent = usuario?.nome ? `Olá, ${usuario.nome.split(' ')[0]}` : 'Visitante';
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function ensureToastContainer() {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

function showToast(message, type = 'info') {
  const container = ensureToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}

function setStatusMessage(containerId, message, type = 'info') {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!message) {
    container.innerHTML = '';
    container.hidden = true;
    return;
  }
  container.hidden = false;
  container.innerHTML = `<div class="status-message status-${type}">${escapeHtml(message)}</div>`;
}

function saveRecentSearch(term) {
  if (!term) return;
  const current = JSON.parse(localStorage.getItem(APP_STORAGE_KEYS.ultimasBuscas) || '[]');
  const updated = [term, ...current.filter(item => item.toLowerCase() !== term.toLowerCase())].slice(0, 5);
  localStorage.setItem(APP_STORAGE_KEYS.ultimasBuscas, JSON.stringify(updated));
}

function getRecentSearches() {
  return JSON.parse(localStorage.getItem(APP_STORAGE_KEYS.ultimasBuscas) || '[]');
}

document.addEventListener('DOMContentLoaded', updateNavByPerfil);
