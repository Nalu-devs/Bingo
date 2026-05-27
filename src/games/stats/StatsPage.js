console.log('[StatsPage.js] Carregado');
export class StatsPage {
  constructor(container, scoreManager) {
    this.container = container;
    this.scoreManager = scoreManager;
  }

  mount() {
    console.log('[StatsPage.js] mount()');
    const scores = this.scoreManager.getAll();
    this.container.innerHTML = `
      <div class="stats-page">
        <h2>Estatisticas Globais</h2>
        <div class="stats-cards">
          <div class="stat-block">
            <h3>Jogo da Velha</h3>
            <p>Vitorias X: <strong>${scores.velha?.X ?? 0}</strong></p>
            <p>Vitorias O: <strong>${scores.velha?.O ?? 0}</strong></p>
            <p>Vitorias Y: <strong>${scores.velha?.Y ?? 0}</strong></p>
            <p>Empates: <strong>${scores.velha?.draws ?? 0}</strong></p>
          </div>
          <div class="stat-block">
            <h3>Forca</h3>
            <p>Vitorias: <strong>${scores.forca?.wins ?? 0}</strong></p>
            <p>Derrotas: <strong>${scores.forca?.losses ?? 0}</strong></p>
          </div>
          <div class="stat-block">
            <h3>Jokenpo</h3>
            <p>Vitorias: <strong>${scores.jokenpo?.wins ?? 0}</strong></p>
            <p>Derrotas: <strong>${scores.jokenpo?.losses ?? 0}</strong></p>
            <p>Empates: <strong>${scores.jokenpo?.draws ?? 0}</strong></p>
          </div>
          <div class="stat-block">
            <h3>Memoria</h3>
            <p>Vitorias: <strong>${scores.memoria?.wins ?? 0}</strong></p>
            <p>Derrotas: <strong>${scores.memoria?.losses ?? 0}</strong></p>
            <p>Melhor pontuacao: <strong>${scores.memoria?.bestScore === Infinity ? '-' : scores.memoria?.bestScore + ' movimentos'}</strong></p>
          </div>
        </div>
        <button id="resetAllStats" class="btn btn-danger">Zerar todas as estatisticas</button>
      </div>
    `;

    document.getElementById('resetAllStats')?.addEventListener('click', () => {
      console.log('[StatsPage.js] Reset all stats');
      if (confirm('Tem certeza? Todas as estatisticas serao perdidas!')) {
        this.scoreManager.resetAll();
        this.mount();
      }
    });
  }

  onLeave() {}
}
