import { COUNTDOWN_SECONDS } from '../game/constants.js';

export class DisplayManager {
  constructor(displayId) {
    this.displayElement = document.getElementById(displayId);
    this.countdownInterval = null;
    this.countdownValue = COUNTDOWN_SECONDS;
  }

  showMessage(html) {
    this.displayElement.innerHTML = html;
  }

  showMainMenu(mode) {
    if (mode === 'pve') {
      this.showMessage('<h1>Jogo da Velha</h1><p>Sua vez!</p>');
    } else {
      this.showMessage('<h1>Jogo da Velha</h1>');
    }
  }

  showTurn(player) {
    this.showMessage(`<h1>Vez do jogador: ${player}</h1>`);
  }

  showPlayerTurn(player) {
    this.showMessage(`<h1>Vez do jogador: ${player}</h1>`);
  }

  showComputerTurn() {
    this.showMessage('<h1>Vez do computador...</h1>');
  }

  showWinner(player) {
    this.showMessage(`<h1 class="vencedor">Jogador ${player} venceu!</h1>`);
  }

  showComputerWin() {
    this.showMessage('<h1 class="vencedor">Computador venceu!</h1>');
  }

  showDraw() {
    this.showMessage('<h1>Empate!</h1>');
  }

  showNoUndo() {
    this.showMessage('<h1>Nenhuma jogada para desfazer!</h1>');
  }

  startCountdown(onComplete) {
    this.countdownValue = COUNTDOWN_SECONDS;
    this.stopCountdown();

    const baseContent = this.displayElement.innerHTML;

    this.countdownInterval = setInterval(() => {
      this.countdownValue--;
      if (this.countdownValue > 0) {
        this.displayElement.innerHTML =
          `${baseContent}<p class="countdown">Reiniciando em ${this.countdownValue}s...</p>`;
      } else {
        this.stopCountdown();
        onComplete();
      }
    }, 1000);

    this.displayElement.innerHTML =
      `${baseContent}<p class="countdown">Reiniciando em ${this.countdownValue}s...</p>`;
  }

  stopCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  updateScores(scores) {
    const xEl = document.getElementById('placarX');
    const oEl = document.getElementById('placarO');
    if (xEl) xEl.textContent = scores.X;
    if (oEl) oEl.textContent = scores.O;
  }

  updateStatistics(stats, scores) {
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    setText('statTotal', stats.total);
    setText('statVitoriasX', scores.X);
    setText('statVitoriasO', scores.O);
    setText('statEmpates', stats.draws);
  }
}
