async function carregarLista() {
  const lista = JSON.parse(localStorage.getItem('listaTemporaria')) || [];
  const corpo = document.getElementById('corpoLista');
  const totalEl = document.getElementById('totalEstimado');
  corpo.innerHTML = '';

  let total = 0;

  for (const item of lista) {
    const produto = await apiRequest(`/produtos/${item.produtoId}`);
    const precos = await apiRequest(`/precos/produto/${item.produtoId}`);
    const menor = precos.length ? Math.min(...precos.map(p => Number(p.valor))) : 0;
    total += menor * item.quantidade;

    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${produto.nome}</td>
      <td>${item.quantidade}</td>
      <td>R$ ${menor.toFixed(2)}</td>
      <td>R$ ${(menor * item.quantidade).toFixed(2)}</td>
    `;
    corpo.appendChild(linha);
  }

  totalEl.textContent = `R$ ${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', carregarLista);
