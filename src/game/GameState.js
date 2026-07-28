import { BOARD_SIZE, SYMBOLS, GAME_MODES } from './constants.js';

export class GameState {
  constructor() {
    this.difficulty = 'facil';
    this.mode = GAME_MODES.PVP;
    this.scores = { X: 0, O: 0, Y: 0 };
    this.statistics = { total: 0, draws: 0 };
    this.boardSnapshots = [];
    this.reset();
  }

  reset() {
    this.board = Array(BOARD_SIZE).fill('');
    this.currentPlayer = SYMBOLS[0];
    this.isActive = true;
    this.moveHistory = [];
    this.boardSnapshots = [];
  }

  makeMove(index) {
    if (!this.isActive) {
      return false;
    }
    if (index < 0 || index >= BOARD_SIZE) return false;
    if (this.board[index] !== '') {
      return false;
    }

    this.boardSnapshots.push({
      board: [...this.board],
      player: this.currentPlayer,
    });

    this.board[index] = this.currentPlayer;
    this.moveHistory.push({ index, player: this.currentPlayer });
    return true;
  }

  undoLastMove() {
    if (this.boardSnapshots.length === 0) {
      return false;
    }

    const snapshot = this.boardSnapshots.pop();
    this.board = snapshot.board;
    this.currentPlayer = snapshot.player;
    this.moveHistory.pop();
    this.isActive = true;
    return true;
  }

  switchPlayer() {
    if (this.mode === GAME_MODES.PVP3) {
      const idx = SYMBOLS.indexOf(this.currentPlayer);
      this.currentPlayer = SYMBOLS[(idx + 1) % SYMBOLS.length];
    } else {
      this.currentPlayer = this.currentPlayer === SYMBOLS[0] ? SYMBOLS[1] : SYMBOLS[0];
    }
  }

  incrementScore(player) {
    if (this.scores[player] !== undefined) {
      this.scores[player]++;
    }
    this.statistics.total++;
  }

  incrementDraws() {
    this.statistics.draws++;
    this.statistics.total++;
  }

  resetScores() {
    this.scores = { X: 0, O: 0, Y: 0 };
    this.statistics = { total: 0, draws: 0 };
  }
}
