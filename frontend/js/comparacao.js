async function carregarComparacao() {
  const produto = JSON.parse(localStorage.getItem(APP_STORAGE_KEYS.produtoSelecionado));
  const titulo = document.getElementById('tituloProduto');
  const tabela = document.getElementById('corpoComparacao');
  const resumo = document.getElementById('resumoComparacao');

  if (!produto) {
    titulo.textContent = 'Nenhum produto selecionado';
    resumo.innerHTML = '<div class="notice warning">Escolha um produto na tela de produtos para comparar preços.</div>';
    return;
  }

  titulo.textContent = `Comparação de preços: ${produto.nome}`;
  setStatusMessage('comparacaoStatus', 'Carregando preços...', 'info');

  try {
    const precos = await apiRequest(`/precos/produto/${produto.id}`);
    tabela.innerHTML = '';

    if (!precos.length) {
      resumo.innerHTML = '<div class="notice warning">Ainda não existem preços cadastrados para esse produto.</div>';
      return;
    }

    const menor = Number(precos[0].valor);
    const maior = Number(precos[precos.length - 1].valor);
    const economia = maior - menor;

    resumo.innerHTML = `
      <div class="grid grid-3">
        <div class="stat"><span class="small">Melhor oferta</span><strong>${formatCurrency(menor)}</strong></div>
        <div class="stat"><span class="small">Maior preço</span><strong>${formatCurrency(maior)}</strong></div>
        <div class="stat"><span class="small">Economia possível</span><strong>${formatCurrency(economia)}</strong></div>
      </div>
    `;

    precos.forEach((preco, index) => {
      const valor = Number(preco.valor);
      const linha = document.createElement('tr');
      const destaque = index === 0 ? '<span class="status-pill success">Melhor preço</span>' : '';
      linha.innerHTML = `
        <td>${index + 1}</td>
        <td>${preco.mercado.nome}<br><span class="small">${preco.mercado.bairro || ''} ${preco.mercado.cidade || ''}</span></td>
        <td class="${index === 0 ? 'highlight' : ''}">${formatCurrency(valor)} ${destaque}</td>
        <td>${formatDate(preco.dataColeta)}</td>
        <td>${preco.observacao || '-'}</td>
        <td><button class="btn" onclick="adicionarNaLista(${produto.id}, '${produto.nome.replace(/'/g, "\'")}')">Adicionar</button></td>
      `;
      tabela.appendChild(linha);
    });

    setStatusMessage('comparacaoStatus', `${precos.length} mercado(s) comparado(s).`, 'success');
  } catch (error) {
    showMessage('comparacaoFeedback', error.message, 'error');
  }
}

function adicionarNaLista(produtoId, nome) {
  ensureListaTemporaria();
  const carrinho = JSON.parse(localStorage.getItem('listaTemporaria')) || [];
  const itemExistente = carrinho.find(item => item.produtoId === produtoId);

  if (itemExistente) itemExistente.quantidade += 1;
  else carrinho.push({ produtoId, quantidade: 1, nome });

  localStorage.setItem('listaTemporaria', JSON.stringify(carrinho));
  showMessage('comparacaoFeedback', `${nome} adicionado à lista temporária.`, 'success');
}

document.addEventListener('DOMContentLoaded', carregarComparacao);
