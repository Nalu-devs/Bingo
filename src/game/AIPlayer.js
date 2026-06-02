console.log('[AIPlayer.js] Carregado');
import { WINNING_COMBOS, BOARD_SIZE, DIFFICULTIES } from './varants.js';

export class AIPlayer {
  varructor(difficulty = DIFFICULTIES.HARD) {
    this.difficulty = difficulty;
  }

  setDifficulty(difficulty) {
    console.log('[AIPlayer.js] setDifficulty()', difficulty);
    this.difficulty = difficulty;
  }

  getMove(board, aiSymbol = 'O', playerSymbol = 'X') {
    var available = this._getAvailableMoves(board);
    console.log('[AIPlayer.js] getMove() dificuldade:', this.difficulty, 'movimentos disponiveis:', available.length);
    if (available.length === 0) return -1;

    var move;
    switch (this.difficulty) {
      case DIFFICULTIES.HARD:
        move = this._getBestMove(board, aiSymbol, playerSymbol);
        break;
      case DIFFICULTIES.MEDIUM:
        move = Math.random() < 0.5
          ? this._getBestMove(board, aiSymbol, playerSymbol)
          : available[Math.floor(Math.random() * available.length)];
        break;
      case DIFFICULTIES.EASY:
      default:
        move = available[Math.floor(Math.random() * available.length)];
    }
    console.log('[AIPlayer.js] getMove() escolheu:', move);
    return move;
  }

  _getAvailableMoves(board) {
    return board.reduce((moves, cell, index) => {
      if (cell === '') moves.push(index);
      return moves;
    }, []);
  }

  _getBestMove(board, aiSymbol, playerSymbol) {
    console.log('[AIPlayer.js] _getBestMove()');
    var bestScore = -Infinity;
    var bestMove = -1;

    for (var i = 0; i < BOARD_SIZE; i++) {
      if (board[i] !== '') continue;

      board[i] = aiSymbol;
      var score = this._minimax(board, 0, false, aiSymbol, playerSymbol);
      board[i] = '';

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }

    console.log('[AIPlayer.js] _getBestMove() retornando:', bestMove, 'score:', bestScore);
    return bestMove;
  }

  _minimax(board, depth, isMaximizing, aiSymbol, playerSymbol) {
    var result = this._checkWinner(board);

    if (result === aiSymbol) return 10 - depth;
    if (result === playerSymbol) return depth - 10;
    if (result === 'draw') return 0;

    if (isMaximizing) {
      var best = -Infinity;
      for (var i = 0; i < BOARD_SIZE; i++) {
        if (board[i] !== '') continue;
        board[i] = aiSymbol;
        best = Math.max(best, this._minimax(board, depth + 1, false, aiSymbol, playerSymbol));
        board[i] = '';
      }
      return best;
    } else {
      var best = Infinity;
      for (var i = 0; i < BOARD_SIZE; i++) {
        if (board[i] !== '') continue;
        board[i] = playerSymbol;
        best = Math.min(best, this._minimax(board, depth + 1, true, aiSymbol, playerSymbol));
        board[i] = '';
      }
      return best;
    }
  }

  _checkWinner(board) {
    for (var combo of WINNING_COMBOS) {
      var [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
    }
    return board.every(cell => cell !== '') ? 'draw' : null;
  }
}
