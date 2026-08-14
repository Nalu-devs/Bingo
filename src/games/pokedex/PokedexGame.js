export class PokedexGame {
  constructor(container, scoreManager) {
    this.container = container;
    this.scoreManager = scoreManager;
    this.isActive = false;
  }

  mount() {
    this.container.innerHTML = `
      <div class="game-page">
        <div class="game-header">
          <h2>Pokedex</h2>
          <p>Busque um Pokemon pelo nome ou numero. Usa a mesma PokeAPI e shape de dados do projeto Pokedex (Nalu-devs/Pokedex).</p>
        </div>
        <div class="pokedex-layout">
          <div class="pokedex-search">
            <input id="pokemonSearch" type="text" placeholder="ex.: pikachu ou 25" />
            <button id="pokemonSearchBtn" class="btn">Buscar</button>
          </div>
          <div id="pokemonResult" class="pokedex-result"></div>
        </div>
      </div>
    `;

    this.searchInput = document.getElementById('pokemonSearch');
    this.searchBtn = document.getElementById('pokemonSearchBtn');
    this.resultEl = document.getElementById('pokemonResult');

    const doSearch = () => this._buscar();
    this.searchBtn.addEventListener('click', doSearch);
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doSearch();
    });

    this.isActive = true;
  }

  async _buscar() {
    const term = this.searchInput.value.trim();
    if (!term) return;
    this.searchBtn.disabled = true;
    this.resultEl.innerHTML = '<p>Carregando...</p>';
    try {
      const url = `https://pokeapi.co/api/v3/pokemon/${term}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Pokemon nao encontrado');
      }
      const dados = await response.json();
      this._render(dados);
    } catch (error) {
      this.resultEl.innerHTML = '<p class="pokedex-erro">Pokemon nao encontrado ou API indisponivel.</p>';
    } finally {
      this.searchBtn.disabled = false;
    }
  }

  _render(dados) {
    const tipos = (dados.types ?? []).map((t) => t.type.name).join(', ');
    const sprite =
      dados.sprites?.frontDefault ??
      dados.sprites?.other?.dream_world?.front_default;
    this.resultEl.innerHTML = `
      <div class="pokedex-card">
        <h3>${dados.name}</h3>
        <p class="pokedex-numero">N. ${dados.id}</p>
        ${sprite ? `<img class="pokedex-img" src="${sprite}" alt="${dados.name}" />` : '<p>Sprite indisponivel</p>'}
        <p>Tipo(s): ${tipos || '-'}</p>
        <p>Altura: ${dados.height ?? '-'} decimetros — Peso: ${dados.weight ?? '-'} hectogramas</p>
      </div>
    `;
  }

  onLeave() {
    this.isActive = false;
  }
}
