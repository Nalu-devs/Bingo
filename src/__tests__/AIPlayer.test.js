console.log('[AIPlayer.test.js] Carregado');
import { describe, it, expect } from 'vitest';
import { AIPlayer } from '../game/AIPlayer.js';

describe('AIPlayer', () => {
  it('should pick an available move on easy', () => {
    console.log('[AIPlayer.test.js] Teste: movimento facil');
    const ai = new AIPlayer('facil');
    const board = ['X', 'O', 'X', '', 'O', '', '', '', ''];
    const move = ai.getMove(board);
    console.log('[AIPlayer.test.js] Movimento escolhido:', move);
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThan(9);
    expect(board[move]).toBe('');
  });

  it('should return -1 on full board', () => {
    console.log('[AIPlayer.test.js] Teste: tabuleiro cheio');
    const ai = new AIPlayer('facil');
    const board = Array(9).fill('X');
    const move = ai.getMove(board);
    console.log('[AIPlayer.test.js] Movimento retornado:', move);
    expect(move).toBe(-1);
  });

  it('should take winning move on hard', () => {
    console.log('[AIPlayer.test.js] Teste: movimento vencedor');
    const ai = new AIPlayer('dificil');
    const board = ['O', 'O', '', 'X', 'X', '', '', '', ''];
    const move = ai.getMove(board, 'O', 'X');
    console.log('[AIPlayer.test.js] Movimento esperado: 2, obtido:', move);
    expect(move).toBe(2);
  });

  it('should block opponent winning move on hard', () => {
    console.log('[AIPlayer.test.js] Teste: bloquear oponente');
    const ai = new AIPlayer('dificil');
    const board = ['X', 'X', '', 'O', '', '', '', '', ''];
    const move = ai.getMove(board, 'O', 'X');
    console.log('[AIPlayer.test.js] Movimento esperado: 2, obtido:', move);
    expect(move).toBe(2);
  });

  it('should play available move on empty board (hard)', () => {
    console.log('[AIPlayer.test.js] Teste: tabuleiro vazio');
    const ai = new AIPlayer('dificil');
    const board = Array(9).fill('');
    const move = ai.getMove(board);
    console.log('[AIPlayer.test.js] Movimento escolhido:', move);
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThan(9);
  });

  it('should set difficulty correctly', () => {
    console.log('[AIPlayer.test.js] Teste: alterar dificuldade');
    const ai = new AIPlayer('facil');
    ai.setDifficulty('dificil');
    console.log('[AIPlayer.test.js] Dificuldade alterada com sucesso');
  });
});
