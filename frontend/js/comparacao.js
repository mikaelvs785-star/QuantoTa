async function carregarComparacao() {
  const produto = JSON.parse(localStorage.getItem(APP_STORAGE_KEYS.produtoSelecionado));
  const titulo = document.getElementById('tituloProduto');
  const tabela = document.getElementById('corpoComparacao');
  const resumo = document.getElementById('resumoComparacao');

  if (!produto) {
    titulo.textContent = 'Nenhum produto selecionado';
    resumo.innerHTML = '<div class="empty-state"><p class="small">Escolha um produto na página de busca para comparar preços.</p></div>';
    return;
  }

  titulo.textContent = `Comparação de preços: ${produto.nome}`;
  setStatusMessage('comparacaoStatus', 'Carregando preços...', 'info');

  try {
    const precos = await apiRequest(`/precos/produto/${produto.id}`);
    tabela.innerHTML = '';

    if (!precos.length) {
      resumo.innerHTML = '<div class="empty-state"><h3>Sem preços cadastrados</h3><p class="small">Esse produto ainda não possui coleta de preços.</p></div>';
      setStatusMessage('comparacaoStatus', 'Nenhum preço encontrado para esse produto.', 'warning');
      return;
    }

    precos.sort((a, b) => Number(a.valor) - Number(b.valor));
    const menor = Number(precos[0].valor);
    const maior = Number(precos[precos.length - 1].valor);
    const economia = maior - menor;

    resumo.innerHTML = `
      <div class="summary-box">
        <div class="grid grid-3">
          <div><p class="small">Melhor preço</p><div class="kpi">${formatCurrency(menor)}</div></div>
          <div><p class="small">Maior preço</p><div class="kpi">${formatCurrency(maior)}</div></div>
          <div><p class="small">Economia possível</p><div class="kpi">${formatCurrency(economia)}</div></div>
        </div>
      </div>
    `;

    precos.forEach((preco, index) => {
      const linha = document.createElement('tr');
      const valor = Number(preco.valor);
      const destaque = valueEquals(valor, menor) ? 'highlight' : '';
      const badge = index === 0 ? '<span class="pill">Melhor oferta</span>' : '';
      linha.innerHTML = `
        <td>
          <strong>${escapeHtml(preco.mercado.nome)}</strong><br>
          ${badge}
        </td>
        <td class="${destaque}">${formatCurrency(valor)}</td>
        <td>${formatDate(preco.dataColeta)}</td>
        <td>${escapeHtml(preco.observacao || '-')}</td>
        <td><button class="btn" onclick="adicionarNaLista(${produto.id}, '${String(produto.nome).replace(/'/g, "\\'")}')">Adicionar</button></td>
      `;
      tabela.appendChild(linha);
    });

    setStatusMessage('comparacaoStatus', `${precos.length} mercado(s) comparado(s).`, 'success');
  } catch (error) {
    setStatusMessage('comparacaoStatus', `Erro ao carregar comparação: ${error.message}`, 'error');
  }
}

function valueEquals(a, b) {
  return Math.abs(Number(a) - Number(b)) < 0.001;
}

function adicionarNaLista(produtoId, nome) {
  const carrinho = JSON.parse(localStorage.getItem(APP_STORAGE_KEYS.lista)) || [];
  const itemExistente = carrinho.find(item => item.produtoId === produtoId);

  if (itemExistente) itemExistente.quantidade += 1;
  else carrinho.push({ produtoId, quantidade: 1, nome });

  localStorage.setItem(APP_STORAGE_KEYS.lista, JSON.stringify(carrinho));
  showToast(`${nome} adicionado à lista.`, 'success');
}

document.addEventListener('DOMContentLoaded', carregarComparacao);
