console.log('[ContaPage.js] Carregado');
export class ContaPage {
  constructor(container, scoreManager) {
    this.container = container;
    this.scoreManager = scoreManager;
  }

  mount() {
    const saved = JSON.parse(localStorage.getItem('conta') || '{}');
    this.container.innerHTML = `
      <div class="conta-page">
        <h2>Minha Conta</h2>
        <form id="contaForm">
          <label>
            Nome
            <input type="text" id="contaNome" value="${saved.nome || ''}" />
          </label>
          <label>
            Email
            <input type="email" id="contaEmail" value="${saved.email || ''}" />
          </label>
          <label>
            Bio
            <textarea id="contaBio" rows="4">${saved.bio || ''}</textarea>
          </label>
          <label>
            Cor favorita
            <input type="color" id="contaCor" value="${saved.cor || '#6c63ff'}" />
          </label>
          <button type="button" id="salvarConta" class="btn">Salvar</button>
        </form>
        <div id="contaMensagem"></div>
      </div>
    `;

    document.getElementById('salvarConta').addEventListener('click', () => {
      const data = {
        nome: document.getElementById('contaNome').value,
        email: document.getElementById('contaEmail').value,
        bio: document.getElementById('contaBio').value,
        cor: document.getElementById('contaCor').value,
      };
      localStorage.setItem('conta', JSON.stringify(data));
      document.getElementById('contaMensagem').textContent = 'Dados salvos com sucesso!';
    });
  }

  onLeave() {}
}
