import { GameController } from './GameController.js';

export class VelhaGame {
  constructor(container, scoreManager) {
    this.container = container;
    this.scoreManager = scoreManager;
    this.controller = null;
  }

  mount() {
    this.container.innerHTML = `
      <div class="game-page">
        <div class="game-header">
          <h2>Jogo da Velha</h2>
          <div class="game-controls">
            <select id="modoJogo">
              <option value="pvp">Jogador vs Jogador</option>
              <option value="pve">Jogador vs Computador</option>
              <option value="pvp3">3 Jogadores</option>
            </select>
            <select id="dificuldade">
              <option value="facil">Facil</option>
              <option value="medio">Medio</option>
              <option value="dificil">Dificil</option>
            </select>
          </div>
        </div>
        <div class="velha-layout">
          <div class="velha-board-container">
            <div id="display" class="display"></div>
            <div id="tabuleiro" class="tabuleiro">
              ${Array.from({ length: 9 }, (_, i) => `<div id="c${i}" class="cell" tabindex="0" role="button"></div>`).join('')}
            </div>
            <div class="game-actions">
              <button id="undoBtn" class="btn">Desfazer (U)</button>
              <button id="resetBtn" class="btn">Reiniciar (R)</button>
              <button id="clearScoresBtn" class="btn">Zerar Placar</button>
            </div>
          </div>
          <div class="velha-sidebar">
            <div class="score-card">
              <h3>Placar</h3>
              <div class="scores">
                <div class="score-row"><span class="symbol X">X</span><span id="placarX">0</span></div>
                <div class="score-row"><span class="symbol O">O</span><span id="placarO">0</span></div>
                <div class="score-row"><span class="symbol Y">Y</span><span id="placarY">0</span></div>
              </div>
            </div>
            <div class="stats-card">
              <h3>Estatisticas</h3>
              <p>Total: <span id="statTotal">0</span></p>
              <p>Vitorias X: <span id="statVitoriasX">0</span></p>
              <p>Vitorias O: <span id="statVitoriasO">0</span></p>
              <p>Vitorias Y: <span id="statVitoriasY">0</span></p>
              <p>Empates: <span id="statEmpates">0</span></p>
            </div>
          </div>
        </div>
      </div>
    `;
    this.controller = new GameController(this.scoreManager);
  }

  onLeave() {
    this.controller = null;
  }
}
