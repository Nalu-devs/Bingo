console.log('[AIPlayer.test.js] Carregado');
import { describe, it, expect } from 'vitest';
import { AIPlayer } from '../game/AIPlayer.js';

describe('AIPlayer', () => {
  it('should pick an available move on easy', () => {
    var ai = new AIPlayer('facil');
    var board = ['X', 'O', 'X', '', 'O', '', '', '', ''];
    var move = ai.getMove(board);
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThan(9);
    expect(board[move]).toBe('');
  });

  it('should return -1 on full board', () => {
    var ai = new AIPlayer('facil');
    var board = Array(9).fill('X');
    expect(ai.getMove(board)).toBe(-1);
  });

  it('should take winning move on hard', () => {
    var ai = new AIPlayer('dificil');
    var board = ['O', 'O', '', 'X', 'X', '', '', '', ''];
    var move = ai.getMove(board, 'O', 'X');
    expect(move).toBe(2);
  });

  it('should block opponent winning move on hard', () => {
    var ai = new AIPlayer('dificil');
    var board = ['X', 'X', '', 'O', '', '', '', '', ''];
    var move = ai.getMove(board, 'O', 'X');
    expect(move).toBe(2);
  });

  it('should play available move on empty board (hard)', () => {
    var ai = new AIPlayer('dificil');
    var board = Array(9).fill('');
    var move = ai.getMove(board);
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThan(9);
  });

  it('should set difficulty correctly', () => {
    var ai = new AIPlayer('facil');
    ai.setDifficulty('dificil');
  });
});
