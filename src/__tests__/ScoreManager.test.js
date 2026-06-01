console.log('[ScoreManager.test.js] Carregado');
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ScoreManager } from '../core/ScoreManager.js';

describe('ScoreManager', () => {
  let manager;

  beforeEach(() => {
    localStorage.clear();
    manager = new ScoreManager();
  });

  it('should initialize with default scores', () => {
    const velha = manager.get('velha');
    expect(velha).toEqual({ X: 0, O: 0, Y: 0, draws: 0 });
  });

  it('should update game scores', () => {
    manager.update('velha', { X: 3, O: 2 });
    const velha = manager.get('velha');
    expect(velha.X).toBe(3);
    expect(velha.O).toBe(2);
  });

  it('should persist to localStorage', () => {
    manager.update('forca', { wins: 5 });
    const raw = JSON.parse(localStorage.getItem('arcadehub_scores'));
    expect(raw.forca.wins).toBe(5);
  });

  it('should load from localStorage', () => {
    const data = { forca: { wins: 3, losses: 1 } };
    localStorage.setItem('arcadehub_scores', JSON.stringify(data));
    const loaded = new ScoreManager();
    expect(loaded.get('forca').wins).toBe(3);
  });

  it('should handle corrupted localStorage', () => {
    localStorage.setItem('arcadehub_scores', 'invalid json');
    const safe = new ScoreManager();
    expect(safe.get('velha')).toBeDefined();
  });

  it('should reset individual game', () => {
    manager.update('jokenpo', { wins: 10 });
    manager.reset('jokenpo');
    expect(manager.get('jokenpo').wins).toBe(0);
  });

  it('should reset all games', () => {
    manager.update('velha', { X: 5 });
    manager.update('forca', { wins: 3 });
    manager.resetAll();
    expect(manager.get('velha').X).toBe(0);
    expect(manager.get('forca').wins).toBe(0);
  });

  it('should return all data', () => {
    manager.update('memoria', { wins: 1, bestScore: 10 });
    const all = manager.getAll();
    expect(all.memoria.wins).toBe(1);
    expect(all.memoria.bestScore).toBe(10);
  });

  it('should return default for unknown game', () => {
    const unknown = manager.get('unknown');
    expect(unknown).toBeDefined();
  });
});
