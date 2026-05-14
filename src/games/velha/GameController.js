import { GameState } from '../../game/GameState.js';
import { AIPlayer } from '../../game/AIPlayer.js';
import { Board } from '../../ui/Board.js';
import { DisplayManager } from '../../ui/DisplayManager.js';
import { SoundManager } from '../../ui/SoundManager.js';
import { ThemeManager } from '../../ui/ThemeManager.js';
import {
  WINNING_COMBOS,
  GAME_MODES,
  AI_DELAY_MS,
} from '../../game/constants.js';

export class GameController {
  constructor(scoreManager) {
    this.scoreManager = scoreManager;
    this.state = new GameState();
    this.ai = new AIPlayer(this.state.difficulty);
    this.board = new Board('tabuleiro', (index) => this.handleCellClick(index));
    this.display = new DisplayManager('display');
    this.sound = new SoundManager();
    this.theme = new ThemeManager();
    this._isAIThinking = false;

    const saved = this.scoreManager.get('velha');
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
  }

  _setupButtons() {
    document.getElementById('undoBtn')?.addEventListener('click', () => this._undo());
    document.getElementById('resetBtn')?.addEventListener('click', () => this._resetGame());
    document.getElementById('clearScoresBtn')?.addEventListener('click', () => this.resetScores());
  }

  _setupControls() {
    const modeSelect = document.getElementById('modoJogo');
    const diffSelect = document.getElementById('dificuldade');

    if (modeSelect) {
      modeSelect.addEventListener('change', () => {
        this.state.mode = modeSelect.value;
        this.ai.setDifficulty(this.state.difficulty);
        if (this.state.mode === GAME_MODES.PVP3) {
          this.state.currentPlayer = 'X';
        }
        this._resetGame();
      });
    }

    if (diffSelect) {
      diffSelect.addEventListener('change', () => {
        this.state.difficulty = diffSelect.value;
        this.ai.setDifficulty(this.state.difficulty);
        this._resetGame();
      });
    }
  }

  _setupKeyboard() {
    document.addEventListener('keydown', (e) => {
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
    const btn = document.getElementById('soundToggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const enabled = this.sound.toggle();
        btn.textContent = enabled ? 'Som' : 'Sem Som';
        btn.classList.toggle('disabled', !enabled);
      });
    }
  }

  _getResult() {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
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
    this.state.isActive = false;

    if (result.winner === 'draw') {
      this.display.showDraw();
      this.state.incrementDraws();
      this.board.animateDraw();
      this.sound.draw();
    } else {
      if (this.state.mode === GAME_MODES.PVE && result.winner === 'O') {
        this.display.showComputerWin();
        this.sound.lose();
      } else {
        this.display.showWinner(result.winner);
        this.sound.win();
      }
      this.board.highlightWinningCells(result.combo);
      this.state.incrementScore(result.winner);
    }

    this.display.updateScores(this.state.scores);
    this.display.updateStatistics(this.state.statistics, this.state.scores);
    this._persistScores();
    this.display.startCountdown(() => this._resetGame());
  }

  _persistScores() {
    this.scoreManager.update('velha', {
      X: this.state.scores.X,
      O: this.state.scores.O,
      Y: this.state.scores.Y,
      draws: this.state.statistics.draws,
    });
  }

  _switchTurn() {
    this.state.switchPlayer();
    this.display.showPlayerTurn(this.state.currentPlayer);

    if (
      this.state.mode === GAME_MODES.PVE &&
      this.state.currentPlayer === 'O'
    ) {
      this._isAIThinking = true;
      this.display.showComputerTurn();
      setTimeout(() => this._doAIMove(), AI_DELAY_MS);
    }
  }

  _doAIMove() {
    this._isAIThinking = false;
    if (!this.state.isActive) return;

    const move = this.ai.getMove(this.state.board);
    if (move === -1) return;

    this.state.makeMove(move);
    this.board.render(this.state.board);
    this.board.animateCell(move);
    this.sound.move();

    const result = this._getResult();
    if (result) {
      this._handleGameEnd(result);
      return;
    }

    this.state.currentPlayer = 'X';
    this.display.showPlayerTurn('X');
  }

  handleCellClick(index) {
    if (!this.state.isActive || this._isAIThinking) return;

    if (
      this.state.mode === GAME_MODES.PVE &&
      this.state.currentPlayer === 'O'
    ) {
      return;
    }

    if (this.state.board[index] !== '') return;

    this.state.makeMove(index);
    this.board.render(this.state.board);
    this.board.animateCell(index);
    this.sound.move();

    const result = this._getResult();
    if (result) {
      this._handleGameEnd(result);
      return;
    }

    this._switchTurn();
  }

  _undo() {
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
    this._isAIThinking = false;
    this.display.stopCountdown();
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
    this.state.resetScores();
    this.scoreManager.reset('velha');
    this.display.updateScores(this.state.scores);
    this.display.updateStatistics(this.state.statistics, this.state.scores);
  }
}
