function carregarDashboard() {
  const usuario = getUsuarioLogado();
  const painel = document.getElementById('dashboardPainel');
  const status = document.getElementById('dashboardStatus');
  const historico = JSON.parse(localStorage.getItem('ultimasBuscas') || '[]');
  const lista = JSON.parse(localStorage.getItem('listaTemporaria') || '[]');

  if (!usuario) {
    painel.innerHTML = '<div class="notice warning">Faça login para visualizar seu painel.</div>';
    return;
  }

  status.innerHTML = `<span class="status-pill ${usuario.ativo ? 'success' : 'warning'}">${usuario.perfil}${usuario.statusSolicitacao ? ' • ' + usuario.statusSolicitacao : ''}</span>`;

  painel.innerHTML = `
    <div class="grid grid-3">
      <div class="stat"><span class="small">Perfil</span><strong>${usuario.perfil}</strong></div>
      <div class="stat"><span class="small">Itens na lista</span><strong>${lista.reduce((acc, item) => acc + item.quantidade, 0)}</strong></div>
      <div class="stat"><span class="small">Últimas buscas</span><strong>${historico.length}</strong></div>
    </div>
    <div class="card">
      <h3 class="section-title">Ações rápidas</h3>
      <div class="toolbar">
        <a class="btn" href="produtos.html">Buscar preços</a>
        <a class="btn btn-secondary" href="lista-compras.html">Ver lista</a>
        ${usuario.perfil === 'ADMIN' ? '<a class="btn btn-outline" href="admin.html">Painel admin</a>' : ''}
      </div>
    </div>
    <div class="card">
      <h3 class="section-title">Histórico recente</h3>
      ${historico.length ? `<ul>${historico.map(item => `<li>${item}</li>`).join('')}</ul>` : '<p class="small">Você ainda não fez buscas recentes.</p>'}
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', carregarDashboard);
