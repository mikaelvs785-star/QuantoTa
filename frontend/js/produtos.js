let todosProdutos = [];
const categoryIcons = {
  frutas: '🍎',
  legumes: '🥕',
  bebidas: '🥛',
  padaria: '🥖',
  carnes: '🥩',
  mercearia: '🛒',
  default: '📦'
};

function getCategoryIcon(category) {
  const key = String(category || '').trim().toLowerCase();
  return categoryIcons[key] || categoryIcons.default;
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
    : '<span class="small">Suas últimas buscas aparecerão aqui.</span>';
}

function aplicarBuscaRecente(termo) {
  document.getElementById('busca').value = termo;
  buscarProdutos();
}

async function buscarProdutos() {
  const termo = document.getElementById('busca').value.trim();
  const categoria = document.getElementById('filtroCategoria').value;
  const endpoint = termo ? `/produtos/buscar?nome=${encodeURIComponent(termo)}` : '/produtos';

  setStatusMessage('produtosStatus', 'Buscando produtos...', 'info');

  try {
    let produtos = await apiRequest(endpoint);
    todosProdutos = produtos;
    popularCategorias(produtos);

    if (categoria) {
      produtos = produtos.filter(produto => String(produto.categoria || '').toLowerCase() === categoria.toLowerCase());
    }

    if (termo) saveRecentSearch(termo);
    renderRecentSearches();
    renderizarProdutos(produtos);
    setStatusMessage('produtosStatus', `${produtos.length} produto(s) encontrado(s).`, 'success');
  } catch (error) {
    setStatusMessage('produtosStatus', `Erro ao buscar produtos: ${error.message}`, 'error');
    showToast('Não foi possível carregar os produtos.', 'error');
  }
}

function renderizarProdutos(produtos) {
  const container = document.getElementById('resultadoProdutos');
  container.innerHTML = '';

  if (!produtos.length) {
    container.innerHTML = '<div class="empty-state"><h3>Nenhum produto encontrado</h3><p class="small">Tente outro nome ou remova o filtro de categoria.</p></div>';
    return;
  }

  produtos.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'card product-card';
    card.innerHTML = `
      <div class="toolbar">
        <div>
          <span class="product-icon">${getCategoryIcon(produto.categoria)}</span>
          <h3>${escapeHtml(produto.nome)}</h3>
        </div>
        <span class="pill">${escapeHtml(produto.categoria || 'Sem categoria')}</span>
      </div>
      <div class="product-meta small">
        <span><strong>Marca:</strong> ${escapeHtml(produto.marca || '-')}</span>
        <span><strong>Unidade:</strong> ${escapeHtml(produto.unidadeMedida || '-')}</span>
        <span><strong>Descrição:</strong> ${escapeHtml(produto.descricao || 'Sem descrição cadastrada')}</span>
      </div>
      <div class="inline-actions">
        <button class="btn" onclick="verComparacao(${produto.id}, '${String(produto.nome).replace(/'/g, "\\'")}')">Ver preços</button>
        <button class="btn btn-ghost" onclick="adicionarDiretoNaLista(${produto.id}, '${String(produto.nome).replace(/'/g, "\\'")}')">Adicionar à lista</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function adicionarDiretoNaLista(id, nome) {
  const carrinho = JSON.parse(localStorage.getItem(APP_STORAGE_KEYS.lista)) || [];
  const existente = carrinho.find(item => item.produtoId === id);
  if (existente) existente.quantidade += 1;
  else carrinho.push({ produtoId: id, quantidade: 1, nome });
  localStorage.setItem(APP_STORAGE_KEYS.lista, JSON.stringify(carrinho));
  showToast(`${nome} adicionado à lista.`, 'success');
}

function verComparacao(id, nome) {
  localStorage.setItem(APP_STORAGE_KEYS.produtoSelecionado, JSON.stringify({ id, nome }));
  window.location.href = 'comparacao.html';
}

document.addEventListener('DOMContentLoaded', () => {
  renderRecentSearches();
  document.getElementById('busca')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') buscarProdutos();
  });
  document.getElementById('filtroCategoria')?.addEventListener('change', buscarProdutos);
  buscarProdutos();
});
