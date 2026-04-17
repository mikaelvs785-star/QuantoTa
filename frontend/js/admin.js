async function cadastrarProduto(event) {
  event.preventDefault();
  const payload = {
    nome: document.getElementById('produtoNome').value,
    categoria: document.getElementById('produtoCategoria').value,
    unidadeMedida: document.getElementById('produtoUnidade').value,
    marca: document.getElementById('produtoMarca').value,
    descricao: document.getElementById('produtoDescricao').value,
    ativo: true
  };
  await apiRequest('/produtos', { method: 'POST', body: JSON.stringify(payload) });
  alert('Produto cadastrado com sucesso!');
}

async function cadastrarMercado(event) {
  event.preventDefault();
  const payload = {
    nome: document.getElementById('mercadoNome').value,
    endereco: document.getElementById('mercadoEndereco').value,
    bairro: document.getElementById('mercadoBairro').value,
    cidade: document.getElementById('mercadoCidade').value,
    estado: document.getElementById('mercadoEstado').value,
    telefone: document.getElementById('mercadoTelefone').value,
    ativo: true
  };
  await apiRequest('/mercados', { method: 'POST', body: JSON.stringify(payload) });
  alert('Mercado cadastrado com sucesso!');
}

async function cadastrarPreco(event) {
  event.preventDefault();
  const payload = {
    produto: { id: Number(document.getElementById('precoProdutoId').value) },
    mercado: { id: Number(document.getElementById('precoMercadoId').value) },
    valor: Number(document.getElementById('precoValor').value),
    dataColeta: document.getElementById('precoData').value,
    observacao: document.getElementById('precoObs').value
  };
  await apiRequest('/precos', { method: 'POST', body: JSON.stringify(payload) });
  alert('Preço cadastrado com sucesso!');
}
