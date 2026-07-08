console.log('[GameController.js] Carregado');
import { GameState } from '../../game/GameState.js';
import { AIPlayer } from '../../game/AIPlayer.js';
import { Board } from '../../ui/Board.js';
import { DisplayManager } from '../../ui/DisplayManager.js';
import { SoundManager } from '../../ui/SoundManager.js';
import { ThemeManager } from '../../ui/ThemeManager.js';
import { GameTimer } from '../../utils/gameTimer.js';
import { fireConfetti } from '../../utils/confetti.js';
import {
  WINNING_COMBOS,
  GAME_MODES,
  AI_DELAY_MS,
} from '../../game/constants.js';

export class GameController {
  constructor(scoreManager) {
    console.log('[GameController.js] Construtor');
    this.scoreManager = scoreManager;
    this.state = new GameState();
    this.ai = new AIPlayer(this.state.difficulty);
    this.board = new Board('tabuleiro', (index) => this.handleCellClick(index));
    this.display = new DisplayManager('display');
    this.sound = new SoundManager();
    this.theme = new ThemeManager();
    this.timer = new GameTimer((t) => this._onTimerTick(t));
    this._isAIThinking = false;
    this._totalGameTime = 0;
    this._gameCount = 0;

    var saved = this.scoreManager.get('velha');
    if (saved) {
      this.state.scores = { X: saved.X ?? 0, O: saved.O ?? 0, Y: saved.Y ?? 0 };
      this.state.statistics = { total: (saved.X ?? 0) + (saved.O ?? 0) + (saved.Y ?? 0) + (saved.draws ?? 0), draws: saved.draws ?? 0 };
    }

    this._setupControls();
    this._setupKeyboard();
    this._setupSoundToggle();
    this._setupButtons();
    this.display.showMainMenu(this.state.mode);
    this.display.updateScores(this.state.scores);
    this.display.updateStatistics(this.state.statistics, this.state.scores);
    this._updateTimerDisplay();
  }

  _setupButtons() {
    console.log('[GameController.js] _setupButtons()');
    document.getElementById('undoBtn')?.addEventListener('click', () => this._undo());
    document.getElementById('resetBtn')?.addEventListener('click', () => this._resetGame());
    document.getElementById('clearScoresBtn')?.addEventListener('click', () => this.resetScores());
  }

  _setupKeyboard() {
    console.log('[GameController.js] _setupKeyboard()');
    document.addEventListener('keydown', (e) => {
      console.log('[GameController.js] Tecla pressionada:', e.key);
      if (e.key >= '1' && e.key <= '9') {
        this.handleCellClick(parseInt(e.key) - 1);
      } else if (e.key.toLowerCase() === 'u') {
        this._undo();
      } else if (e.key.toLowerCase() === 'r') {
        this._resetGame();
      }
    });
  }

  _setupSoundToggle() {
    console.log('[GameController.js] _setupSoundToggle()');
    var btn = document.getElementById('soundToggle');
    if (btn) {
      btn.addEventListener('click', () => {
        var enabled = this.sound.toggle();
        btn.textContent = enabled ? 'Som' : 'Sem Som';
        btn.classList.toggle('disabled', !enabled);
      });
    }
  }

  _setupControls() {
    console.log('[GameController.js] _setupControls()');
    var modeSelect = document.getElementById('modoJogo');
    var diffSelect = document.getElementById('dificuldade');

    if (modeSelect) {
      console.log('[GameController.js] modeSelect encontrado');
      modeSelect.addEventListener('change', () => {
        console.log('[GameController.js] Modo alterado:', modeSelect.value);
        console.log('[GameController.js] Modo anterior:', this.state.mode);
        this.state.mode = modeSelect.value;
        this.ai.setDifficulty(this.state.difficulty);
        if (this.state.mode === GAME_MODES.PVP3) {
          console.log('[GameController.js] Modo 3 jogadores ativado');
          this.state.currentPlayer = 'X';
        }
        this._resetGame();
      });
    } else {
      console.log('[GameController.js] modeSelect nao encontrado');
    }

    if (diffSelect) {
      console.log('[GameController.js] diffSelect encontrado');
      diffSelect.addEventListener('change', () => {
        console.log('[GameController.js] Dificuldade alterada:', diffSelect.value);
        console.log('[GameController.js] Dificuldade anterior:', this.state.difficulty);
        this.state.difficulty = diffSelect.value;
        this.ai.setDifficulty(this.state.difficulty);
        this._resetGame();
      });
    } else {
      console.log('[GameController.js] diffSelect nao encontrado');
    }
  }

  _getResult() {
    console.log('[GameController.js] _getResult()');
    for (var combo of WINNING_COMBOS) {
      var [a, b, c] = combo;
      if (
        this.state.board[a] &&
        this.state.board[a] === this.state.board[b] &&
        this.state.board[b] === this.state.board[c]
      ) {
        return { winner: this.state.board[a], combo };
      }
    }
    if (this.state.board.every(cell => cell !== '')) {
      return { winner: 'draw', combo: null };
    }
    return null;
  }

  _handleGameEnd(result) {
    console.log('[GameController.js] _handleGameEnd()', result);
    this.state.isActive = false;
    this.timer.stop();
    this._totalGameTime += this.timer.time;
    this._gameCount++;

    if (result.winner === 'draw') {
      console.log('[GameController.js] Empate');
      this.display.showDraw();
      this.state.incrementDraws();
      this.board.animateDraw();
      this.sound.draw();
    } else {
      console.log('[GameController.js] Vencedor:', result.winner);
      if (this.state.mode === GAME_MODES.PVE && result.winner === 'O') {
        this.display.showComputerWin();
        this.sound.lose();
      } else {
        this.display.showWinner(result.winner);
        this.sound.win();
        fireConfetti(60);
      }
      this.board.highlightWinningCells(result.combo);
      this.state.incrementScore(result.winner);
    }

    this.display.updateScores(this.state.scores);
    this.display.updateStatistics(this.state.statistics, this.state.scores);
    this._persistScores();
    this._updateTimerDisplay();
    this.display.startCountdown(() => this._resetGame());
  }

  _persistScores() {
    console.log('[GameController.js] _persistScores()');
    this.scoreManager.update('velha', {
      X: this.state.scores.X,
      O: this.state.scores.O,
      Y: this.state.scores.Y,
      draws: this.state.statistics.draws,
    });
  }

  _switchTurn() {
    console.log('[GameController.js] _switchTurn()');
    this.state.switchPlayer();
    this.display.showPlayerTurn(this.state.currentPlayer);

    if (
      this.state.mode === GAME_MODES.PVE &&
      this.state.currentPlayer === 'O'
    ) {
      console.log('[GameController.js] Vez do computador');
      this._isAIThinking = true;
      this.display.showComputerTurn();
      setTimeout(() => this._doAIMove(), AI_DELAY_MS);
    }
  }

  _doAIMove() {
    console.log('[GameController.js] _doAIMove()');
    this._isAIThinking = false;
    if (!this.state.isActive) {
      console.log('[GameController.js] _doAIMove() jogo inativo, ignorando');
      return;
    }

    var move = this.ai.getMove(this.state.board);
    if (move === -1) {
      console.log('[GameController.js] _doAIMove() nenhum movimento disponivel');
      return;
    }

    if (this.timer.elapsed === 0) this.timer.start();

    this.state.makeMove(move);
    this.board.render(this.state.board);
    this.board.animateCell(move);
    this.sound.move();

    var result = this._getResult();
    if (result) {
      this._handleGameEnd(result);
      return;
    }

    console.log('[GameController.js] _doAIMove() retornando turno para X');
    this.state.currentPlayer = 'X';
    this.display.showPlayerTurn('X');
  }

  handleCellClick(index) {
    console.log('[GameController.js] handleCellClick()', index);
    console.log('[GameController.js] isActive:', this.state.isActive, 'isAIThinking:', this._isAIThinking);
    if (!this.state.isActive || this._isAIThinking) {
      console.log('[GameController.js] handleCellClick() ignorado - estado bloqueado');
      return;
    }

    if (
      this.state.mode === GAME_MODES.PVE &&
      this.state.currentPlayer === 'O'
    ) {
      console.log('[GameController.js] handleCellClick() ignorado - vez do computador');
      return;
    }

    if (this.state.board[index] !== '') {
      console.log('[GameController.js] Celula ocupada:', index);
      return;
    }

    if (this.timer.elapsed === 0) this.timer.start();

    this.state.makeMove(index);
    this.board.render(this.state.board);
    this.board.animateCell(index);
    this.sound.move();

    var result = this._getResult();
    if (result) {
      this._handleGameEnd(result);
      return;
    }

    this._switchTurn();
  }

  _undo() {
    console.log('[GameController.js] _undo()');
    if (!this.state.isActive || this._isAIThinking) return;

    if (this.state.boardSnapshots.length === 0) {
      this.display.showNoUndo();
      setTimeout(() => this.display.showMainMenu(this.state.mode), 1000);
      return;
    }

    if (this.state.mode === GAME_MODES.PVE) {
      this.state.undoLastMove();
      if (this.state.boardSnapshots.length > 0) {
        this.state.undoLastMove();
      }
    } else {
      this.state.undoLastMove();
    }

    this.board.render(this.state.board);
    this.board.clearHighlights();
    this.sound.undo();
    this.display.showMainMenu(this.state.mode);
    this.display.updateScores(this.state.scores);
  }

  _resetGame() {
    console.log('[GameController.js] _resetGame()');
    this._isAIThinking = false;
    this.display.stopCountdown();
    this.timer.reset();
    this.state.reset();
    this.board.render(this.state.board);
    this.board.clearHighlights();
    this.display.showMainMenu(this.state.mode);
    this.display.updateScores(this.state.scores);
    this.display.updateStatistics(this.state.statistics, this.state.scores);

    if (this.state.mode === GAME_MODES.PVE) {
      this._isAIThinking = true;
      this.display.showComputerTurn();
      setTimeout(() => this._doAIMove(), AI_DELAY_MS);
    }
  }

  resetScores() {
    console.log('[GameController.js] resetScores()');
    console.log('[GameController.js] Scores antes do reset:', JSON.stringify(this.state.scores));
    console.log('[GameController.js] Total de partidas antes:', this._gameCount);
    this.state.resetScores();
    this.scoreManager.reset('velha');
    this._totalGameTime = 0;
    this._gameCount = 0;
    this.display.updateScores(this.state.scores);
    this.display.updateStatistics(this.state.statistics, this.state.scores);
    this._updateTimerDisplay();
    console.log('[GameController.js] Scores apos reset:', JSON.stringify(this.state.scores));
  }

  _onTimerTick(elapsed) {
    console.log('[GameController.js] _onTimerTick()', elapsed);
    this._updateTimerValue(elapsed);
  }

  _updateTimerDisplay() {
    console.log('[GameController.js] _updateTimerDisplay()');
    console.log('[GameController.js] _totalGameTime:', this._totalGameTime, '_gameCount:', this._gameCount);
    var avg = this._gameCount > 0 ? Math.round(this._totalGameTime / this._gameCount) : 0;
    var label = document.getElementById('timerLabel');
    if (label) {
      label.textContent = this._gameCount > 0
        ? `Media: ${this.timer.format(avg)} por partida`
        : 'Tempo medio: -';
      console.log('[GameController.js] Timer label atualizado:', label.textContent);
    } else {
      console.log('[GameController.js] timerLabel nao encontrado');
    }
  }

  _updateTimerValue(seconds) {
    console.log('[GameController.js] _updateTimerValue()', seconds);
    var el = document.getElementById('gameTimer');
    if (el) el.textContent = this.timer.format(seconds);
  }
}
