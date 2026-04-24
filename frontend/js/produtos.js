async function buscarProdutos() {
  const termo = document.getElementById('busca').value.trim();
  const categoria = document.getElementById('filtroCategoria').value;
  const endpoint = termo ? `/produtos/buscar?nome=${encodeURIComponent(termo)}` : '/produtos';

  clearMessage('produtosFeedback');
  try {
    let produtos = await apiRequest(endpoint);
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
    card.innerHTML = `
      <div class="card-header">
        <div>
          <span class="rank-badge">${produto.categoria || 'Sem categoria'}</span>
          <h3>${produto.nome}</h3>
        </div>
        <button class="btn btn-outline" onclick="verComparacao(${produto.id}, '${produto.nome.replace(/'/g, "\'")}')">Ver preços</button>
      </div>
      <p><strong>Marca:</strong> ${produto.marca || '-'}</p>
      <p><strong>Unidade:</strong> ${produto.unidadeMedida || '-'}</p>
      <p class="small">${produto.descricao || 'Sem descrição cadastrada.'}</p>
    `;
    container.appendChild(card);
  });
}

function renderizarHistorico() {
  const alvo = document.getElementById('ultimasBuscas');
  if (!alvo) return;
  const historico = JSON.parse(localStorage.getItem('ultimasBuscas') || '[]');
  alvo.innerHTML = historico.length
    ? historico.map(item => `<button class="btn btn-outline" type="button" onclick="usarBusca('${item.replace(/'/g, "\'")}')">${item}</button>`).join(' ')
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
});
