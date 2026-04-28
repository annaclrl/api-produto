const BASE = '/produtos';
let produtos = [];


function toast(msg, erro = false) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'show' + (erro ? ' error' : '');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.className = '', 3000);
}


async function buscarProdutos() {
  try {
    const r = await fetch(BASE);
    if (!r.ok) throw new Error();
    produtos = await r.json();
    renderTabela(produtos);
    document.getElementById('count-label').textContent =
      `${produtos.length} produto${produtos.length !== 1 ? 's' : ''} cadastrado${produtos.length !== 1 ? 's' : ''}`;
  } catch {
    document.getElementById('table-container').innerHTML =
      `<div class="empty"><span>⚠</span>Não foi possível conectar à API.<br>Verifique se o servidor está rodando em localhost:8080.</div>`;
  }
}

function renderTabela(lista) {
  const c = document.getElementById('table-container');
  if (!lista.length) {
    c.innerHTML = `<div class="empty"><span>📦</span>Nenhum produto encontrado.</div>`;
    return;
  }

  const rows = lista.map(p => {
    const stockClass = p.quantidade <= 5 ? 'low' : '';
    return `
      <tr>
        <td class="id">#${p.id}</td>
        <td class="name">${escape(p.nome)}</td>
        <td>${escape(p.descricao)}</td>
        <td class="price">R$ ${Number(p.preco).toFixed(2)}</td>
        <td><span class="stock-pill ${stockClass}">${p.quantidade} un.</span></td>
        <td class="actions">
          <button class="btn-icon" onclick="abrirModal(${p.id})">editar</button>
          <button class="btn-icon del" onclick="deletar(${p.id})">excluir</button>
        </td>
      </tr>`;
  }).join('');

  c.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Descrição</th>
          <th>Preço</th>
          <th>Qtd.</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function escape(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}


function filtrarTabela() {
  const q = document.getElementById('search').value.toLowerCase();
  renderTabela(produtos.filter(p => p.nome.toLowerCase().includes(q)));
}


async function criarProduto() {
  const nome     = document.getElementById('inp-nome').value.trim();
  const descricao = document.getElementById('inp-descricao').value.trim();
  const preco    = parseFloat(document.getElementById('inp-preco').value);
  const quantidade = parseInt(document.getElementById('inp-quantidade').value);

  if (!nome || !descricao || isNaN(preco) || isNaN(quantidade)) {
    toast('Preencha todos os campos.', true); return;
  }

  try {
    const r = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, descricao, preco, quantidade })
    });
    if (!r.ok) throw new Error();
    document.getElementById('inp-nome').value = '';
    document.getElementById('inp-descricao').value = '';
    document.getElementById('inp-preco').value = '';
    document.getElementById('inp-quantidade').value = '';
    toast('Produto adicionado!');
    buscarProdutos();
  } catch {
    toast('Erro ao criar produto.', true);
  }
}


async function deletar(id) {
  if (!confirm('Excluir este produto?')) return;
  try {
    const r = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    if (!r.ok) throw new Error();
    toast('Produto excluído.');
    buscarProdutos();
  } catch {
    toast('Erro ao excluir.', true);
  }
}

function abrirModal(id) {
  const p = produtos.find(x => x.id === id);
  if (!p) return;
  document.getElementById('edit-id').value = p.id;
  document.getElementById('edit-nome').value = p.nome;
  document.getElementById('edit-descricao').value = p.descricao;
  document.getElementById('edit-preco').value = p.preco;
  document.getElementById('edit-quantidade').value = p.quantidade;
  document.getElementById('modal').classList.add('open');
}

function fecharModal() {
  document.getElementById('modal').classList.remove('open');
}

async function salvarEdicao() {
  const id       = document.getElementById('edit-id').value;
  const nome     = document.getElementById('edit-nome').value.trim();
  const descricao = document.getElementById('edit-descricao').value.trim();
  const preco    = parseFloat(document.getElementById('edit-preco').value);
  const quantidade = parseInt(document.getElementById('edit-quantidade').value);

  if (!nome || !descricao || isNaN(preco) || isNaN(quantidade)) {
    toast('Preencha todos os campos.', true); return;
  }

  try {
    const r = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, descricao, preco, quantidade })
    });
    if (!r.ok) throw new Error();
    fecharModal();
    toast('Produto atualizado!');
    buscarProdutos();
  } catch {
    toast('Erro ao atualizar.', true);
  }
}


document.getElementById('modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) fecharModal();
});

['inp-nome', 'inp-descricao', 'inp-preco', 'inp-quantidade'].forEach(id => {
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter') criarProduto();
  });
});

buscarProdutos();