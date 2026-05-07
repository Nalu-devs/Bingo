import { BOARD_SIZE, SYMBOLS } from './constants.js';

export class GameState {
  constructor() {
    this.board = [];
    this.currentPlayer = SYMBOLS[0];
    this.isActive = true;
    this.mode = 'pvp';
    this.difficulty = 'facil';
    this.scores = { X: 0, O: 0, Y: 0 };
    this.statistics = { total: 0, draws: 0 };
    this.moveHistory = [];
    this.boardSnapshots = [];
    this.reset();
  }

  reset() {
    this.board = new Array(BOARD_SIZE).fill('');
    this.currentPlayer = SYMBOLS[0];
    this.isActive = true;
    this.moveHistory = [];
    this.boardSnapshots = [];
  }

  makeMove(index) {
    if (!this.isActive) return false;
    if (index < 0 || index >= BOARD_SIZE) return false;
    if (this.board[index] !== '') return false;

    this.boardSnapshots.push({
      board: [...this.board],
      player: this.currentPlayer,
    });

    this.board[index] = this.currentPlayer;
    this.moveHistory.push({ index, player: this.currentPlayer });
    return true;
  }

  undoLastMove() {
    if (this.boardSnapshots.length === 0) return false;

    const snapshot = this.boardSnapshots.pop();
    this.board = snapshot.board;
    this.currentPlayer = snapshot.player;
    this.moveHistory.pop();
    this.isActive = true;
    return true;
  }

  switchPlayer() {
    if (this.mode === 'pvp3') {
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
