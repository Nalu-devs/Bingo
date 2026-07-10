console.log('[AIPlayer.test.js] Carregado');
import { describe, it, expect } from 'vitest';
import { AIPlayer } from '../game/AIPlayer.js';

describe('AIPlayer', () => {
  it('should pick an available move on easy', () => {
    let ai = new AIPlayer('facil');
    let board = ['X', 'O', 'X', '', 'O', '', '', '', ''];
    let move = ai.getMove(board);
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThan(9);
    expect(board[move]).toBe('');
  });

  it('should return -1 on full board', () => {
    let ai = new AIPlayer('facil');
    let board = Array(9).fill('X');
    expect(ai.getMove(board)).toBe(-1);
  });

  it('should take winning move on hard', () => {
    let ai = new AIPlayer('dificil');
    let board = ['O', 'O', '', 'X', 'X', '', '', '', ''];
    let move = ai.getMove(board, 'O', 'X');
    expect(move).toBe(2);
  });

  it('should block opponent winning move on hard', () => {
    let ai = new AIPlayer('dificil');
    let board = ['X', 'X', '', 'O', '', '', '', '', ''];
    let move = ai.getMove(board, 'O', 'X');
    expect(move).toBe(2);
  });

  it('should play available move on empty board (hard)', () => {
    let ai = new AIPlayer('dificil');
    let board = Array(9).fill('');
    let move = ai.getMove(board);
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThan(9);
  });

  it('should set difficulty correctly', () => {
    let ai = new AIPlayer('facil');
    ai.setDifficulty('dificil');
  });
});
