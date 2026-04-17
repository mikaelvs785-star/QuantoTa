async function buscarProdutos() {
  const termo = document.getElementById('busca').value.trim();
  const endpoint = termo ? `/produtos/buscar?nome=${encodeURIComponent(termo)}` : '/produtos';

  try {
    const produtos = await apiRequest(endpoint);
    renderizarProdutos(produtos);
  } catch (error) {
    alert('Erro ao buscar produtos: ' + error.message);
  }
}

function renderizarProdutos(produtos) {
  const container = document.getElementById('resultadoProdutos');
  container.innerHTML = '';

  if (!produtos.length) {
    container.innerHTML = '<p class="small">Nenhum produto encontrado.</p>';
    return;
  }

  produtos.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${produto.nome}</h3>
      <p><strong>Categoria:</strong> ${produto.categoria || '-'} </p>
      <p><strong>Marca:</strong> ${produto.marca || '-'} </p>
      <p><strong>Unidade:</strong> ${produto.unidadeMedida || '-'} </p>
      <button class="btn" onclick="verComparacao(${produto.id}, '${produto.nome.replace(/'/g, "\\'")}')">Ver preços</button>
    `;
    container.appendChild(card);
  });
}

function verComparacao(id, nome) {
  localStorage.setItem('produtoSelecionado', JSON.stringify({ id, nome }));
  window.location.href = 'comparacao.html';
}

document.addEventListener('DOMContentLoaded', buscarProdutos);
