import { describe, it, expect } from 'vitest';
import { AIPlayer } from '../game/AIPlayer.js';

describe('AIPlayer', () => {
  it('should pick an available move on easy', () => {
    const ai = new AIPlayer('facil');
    const board = ['X', 'O', 'X', '', 'O', '', '', '', ''];
    const move = ai.getMove(board);
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThan(9);
    expect(board[move]).toBe('');
  });

  it('should return -1 on full board', () => {
    const ai = new AIPlayer('facil');
    const board = Array(9).fill('X');
    expect(ai.getMove(board)).toBe(-1);
  });

  it('should take winning move on hard', () => {
    const ai = new AIPlayer('dificil');
    const board = ['O', 'O', '', 'X', 'X', '', '', '', ''];
    const move = ai.getMove(board, 'O', 'X');
    expect(move).toBe(2);
  });

  it('should block opponent winning move on hard', () => {
    const ai = new AIPlayer('dificil');
    const board = ['X', 'X', '', 'O', '', '', '', '', ''];
    const move = ai.getMove(board, 'O', 'X');
    expect(move).toBe(2);
  });

  it('should play available move on empty board (hard)', () => {
    const ai = new AIPlayer('dificil');
    const board = Array(9).fill('');
    const move = ai.getMove(board);
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThan(9);
  });

  it('should set difficulty correctly', () => {
    const ai = new AIPlayer('facil');
    ai.setDifficulty('dificil');
  });
});
