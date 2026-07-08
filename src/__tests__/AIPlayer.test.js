console.log('[AIPlayer.test.js] Carregado');
import { describe, it, expect } from 'vitest';
import { AIPlayer } from '../game/AIPlayer.js';

describe('AIPlayer', () => {
  it('should pick an available move on easy', () => {
    console.log('[AIPlayer.test.js] Teste: movimento facil');
    var ai = new AIPlayer('facil');
    var board = ['X', 'O', 'X', '', 'O', '', '', '', ''];
    var move = ai.getMove(board);
    console.log('[AIPlayer.test.js] Movimento escolhido:', move);
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThan(9);
    expect(board[move]).toBe('');
  });

  it('should return -1 on full board', () => {
    console.log('[AIPlayer.test.js] Teste: tabuleiro cheio');
    var ai = new AIPlayer('facil');
    var board = Array(9).fill('X');
    var move = ai.getMove(board);
    console.log('[AIPlayer.test.js] Movimento retornado:', move);
    expect(move).toBe(-1);
  });

  it('should take winning move on hard', () => {
    console.log('[AIPlayer.test.js] Teste: movimento vencedor');
    var ai = new AIPlayer('dificil');
    var board = ['O', 'O', '', 'X', 'X', '', '', '', ''];
    var move = ai.getMove(board, 'O', 'X');
    console.log('[AIPlayer.test.js] Movimento esperado: 2, obtido:', move);
    expect(move).toBe(2);
  });

  it('should block opponent winning move on hard', () => {
    console.log('[AIPlayer.test.js] Teste: bloquear oponente');
    var ai = new AIPlayer('dificil');
    var board = ['X', 'X', '', 'O', '', '', '', '', ''];
    var move = ai.getMove(board, 'O', 'X');
    console.log('[AIPlayer.test.js] Movimento esperado: 2, obtido:', move);
    expect(move).toBe(2);
  });

  it('should play available move on empty board (hard)', () => {
    console.log('[AIPlayer.test.js] Teste: tabuleiro vazio');
    var ai = new AIPlayer('dificil');
    var board = Array(9).fill('');
    var move = ai.getMove(board);
    console.log('[AIPlayer.test.js] Movimento escolhido:', move);
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThan(9);
  });

  it('should set difficulty correctly', () => {
    console.log('[AIPlayer.test.js] Teste: alterar dificuldade');
    var ai = new AIPlayer('facil');
    ai.setDifficulty('dificil');
    console.log('[AIPlayer.test.js] Dificuldade alterada com sucesso');
  });
});
