let produtosCache = [];
let mercadosCache = [];

function fillSelect(selectId, items, placeholder, labelKey = 'nome') {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = `<option value="">${placeholder}</option>` + items
    .map(item => `<option value="${item.id}">${escapeHtml(item[labelKey])}</option>`)
    .join('');
}

function renderQuickLists() {
  const produtosEl = document.getElementById('listaProdutosAdmin');
  const mercadosEl = document.getElementById('listaMercadosAdmin');

  if (produtosEl) {
    produtosEl.innerHTML = produtosCache.length
      ? produtosCache.slice(0, 6).map(produto => `<li>${escapeHtml(produto.nome)} <span class="muted">#${produto.id}</span></li>`).join('')
      : '<li class="muted">Nenhum produto cadastrado ainda.</li>';
  }

  if (mercadosEl) {
    mercadosEl.innerHTML = mercadosCache.length
      ? mercadosCache.slice(0, 6).map(mercado => `<li>${escapeHtml(mercado.nome)} <span class="muted">#${mercado.id}</span></li>`).join('')
      : '<li class="muted">Nenhum mercado cadastrado ainda.</li>';
  }
}

async function carregarDadosAdmin() {
  requireAdminPage();
  if (!isAdmin()) return;

  try {
    [produtosCache, mercadosCache] = await Promise.all([
      apiRequest('/produtos'),
      apiRequest('/mercados')
    ]);

    fillSelect('precoProdutoId', produtosCache, 'Selecione um produto');
    fillSelect('precoMercadoId', mercadosCache, 'Selecione um mercado');
    renderQuickLists();
  } catch (error) {
    setStatusMessage('adminStatus', `Erro ao carregar dados auxiliares: ${error.message}`, 'error');
  }
}

async function cadastrarProduto(event) {
  event.preventDefault();
  setStatusMessage('adminStatus', 'Salvando produto...', 'info');

  const payload = {
    nome: document.getElementById('produtoNome').value,
    categoria: document.getElementById('produtoCategoria').value,
    unidadeMedida: document.getElementById('produtoUnidade').value,
    marca: document.getElementById('produtoMarca').value,
    descricao: document.getElementById('produtoDescricao').value,
    ativo: true
  };

  try {
    await apiRequest('/produtos', { method: 'POST', body: JSON.stringify(payload) });
    event.target.reset();
    setStatusMessage('adminStatus', 'Produto cadastrado com sucesso.', 'success');
    showToast('Produto salvo.', 'success');
    await carregarDadosAdmin();
  } catch (error) {
    setStatusMessage('adminStatus', `Erro ao cadastrar produto: ${error.message}`, 'error');
  }
}

async function cadastrarMercado(event) {
  event.preventDefault();
  setStatusMessage('adminStatus', 'Salvando mercado...', 'info');

  const payload = {
    nome: document.getElementById('mercadoNome').value,
    endereco: document.getElementById('mercadoEndereco').value,
    bairro: document.getElementById('mercadoBairro').value,
    cidade: document.getElementById('mercadoCidade').value,
    estado: document.getElementById('mercadoEstado').value,
    telefone: document.getElementById('mercadoTelefone').value,
    ativo: true
  };

  try {
    await apiRequest('/mercados', { method: 'POST', body: JSON.stringify(payload) });
    event.target.reset();
    setStatusMessage('adminStatus', 'Mercado cadastrado com sucesso.', 'success');
    showToast('Mercado salvo.', 'success');
    await carregarDadosAdmin();
  } catch (error) {
    setStatusMessage('adminStatus', `Erro ao cadastrar mercado: ${error.message}`, 'error');
  }
}

async function cadastrarPreco(event) {
  event.preventDefault();
  setStatusMessage('adminStatus', 'Salvando preço...', 'info');

  const produtoId = Number(document.getElementById('precoProdutoId').value);
  const mercadoId = Number(document.getElementById('precoMercadoId').value);
  if (!produtoId || !mercadoId) {
    setStatusMessage('adminStatus', 'Selecione produto e mercado para cadastrar o preço.', 'warning');
    return;
  }

  const payload = {
    produto: { id: produtoId },
    mercado: { id: mercadoId },
    valor: Number(document.getElementById('precoValor').value),
    dataColeta: document.getElementById('precoData').value,
    observacao: document.getElementById('precoObs').value
  };

  try {
    await apiRequest('/precos', { method: 'POST', body: JSON.stringify(payload) });
    event.target.reset();
    setStatusMessage('adminStatus', 'Preço cadastrado com sucesso.', 'success');
    showToast('Preço salvo.', 'success');
  } catch (error) {
    setStatusMessage('adminStatus', `Erro ao cadastrar preço: ${error.message}`, 'error');
  }
}

document.addEventListener('DOMContentLoaded', carregarDadosAdmin);
