import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../game/GameState.js';

describe('GameState', () => {
  let state;

  beforeEach(() => {
    state = new GameState();
  });

  it('should initialize with empty board', () => {
    expect(state.board).toHaveLength(9);
    expect(state.board.every(c => c === '')).toBe(true);
  });

  it('should start with player X', () => {
    expect(state.currentPlayer).toBe('X');
  });

  it('should be active on start', () => {
    expect(state.isActive).toBe(true);
  });

  it('should make a move and update board', () => {
    const result = state.makeMove(0);
    expect(result).toBe(true);
    expect(state.board[0]).toBe('X');
  });

  it('should not allow move on occupied cell', () => {
    state.makeMove(0);
    const result = state.makeMove(0);
    expect(result).toBe(false);
  });

  it('should not allow move out of bounds', () => {
    expect(state.makeMove(-1)).toBe(false);
    expect(state.makeMove(9)).toBe(false);
  });

  it('should not allow move when inactive', () => {
    state.isActive = false;
    expect(state.makeMove(0)).toBe(false);
  });

  it('should switch player to O after switchPlayer', () => {
    state.makeMove(0);
    state.switchPlayer();
    expect(state.currentPlayer).toBe('O');
  });

  it('should switch back to X after two switches', () => {
    state.makeMove(0);
    state.switchPlayer();
    state.switchPlayer();
    expect(state.currentPlayer).toBe('X');
  });

  it('should cycle through 3 players in pvp3 mode', () => {
    state.mode = 'pvp3';
    expect(state.currentPlayer).toBe('X');
    state.switchPlayer();
    expect(state.currentPlayer).toBe('O');
    state.switchPlayer();
    expect(state.currentPlayer).toBe('Y');
    state.switchPlayer();
    expect(state.currentPlayer).toBe('X');
  });

  it('should undo last move', () => {
    state.makeMove(0);
    state.switchPlayer();
    state.makeMove(1);
    expect(state.board[1]).toBe('O');
    state.undoLastMove();
    expect(state.board[1]).toBe('');
    expect(state.currentPlayer).toBe('O');
  });

  it('should return false on undo with no history', () => {
    expect(state.undoLastMove()).toBe(false);
  });

  it('should reset game', () => {
    state.makeMove(0);
    state.makeMove(1);
    state.reset();
    expect(state.board.every(c => c === '')).toBe(true);
    expect(state.currentPlayer).toBe('X');
    expect(state.isActive).toBe(true);
    expect(state.moveHistory).toHaveLength(0);
    expect(state.boardSnapshots).toHaveLength(0);
  });

  it('should increment score', () => {
    state.incrementScore('X');
    expect(state.scores.X).toBe(1);
    expect(state.statistics.total).toBe(1);
  });

  it('should increment draws', () => {
    state.incrementDraws();
    expect(state.statistics.draws).toBe(1);
    expect(state.statistics.total).toBe(1);
  });

  it('should reset scores', () => {
    state.incrementScore('X');
    state.incrementScore('O');
    state.incrementDraws();
    state.resetScores();
    expect(state.scores).toEqual({ X: 0, O: 0, Y: 0 });
    expect(state.statistics).toEqual({ total: 0, draws: 0 });
  });
});
