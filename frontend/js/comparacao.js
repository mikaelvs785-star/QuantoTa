async function carregarComparacao() {
  const produto = JSON.parse(localStorage.getItem('produtoSelecionado'));
  const titulo = document.getElementById('tituloProduto');
  const tabela = document.getElementById('corpoComparacao');

  if (!produto) {
    titulo.textContent = 'Nenhum produto selecionado';
    return;
  }

  titulo.textContent = `Comparação de preços: ${produto.nome}`;

  try {
    const precos = await apiRequest(`/precos/produto/${produto.id}`);
    tabela.innerHTML = '';

    const menor = precos.length ? Math.min(...precos.map(p => Number(p.valor))) : null;

    precos.forEach(preco => {
      const linha = document.createElement('tr');
      const destaque = Number(preco.valor) === menor ? 'highlight' : '';
      linha.innerHTML = `
        <td>${preco.mercado.nome}</td>
        <td class="${destaque}">R$ ${Number(preco.valor).toFixed(2)}</td>
        <td>${preco.dataColeta}</td>
        <td>${preco.observacao || '-'}</td>
        <td><button class="btn" onclick="adicionarNaLista(${produto.id})">Adicionar</button></td>
      `;
      tabela.appendChild(linha);
    });
  } catch (error) {
    alert('Erro ao carregar comparação: ' + error.message);
  }
}

function adicionarNaLista(produtoId) {
  const carrinho = JSON.parse(localStorage.getItem('listaTemporaria')) || [];
  const itemExistente = carrinho.find(item => item.produtoId === produtoId);

  if (itemExistente) itemExistente.quantidade += 1;
  else carrinho.push({ produtoId, quantidade: 1 });

  localStorage.setItem('listaTemporaria', JSON.stringify(carrinho));
  alert('Produto adicionado na lista temporária!');
}

document.addEventListener('DOMContentLoaded', carregarComparacao);
