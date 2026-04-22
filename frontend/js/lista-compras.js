function getListaLocal() {
  return JSON.parse(localStorage.getItem(APP_STORAGE_KEYS.lista)) || [];
}

function saveListaLocal(lista) {
  localStorage.setItem(APP_STORAGE_KEYS.lista, JSON.stringify(lista));
}

function alterarQuantidade(produtoId, delta) {
  const lista = getListaLocal();
  const item = lista.find(entry => entry.produtoId === produtoId);
  if (!item) return;
  item.quantidade += delta;
  if (item.quantidade <= 0) {
    saveListaLocal(lista.filter(entry => entry.produtoId !== produtoId));
  } else {
    saveListaLocal(lista);
  }
  carregarLista();
}

function removerItem(produtoId) {
  const lista = getListaLocal().filter(item => item.produtoId !== produtoId);
  saveListaLocal(lista);
  showToast('Item removido da lista.', 'info');
  carregarLista();
}

function limparLista() {
  saveListaLocal([]);
  showToast('Lista limpa com sucesso.', 'info');
  carregarLista();
}

async function carregarLista() {
  const lista = getListaLocal();
  const corpo = document.getElementById('corpoLista');
  const totalEl = document.getElementById('totalEstimado');
  const resumoEl = document.getElementById('resumoLista');
  corpo.innerHTML = '';

  if (!lista.length) {
    corpo.innerHTML = '<tr><td colspan="5"><div class="empty-state"><h3>Sua lista está vazia</h3><p class="small">Adicione produtos pela busca ou pela comparação para ver o total estimado.</p></div></td></tr>';
    totalEl.textContent = formatCurrency(0);
    resumoEl.innerHTML = '';
    setStatusMessage('listaStatus', 'Nenhum item na lista no momento.', 'warning');
    return;
  }

  setStatusMessage('listaStatus', 'Calculando a melhor estimativa da sua lista...', 'info');

  let total = 0;
  const marketTotals = {};

  for (const item of lista) {
    const produto = await apiRequest(`/produtos/${item.produtoId}`);
    const precos = await apiRequest(`/precos/produto/${item.produtoId}`);
    const ordenados = [...precos].sort((a, b) => Number(a.valor) - Number(b.valor));
    const melhorPreco = ordenados[0];
    const menor = melhorPreco ? Number(melhorPreco.valor) : 0;
    total += menor * item.quantidade;

    ordenados.forEach(preco => {
      const key = preco.mercado.nome;
      marketTotals[key] = (marketTotals[key] || 0) + (Number(preco.valor) * item.quantidade);
    });

    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td><strong>${escapeHtml(produto.nome)}</strong></td>
      <td>
        <div class="list-actions">
          <button class="btn-icon btn-ghost" onclick="alterarQuantidade(${item.produtoId}, -1)">−</button>
          <span>${item.quantidade}</span>
          <button class="btn-icon btn-ghost" onclick="alterarQuantidade(${item.produtoId}, 1)">+</button>
        </div>
      </td>
      <td class="menor-preco">${formatCurrency(menor)}</td>
      <td>${melhorPreco ? escapeHtml(melhorPreco.mercado.nome) : '-'}</td>
      <td>
        <div class="inline-actions">
          <strong>${formatCurrency(menor * item.quantidade)}</strong>
          <button class="btn btn-ghost" onclick="removerItem(${item.produtoId})">Remover</button>
        </div>
      </td>
    `;
    corpo.appendChild(linha);
  }

  const melhorMercado = Object.entries(marketTotals).sort((a, b) => a[1] - b[1])[0];
  resumoEl.innerHTML = `
    <div class="summary-box">
      <div class="grid grid-3">
        <div><p class="small">Itens na lista</p><div class="kpi">${lista.length}</div></div>
        <div><p class="small">Total estimado mínimo</p><div class="kpi">${formatCurrency(total)}</div></div>
        <div><p class="small">Melhor mercado geral</p><div class="kpi">${melhorMercado ? escapeHtml(melhorMercado[0]) : '-'}</div></div>
      </div>
    </div>
  `;
  totalEl.textContent = formatCurrency(total);
  setStatusMessage('listaStatus', 'Lista atualizada com sucesso.', 'success');
}

document.addEventListener('DOMContentLoaded', carregarLista);
