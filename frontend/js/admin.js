let cacheProdutos = [];
let cacheMercados = [];

async function inicializarAdmin() {
  const usuario = getUsuarioLogado();
  if (!usuario || usuario.perfil !== 'ADMIN') {
    showMessage('adminFeedback', 'A área admin é exclusiva para administradores.', 'warning');
    document.getElementById('blocosAdmin').classList.add('hidden');
    return;
  }

  await Promise.all([carregarProdutosSelect(), carregarMercadosSelect(), carregarSolicitacoes()]);
}

async function carregarProdutosSelect() {
  cacheProdutos = await apiRequest('/produtos');
  const select = document.getElementById('precoProdutoId');
  if (!select) return;
  select.innerHTML = '<option value="">Selecione</option>' + cacheProdutos.map(produto => `<option value="${produto.id}">${produto.nome}</option>`).join('');
}

async function carregarMercadosSelect() {
  cacheMercados = await apiRequest('/mercados');
  const select = document.getElementById('precoMercadoId');
  if (!select) return;
  select.innerHTML = '<option value="">Selecione</option>' + cacheMercados.map(mercado => `<option value="${mercado.id}">${mercado.nome}</option>`).join('');
}

async function cadastrarProduto(event) {
  event.preventDefault();
  clearMessage('adminFeedback');
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
    showMessage('adminFeedback', 'Produto cadastrado com sucesso.', 'success');
    event.target.reset();
    await carregarProdutosSelect();
  } catch (error) {
    showMessage('adminFeedback', error.message, 'error');
  }
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
  try {
    await apiRequest('/mercados', { method: 'POST', body: JSON.stringify(payload) });
    showMessage('adminFeedback', 'Mercado cadastrado com sucesso.', 'success');
    event.target.reset();
    await carregarMercadosSelect();
  } catch (error) {
    showMessage('adminFeedback', error.message, 'error');
  }
}

async function cadastrarPreco(event) {
  event.preventDefault();
  const usuario = getUsuarioLogado();
  const payload = {
    produtoId: Number(document.getElementById('precoProdutoId').value),
    mercadoId: Number(document.getElementById('precoMercadoId').value),
    usuarioCadastroId: usuario.id,
    valor: Number(document.getElementById('precoValor').value),
    dataColeta: document.getElementById('precoData').value,
    observacao: document.getElementById('precoObs').value
  };
  try {
    await apiRequest('/precos', { method: 'POST', body: JSON.stringify(payload) });
    showMessage('adminFeedback', 'Preço cadastrado com sucesso.', 'success');
    event.target.reset();
  } catch (error) {
    showMessage('adminFeedback', error.message, 'error');
  }
}

async function carregarSolicitacoes() {
  const corpo = document.getElementById('corpoSolicitacoes');
  if (!corpo) return;
  const solicitacoes = await apiRequest('/solicitacoes-vendedor');
  const usuario = getUsuarioLogado();
  corpo.innerHTML = solicitacoes.length ? solicitacoes.map(s => `
    <tr>
      <td>${s.usuario.nome}<br><span class="small">${s.usuario.email}</span></td>
      <td>${s.nomeMercado}</td>
      <td>${s.cnpjMercado}</td>
      <td><span class="status-pill ${s.status === 'PENDENTE' ? 'warning' : s.status === 'APROVADO' ? 'success' : 'danger'}">${s.status}</span></td>
      <td>${formatDate((s.dataSolicitacao || '').slice(0,10))}</td>
      <td>
        <div class="actions">
          <button class="btn" onclick="analisarSolicitacao(${s.id}, 'aprovar', ${usuario.id})">Aprovar</button>
          <button class="btn btn-outline" onclick="analisarSolicitacao(${s.id}, 'rejeitar', ${usuario.id})">Rejeitar</button>
          <button class="btn btn-danger" onclick="analisarSolicitacao(${s.id}, 'bloquear', ${usuario.id})">Bloquear</button>
        </div>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="6" class="small">Nenhuma solicitação cadastrada.</td></tr>';
}

async function analisarSolicitacao(id, acao, adminId) {
  const motivo = prompt(`Informe um motivo para ${acao} esta solicitação:`) || '';
  try {
    await apiRequest(`/solicitacoes-vendedor/${id}/${acao}`, {
      method: 'PUT',
      body: JSON.stringify({ adminId, motivoAnalise: motivo })
    });
    showMessage('adminFeedback', `Solicitação atualizada com sucesso (${acao}).`, 'success');
    await carregarSolicitacoes();
  } catch (error) {
    showMessage('adminFeedback', error.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', inicializarAdmin);
