console.log('[HomePage.js] Carregado');
export class HomePage {
  constructor(container, scoreManager) {
    this.container = container;
    this.scoreManager = scoreManager;
  }

  mount() {
    console.log('[HomePage.js] mount()');
    const scores = this.scoreManager.getAll();
    this.container.innerHTML = `
      <div class="home-page">
      
        <section class="hero">
          <h2>Arcade Hub</h2>
          <p>Escolha um jogo para começar!</p>
        </section>
        <div class="game-grid">
          <a href="#/velha" class="game-card" data-nav>
            <span class="game-icon">❌⭕</span>
            <h3>Jogo da Velha</h3>
            <p>Clássico jogo de estratégia. Modos PvP, PvE e 3 jogadores!</p>
          </a>
          <a href="#/forca" class="game-card" data-nav>
            <span class="game-icon">🪢</span>
            <h3>Forca</h3>
            <p>Adivinhe a palavra antes de ser enforcado!</p>
          </a>
          <a href="#/jokenpo" class="game-card" data-nav>
            <span class="game-icon">✂️📄🪨</span>
            <h3>Jokenpo</h3>
            <p>Pedra, papel ou tesoura contra o computador!</p>
          </a>
          <a href="#/memoria" class="game-card" data-nav>
            <span class="game-icon">🧠</span>
            <h3>Memoria</h3>
            <p>Teste sua memoria encontrando os pares!</p>
          </a>
        </div>
        <div class="quick-stats">
          <h3>Suas Estatisticas</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-value">${this._totalGames(scores)}</span>
              <span class="stat-label">Partidas</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">${this._totalWins(scores)}</span>
              <span class="stat-label">Vitorias</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _totalGames(scores) {
    let total = 0;
    total += (scores.velha?.X ?? 0) + (scores.velha?.O ?? 0) + (scores.velha?.Y ?? 0) + (scores.velha?.draws ?? 0);
    total += (scores.forca?.wins ?? 0) + (scores.forca?.losses ?? 0);
    total += (scores.jokenpo?.wins ?? 0) + (scores.jokenpo?.losses ?? 0) + (scores.jokenpo?.draws ?? 0);
    total += (scores.memoria?.wins ?? 0) + (scores.memoria?.losses ?? 0);
    return total;
  }

  _totalWins(scores) {
    let wins = 0;
    wins += (scores.velha?.X ?? 0);
    wins += scores.forca?.wins ?? 0;
    wins += scores.jokenpo?.wins ?? 0;
    wins += scores.memoria?.wins ?? 0;
    return wins;
  }

  onLeave() {}
}
