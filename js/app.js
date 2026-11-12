let produtos = JSON.parse(localStorage.getItem('saborexpress_v2')) || PRODUTOS_INICIAIS;
let carrinho = [];
let categoriaAtual = 'Todos';
let termoBusca = '';

function formatarMoeda(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function salvar() {
  localStorage.setItem('saborexpress_v2', JSON.stringify(produtos));
}

function renderizarCardapio() {
  const lista = document.getElementById('lista-produtos');
  const filtrados = produtos.filter(p => 
    (categoriaAtual === 'Todos' || p.categoria === categoriaAtual) &&
    p.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  lista.innerHTML = filtrados.map(p => `
    <div class="bg-white rounded-2xl shadow-sm border p-4 flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-start">
          <span class="text-xs font-bold text-orange-600 uppercase">${p.categoria}</span>
          ${!p.disponivel ? '<span class="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">Esgotado</span>' : ''}
        </div>
        <h3 class="text-lg font-bold text-gray-800 mt-1">${p.nome}</h3>
        <p class="text-sm text-gray-500 mt-1">${p.descricao}</p>
      </div>
      <div class="mt-4 pt-3 border-t flex items-center justify-between">
        <span class="text-lg font-extrabold text-gray-900">${formatarMoeda(p.preco)}</span>
        <button onclick="adicionarCarrinho(${p.id})" ${!p.disponivel ? 'disabled' : ''} 
          class="px-4 py-2 rounded-xl font-bold text-sm ${p.disponivel ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-gray-300 text-gray-500'}">
          ${p.disponivel ? '+ Adicionar' : 'Indisponível'}
        </button>
      </div>
    </div>
  `).join('');
}

function adicionarCarrinho(id) {
  const prod = produtos.find(p => p.id === id);
  const item = carrinho.find(i => i.id === id);
  if (item) item.qtd++;
  else carrinho.push({ ...prod, qtd: 1 });
  atualizarCarrinho();
}

function alterarQtd(id, delta) {
  const idx = carrinho.findIndex(i => i.id === id);
  if (idx > -1) {
    carrinho[idx].qtd += delta;
    if (carrinho[idx].qtd <= 0) carrinho.splice(idx, 1);
  }
  atualizarCarrinho();
}

function atualizarCarrinho() {
  document.getElementById('contador-carrinho').textContent = carrinho.reduce((s, i) => s + i.qtd, 0);
  const divItens = document.getElementById('itens-carrinho');
  
  if (carrinho.length === 0) {
    divItens.innerHTML = '<p class="text-gray-500 text-center py-6">Seu carrinho está vazio.</p>';
    document.getElementById('valor-total').textContent = 'R$ 0,00';
    return;
  }

  let total = 0;
  divItens.innerHTML = carrinho.map(i => {
    total += i.preco * i.qtd;
    return `
      <div class="flex justify-between items-center bg-gray-50 p-3 rounded-xl border">
        <div><h4 class="font-bold text-sm">${i.nome}</h4><span class="text-xs text-gray-500">${formatarMoeda(i.preco)}</span></div>
        <div class="flex items-center gap-2">
          <button onclick="alterarQtd(${i.id}, -1)" class="w-7 h-7 bg-gray-200 rounded font-bold">-</button>
          <span class="font-bold text-sm">${i.qtd}</span>
          <button onclick="alterarQtd(${i.id}, 1)" class="w-7 h-7 bg-orange-600 text-white rounded font-bold">+</button>
        </div>
      </div>`;
  }).join('');
  document.getElementById('valor-total').textContent = formatarMoeda(total);
}

// Eventos
document.getElementById('campo-busca').addEventListener('input', e => { termoBusca = e.target.value; renderizarCardapio(); });

document.querySelectorAll('.btn-categoria').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.btn-categoria').forEach(b => b.className = 'btn-categoria bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap');
    btn.className = 'btn-categoria bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap';
    categoriaAtual = btn.dataset.categoria;
    renderizarCardapio();
  });
});

document.getElementById('btn-abrir-carrinho').onclick = () => document.getElementById('modal-carrinho').classList.remove('hidden');
document.getElementById('btn-fechar-carrinho').onclick = () => document.getElementById('modal-carrinho').classList.add('hidden');

document.getElementById('btn-finalizar-pedido').onclick = () => {
  const nome = document.getElementById('cliente-nome').value.trim();
  const entrega = document.getElementById('cliente-entrega').value;
  const end = document.getElementById('cliente-endereco').value.trim();
  const pag = document.getElementById('cliente-pagamento').value;

  if (!carrinho.length || !nome || (entrega === 'Entrega' && !end)) {
    alert('Preencha o carrinho, seu nome e endereço (se for entrega).');
    return;
  }

  let total = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
  let itensTxt = carrinho.map(i => `• ${i.qtd}x ${i.nome}`).join('\n');
  let msg = `*PEDIDO SABOREXPRESS*\nCliente: ${nome}\nTipo: ${entrega}\n${entrega === 'Entrega' ? 'Endereço: ' + end + '\n' : ''}Pagamento: ${pag}\n\n${itensTxt}\n\n*Total: ${formatarMoeda(total)}*`;
  
  window.open(`https://wa.me{encodeURIComponent(msg)}`, '_blank');
  carrinho = [];
  atualizarCarrinho();
  document.getElementById('modal-carrinho').classList.add('hidden');
};

// Admin
document.getElementById('btn-toggle-admin').onclick = () => {
  document.getElementById('visao-cliente').classList.add('hidden');
  document.getElementById('visao-admin').classList.remove('hidden');
  renderizarAdmin();
};

document.getElementById('btn-voltar-cardapio').onclick = () => {
  document.getElementById('visao-admin').classList.add('hidden');
  document.getElementById('visao-cliente').classList.remove('hidden');
  renderizarCardapio();
};

function renderizarAdmin() {
  document.getElementById('admin-lista-produtos').innerHTML = produtos.map(p => `
    <div class="bg-white p-4 rounded-xl border flex justify-between items-center">
      <div><span class="text-xs font-bold text-orange-600">${p.categoria}</span><h4 class="font-bold">${p.nome} - ${formatarMoeda(p.preco)}</h4></div>
      <button onclick="alternarStatus(${p.id})" class="px-3 py-1 rounded text-xs font-bold ${p.disponivel ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
        ${p.disponivel ? 'Disponível' : 'Esgotado'}
      </button>
    </div>`).join('');
}

function alternarStatus(id) {
  const p = produtos.find(x => x.id === id);
  if (p) { p.disponivel = !p.disponivel; salvar(); renderizarAdmin(); }
}

document.getElementById('form-novo-produto').onsubmit = e => {
  e.preventDefault();
  produtos.push({
    id: Date.now(),
    nome: document.getElementById('admin-nome').value,
    preco: parseFloat(document.getElementById('admin-preco').value),
    categoria: document.getElementById('admin-categoria').value,
    descricao: document.getElementById('admin-descricao').value,
    disponivel: true
  });
  salvar(); e.target.reset(); renderizarAdmin(); alert('Item cadastrado!');
};

renderizarCardapio();
atualizarCarrinho();
