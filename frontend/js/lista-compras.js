async function carregarLista() {
  ensureListaTemporaria();
  const lista = JSON.parse(localStorage.getItem('listaTemporaria')) || [];
  const corpo = document.getElementById('corpoLista');
  const totalEl = document.getElementById('totalEstimado');
  const melhorMercadoEl = document.getElementById('melhorMercado');
  corpo.innerHTML = '';

  if (!lista.length) {
    corpo.innerHTML = '<tr><td colspan="6" class="small">Sua lista ainda está vazia.</td></tr>';
    totalEl.textContent = formatCurrency(0);
    melhorMercadoEl.textContent = '-';
    return;
  }

  let total = 0;
  const rankingMercados = {};

  for (const item of lista) {
    const produto = await apiRequest(`/produtos/${item.produtoId}`);
    const precos = await apiRequest(`/precos/produto/${item.produtoId}`);
    const melhorPreco = precos[0];
    const menor = melhorPreco ? Number(melhorPreco.valor) : 0;
    total += menor * item.quantidade;

    if (melhorPreco?.mercado?.nome) {
      rankingMercados[melhorPreco.mercado.nome] = (rankingMercados[melhorPreco.mercado.nome] || 0) + menor * item.quantidade;
    }

    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${produto.nome}</td>
      <td>
        <div class="actions">
          <button class="btn btn-outline" onclick="alterarQuantidade(${item.produtoId}, -1)">-</button>
          <strong>${item.quantidade}</strong>
          <button class="btn btn-outline" onclick="alterarQuantidade(${item.produtoId}, 1)">+</button>
        </div>
      </td>
      <td>${melhorPreco ? melhorPreco.mercado.nome : '-'}</td>
      <td>${formatCurrency(menor)}</td>
      <td>${formatCurrency(menor * item.quantidade)}</td>
      <td><button class="btn btn-danger" onclick="removerItem(${item.produtoId})">Remover</button></td>
    `;
    corpo.appendChild(linha);
  }

  const melhorMercado = Object.entries(rankingMercados).sort((a, b) => a[1] - b[1])[0];
  totalEl.textContent = formatCurrency(total);
  melhorMercadoEl.textContent = melhorMercado ? `${melhorMercado[0]} • ${formatCurrency(melhorMercado[1])}` : '-';
}

function alterarQuantidade(produtoId, variacao) {
  const lista = JSON.parse(localStorage.getItem('listaTemporaria')) || [];
  const item = lista.find(prod => prod.produtoId === produtoId);
  if (!item) return;
  item.quantidade += variacao;
  if (item.quantidade <= 0) {
    localStorage.setItem('listaTemporaria', JSON.stringify(lista.filter(prod => prod.produtoId !== produtoId)));
  } else {
    localStorage.setItem('listaTemporaria', JSON.stringify(lista));
  }
  carregarLista();
}

function removerItem(produtoId) {
  const lista = JSON.parse(localStorage.getItem('listaTemporaria')) || [];
  localStorage.setItem('listaTemporaria', JSON.stringify(lista.filter(prod => prod.produtoId !== produtoId)));
  carregarLista();
}

function limparLista() {
  localStorage.setItem('listaTemporaria', JSON.stringify([]));
  carregarLista();
}

document.addEventListener('DOMContentLoaded', carregarLista);
