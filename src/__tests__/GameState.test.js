console.log('[GameState.test.js] Carregado');
import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../game/GameState.js';

describe('GameState', () => {
  var state;

  beforeEach(() => {
    console.log('[GameState.test.js] beforeEach: criando novo GameState');
    state = new GameState();
  });

  it('should initialize with empty board', () => {
    console.log('[GameState.test.js] Teste: inicializacao');
    expect(state.board).toHaveLength(9);
    expect(state.board.every(c => c === '')).toBe(true);
    console.log('[GameState.test.js] Board inicializado com', state.board.length, 'celulas vazias');
  });

  it('should start with player X', () => {
    console.log('[GameState.test.js] Teste: jogador inicial');
    expect(state.currentPlayer).toBe('X');
    console.log('[GameState.test.js] Jogador inicial:', state.currentPlayer);
  });

  it('should be active on start', () => {
    console.log('[GameState.test.js] Teste: estado ativo');
    expect(state.isActive).toBe(true);
  });

  it('should make a move and update board', () => {
    console.log('[GameState.test.js] Teste: fazer jogada');
    var result = state.makeMove(0);
    console.log('[GameState.test.js] Resultado da jogada:', result);
    expect(result).toBe(true);
    expect(state.board[0]).toBe('X');
  });

  it('should not allow move on occupied cell', () => {
    console.log('[GameState.test.js] Teste: celula ocupada');
    state.makeMove(0);
    var result = state.makeMove(0);
    console.log('[GameState.test.js] Tentativa em celula ocupada:', result);
    expect(result).toBe(false);
  });

  it('should not allow move out of bounds', () => {
    console.log('[GameState.test.js] Teste: indice invalido');
    var r1 = state.makeMove(-1);
    var r2 = state.makeMove(9);
    console.log('[GameState.test.js] makeMove(-1):', r1, 'makeMove(9):', r2);
    expect(r1).toBe(false);
    expect(r2).toBe(false);
  });

  it('should not allow move when inactive', () => {
    console.log('[GameState.test.js] Teste: jogo inativo');
    state.isActive = false;
    expect(state.makeMove(0)).toBe(false);
  });

  it('should switch player to O after switchPlayer', () => {
    console.log('[GameState.test.js] Teste: trocar para O');
    state.makeMove(0);
    state.switchPlayer();
    console.log('[GameState.test.js] Jogador apos troca:', state.currentPlayer);
    expect(state.currentPlayer).toBe('O');
  });

  it('should switch back to X after two switches', () => {
    console.log('[GameState.test.js] Teste: voltar para X');
    state.makeMove(0);
    state.switchPlayer();
    state.switchPlayer();
    console.log('[GameState.test.js] Jogador apos 2 trocas:', state.currentPlayer);
    expect(state.currentPlayer).toBe('X');
  });

  it('should cycle through 3 players in pvp3 mode', () => {
    console.log('[GameState.test.js] Teste: 3 jogadores');
    state.mode = 'pvp3';
    expect(state.currentPlayer).toBe('X');
    state.switchPlayer();
    console.log('[GameState.test.js] Apos 1 troca:', state.currentPlayer);
    expect(state.currentPlayer).toBe('O');
    state.switchPlayer();
    console.log('[GameState.test.js] Apos 2 trocas:', state.currentPlayer);
    expect(state.currentPlayer).toBe('Y');
    state.switchPlayer();
    console.log('[GameState.test.js] Apos 3 trocas:', state.currentPlayer);
    expect(state.currentPlayer).toBe('X');
  });

  it('should undo last move', () => {
    console.log('[GameState.test.js] Teste: desfazer jogada');
    state.makeMove(0);
    state.switchPlayer();
    state.makeMove(1);
    console.log('[GameState.test.js] Board antes do undo:', state.board);
    expect(state.board[1]).toBe('O');
    state.undoLastMove();
    console.log('[GameState.test.js] Board apos undo:', state.board);
    expect(state.board[1]).toBe('');
    expect(state.currentPlayer).toBe('O');
  });

  it('should return false on undo with no history', () => {
    console.log('[GameState.test.js] Teste: undo sem historico');
    var result = state.undoLastMove();
    console.log('[GameState.test.js] Resultado do undo:', result);
    expect(result).toBe(false);
  });

  it('should reset game', () => {
    console.log('[GameState.test.js] Teste: reset');
    state.makeMove(0);
    state.makeMove(1);
    state.reset();
    console.log('[GameState.test.js] Board apos reset:', state.board);
    expect(state.board.every(c => c === '')).toBe(true);
    expect(state.currentPlayer).toBe('X');
    expect(state.isActive).toBe(true);
    expect(state.moveHistory).toHaveLength(0);
    expect(state.boardSnapshots).toHaveLength(0);
  });

  it('should increment score', () => {
    console.log('[GameState.test.js] Teste: incrementar score');
    state.incrementScore('X');
    console.log('[GameState.test.js] Score X:', state.scores.X, 'Total:', state.statistics.total);
    expect(state.scores.X).toBe(1);
    expect(state.statistics.total).toBe(1);
  });

  it('should increment draws', () => {
    console.log('[GameState.test.js] Teste: incrementar empates');
    state.incrementDraws();
    console.log('[GameState.test.js] Empates:', state.statistics.draws, 'Total:', state.statistics.total);
    expect(state.statistics.draws).toBe(1);
    expect(state.statistics.total).toBe(1);
  });

  it('should reset scores', () => {
    console.log('[GameState.test.js] Teste: resetar scores');
    state.incrementScore('X');
    state.incrementScore('O');
    state.incrementDraws();
    state.resetScores();
    console.log('[GameState.test.js] Scores apos reset:', state.scores);
    expect(state.scores).toEqual({ X: 0, O: 0, Y: 0 });
    expect(state.statistics).toEqual({ total: 0, draws: 0 });
  });
});
