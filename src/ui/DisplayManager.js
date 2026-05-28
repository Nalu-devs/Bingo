console.log('[DisplayManager.js] Carregado');
import { COUNTDOWN_SECONDS } from '../game/constants.js';

export class DisplayManager {
  constructor(displayId) {
    console.log('[DisplayManager.js] Construtor', displayId);
    this.displayElement = document.getElementById(displayId);
    this.countdownInterval = null;
    this.countdownValue = COUNTDOWN_SECONDS;
  }

  showMessage(html) {
    console.log('[DisplayManager.js] showMessage()', html.substring(0, 50));
    this.displayElement.innerHTML = html;
  }

  showMainMenu(mode) {
    console.log('[DisplayManager.js] showMainMenu() modo:', mode);
    if (mode === 'pve') {
      this.showMessage('<h1>Jogo da Velha</h1><p>Sua vez!</p>');
    } else {
      this.showMessage('<h1>Jogo da Velha</h1>');
    }
  }

  showPlayerTurn(player) {
    console.log('[DisplayManager.js] showPlayerTurn()', player);
    this.showMessage(`<h1>Vez do jogador: ${player}</h1>`);
  }

  showComputerTurn() {
    console.log('[DisplayManager.js] showComputerTurn()');
    this.showMessage('<h1>Vez do computador...</h1>');
  }

  showWinner(player) {
    console.log('[DisplayManager.js] showWinner()', player);
    this.showMessage(`<h1 class="vencedor">Jogador ${player} venceu!</h1>`);
  }

  showComputerWin() {
    console.log('[DisplayManager.js] showComputerWin()');
    this.showMessage('<h1 class="vencedor">Computador venceu!</h1>');
  }

  showDraw() {
    console.log('[DisplayManager.js] showDraw()');
    this.showMessage('<h1>Empate!</h1>');
  }

  showNoUndo() {
    console.log('[DisplayManager.js] showNoUndo()');
    this.showMessage('<h1>Nenhuma jogada para desfazer!</h1>');
  }

  startCountdown(onComplete) {
    console.log('[DisplayManager.js] startCountdown()');
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
    console.log('[DisplayManager.js] stopCountdown()');
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  updateScores(scores) {
    console.log('[DisplayManager.js] updateScores()', scores);
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    setText('placarX', scores.X);
    setText('placarO', scores.O);
    setText('placarY', scores.Y);
  }

  updateStatistics(stats, scores) {
    console.log('[DisplayManager.js] updateStatistics()', stats);
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    setText('statTotal', stats.total);
    setText('statVitoriasX', scores.X);
    setText('statVitoriasO', scores.O);
    setText('statVitoriasY', scores.Y);
    setText('statEmpates', stats.draws);
  }
}
