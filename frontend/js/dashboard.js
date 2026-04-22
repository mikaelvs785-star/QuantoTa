function carregarDashboard() {
  const usuario = getUsuarioLogado();
  const lista = JSON.parse(localStorage.getItem(APP_STORAGE_KEYS.lista) || '[]');
  const buscas = getRecentSearches();

  document.getElementById('dashboardNome').textContent = usuario?.nome || 'Visitante';
  document.getElementById('dashboardPerfil').textContent = getPerfilUsuario();
  document.getElementById('dashboardListas').textContent = String(lista.length);
  document.getElementById('dashboardBuscas').textContent = String(buscas.length);
  document.getElementById('dashboardStatus').textContent = usuario ? 'Conta ativa no navegador' : 'Sem login salvo';

  const ultimasBuscasEl = document.getElementById('dashboardUltimasBuscas');
  ultimasBuscasEl.innerHTML = buscas.length
    ? buscas.map(busca => `<li>${escapeHtml(busca)}</li>`).join('')
    : '<li class="muted">Nenhuma busca recente.</li>';

  const itensListaEl = document.getElementById('dashboardItensLista');
  itensListaEl.innerHTML = lista.length
    ? lista.map(item => `<li>${escapeHtml(item.nome || `Produto #${item.produtoId}`)} — qtd. ${item.quantidade}</li>`).join('')
    : '<li class="muted">Nenhum item na lista.</li>';
}

document.addEventListener('DOMContentLoaded', carregarDashboard);
