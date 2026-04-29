let todosProdutos = [];
const categoryIcons = {
  frutas: 'frutas',
  legumes: 'legumes',
  bebidas: 'bebidas',
  padaria: 'padaria',
  carnes: 'carnes',
  mercearia: 'mercearia',
  default: 'produto'
};

function getCategoryIcon(category) {
  const key = String(category || '').trim().toLowerCase();
  return categoryIcons[key] || categoryIcons.default;
}

function usuarioPodeApagarProdutos() {
  const usuario = getUsuarioLogado();
  const perfil = usuario?.perfil || usuario?.role;
  return perfil === 'ADMIN';
}

function popularCategorias(produtos) {
  const select = document.getElementById('filtroCategoria');
  if (!select) return;
  const categorias = [...new Set(produtos.map(p => p.categoria).filter(Boolean))].sort();
  select.innerHTML = '<option value="">Todas as categorias</option>' + categorias.map(cat => `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`).join('');
}

function renderRecentSearches() {
  const container = document.getElementById('ultimasBuscas');
  if (!container) return;
  const buscas = getRecentSearches();
  container.innerHTML = buscas.length
    ? buscas.map(busca => `<button class="chip" type="button" onclick='aplicarBuscaRecente(${JSON.stringify(String(busca))})'>${escapeHtml(busca)}</button>`).join('')
    : '<span class="small">Suas ultimas buscas aparecerao aqui.</span>';
}

function aplicarBuscaRecente(termo) {
  document.getElementById('busca').value = termo;
  buscarProdutos();
}

async function buscarProdutos() {
  const termo = document.getElementById('busca').value.trim();
  const categoria = document.getElementById('filtroCategoria')?.value || '';
  const endpoint = termo ? `/produtos/buscar?nome=${encodeURIComponent(termo)}` : '/produtos';

  clearMessage('produtosFeedback');
  try {
    let produtos = await apiRequest(endpoint);
    todosProdutos = produtos;
    popularCategorias(todosProdutos);
    if (categoria) produtos = produtos.filter(produto => (produto.categoria || '').toLowerCase() === categoria.toLowerCase());
    renderizarProdutos(produtos);

    if (termo) {
      const historico = JSON.parse(localStorage.getItem('ultimasBuscas') || '[]');
      const atualizado = [termo, ...historico.filter(item => item !== termo)].slice(0, 5);
      localStorage.setItem('ultimasBuscas', JSON.stringify(atualizado));
      renderizarHistorico();
    }
  } catch (error) {
    showMessage('produtosFeedback', error.message, 'error');
  }
}

function renderizarProdutos(produtos) {
  const container = document.getElementById('resultadoProdutos');
  container.innerHTML = '';

  if (!produtos.length) {
    container.innerHTML = '<div class="card"><p class="small">Nenhum produto encontrado com esse filtro.</p></div>';
    return;
  }

  produtos.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'card result-card';
    const nomeProduto = escapeHtml(produto.nome);
    const nomeProdutoJson = JSON.stringify(produto.nome || '');
    const botaoApagar = usuarioPodeApagarProdutos()
      ? `<button class="btn btn-danger" type="button" onclick='apagarProduto(${produto.id}, ${nomeProdutoJson})'>Apagar</button>`
      : '';

    card.innerHTML = `
      <div class="card-header">
        <div>
          <span class="rank-badge">${escapeHtml(produto.categoria || 'Sem categoria')}</span>
          <h3>${nomeProduto}</h3>
        </div>
        <div class="button-group">
          <button class="btn btn-outline" type="button" onclick='verComparacao(${produto.id}, ${nomeProdutoJson})'>Ver precos</button>
          ${botaoApagar}
        </div>
      </div>
      <p><strong>Marca:</strong> ${escapeHtml(produto.marca || '-')}</p>
      <p><strong>Unidade:</strong> ${escapeHtml(produto.unidadeMedida || '-')}</p>
      <p class="small">${escapeHtml(produto.descricao || 'Sem descricao cadastrada.')}</p>
    `;
    container.appendChild(card);
  });
}

async function apagarProduto(id, nome) {
  if (!usuarioPodeApagarProdutos()) {
    showMessage('produtosFeedback', 'Apenas administradores podem apagar produtos.', 'error');
    return;
  }

  const confirmado = confirm(`Deseja apagar o produto "${nome}"?`);
  if (!confirmado) return;

  clearMessage('produtosFeedback');
  try {
    await apiRequest(`/produtos/${id}`, { method: 'DELETE' });
    showMessage('produtosFeedback', 'Produto apagado com sucesso.', 'success');
    buscarProdutos();
  } catch (error) {
    showMessage('produtosFeedback', error.message, 'error');
  }
}

function renderizarHistorico() {
  const alvo = document.getElementById('ultimasBuscas');
  if (!alvo) return;
  const historico = JSON.parse(localStorage.getItem('ultimasBuscas') || '[]');
  alvo.innerHTML = historico.length
    ? historico.map(item => `<button class="btn btn-outline" type="button" onclick='usarBusca(${JSON.stringify(item)})'>${escapeHtml(item)}</button>`).join(' ')
    : '<span class="small">Nenhuma busca recente ainda.</span>';
}

function usarBusca(valor) {
  document.getElementById('busca').value = valor;
  buscarProdutos();
}

function verComparacao(id, nome) {
  localStorage.setItem('produtoSelecionado', JSON.stringify({ id, nome }));
  window.location.href = 'comparacao.html';
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarHistorico();
  buscarProdutos();
  document.getElementById('busca')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') buscarProdutos();
  });
  document.getElementById('filtroCategoria')?.addEventListener('change', buscarProdutos);
});
