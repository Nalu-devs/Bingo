const form = document.getElementById('form-alimento');
const lista = document.getElementById('lista-alimentos');
const busca = document.getElementById('busca');

let alimentos = JSON.parse(localStorage.getItem('alimentos')) || [];

function salvar() {
  localStorage.setItem('alimentos', JSON.stringify(alimentos));
}

function formatarNumero(n) {
  return Number(n).toFixed(1);
}

function renderizar(filtro = '') {
  const filtrados = alimentos.filter(a =>
    a.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    a.categoria.toLowerCase().includes(filtro.toLowerCase())
  );

  if (filtrados.length === 0) {
    lista.innerHTML = '<div class="vazio">Nenhum alimento cadastrado.</div>';
    return;
  }

  lista.innerHTML = filtrados.map((a, i) => `
    <div class="alimento-card">
      <div class="alimento-info">
        <h3>${a.nome}</h3>
        <span class="categoria">${a.categoria}</span>
        <div class="nutrientes">
          <div>${formatarNumero(a.calorias)} kcal</div>
          <div><span>${formatarNumero(a.proteinas)}</span>g prot</div>
          <div><span>${formatarNumero(a.carboidratos)}</span>g carb</div>
          <div><span>${formatarNumero(a.gorduras)}</span>g gord</div>
        </div>
      </div>
      <button class="btn-excluir" onclick="excluir(${alimentos.indexOf(a)})">Excluir</button>
    </div>
  `).join('');
}

function excluir(index) {
  alimentos.splice(index, 1);
  salvar();
  renderizar(busca.value);
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const alimento = {
    nome: document.getElementById('nome').value.trim(),
    categoria: document.getElementById('categoria').value,
    calorias: document.getElementById('calorias').value,
    proteinas: document.getElementById('proteinas').value,
    carboidratos: document.getElementById('carboidratos').value,
    gorduras: document.getElementById('gorduras').value
  };

  alimentos.push(alimento);
  salvar();
  renderizar(busca.value);
  form.reset();
  document.getElementById('nome').focus();
});

busca.addEventListener('input', e => {
  renderizar(e.target.value);
});

renderizar();
