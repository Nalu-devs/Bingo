console.log('[ScoreManager.test.js] Carregado');
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ScoreManager } from '../core/ScoreManager.js';

describe('ScoreManager', () => {
  let manager;

  beforeEach(() => {
    console.log('[ScoreManager.test.js] beforeEach: limpando localStorage');
    localStorage.clear();
    manager = new ScoreManager();
  });

  it('should initialize with default scores', () => {
    console.log('[ScoreManager.test.js] Teste: valores padrao');
    const velha = manager.get('velha');
    console.log('[ScoreManager.test.js] Scores velha:', JSON.stringify(velha));
    expect(velha).toEqual({ X: 0, O: 0, Y: 0, draws: 0 });
  });

  it('should update game scores', () => {
    console.log('[ScoreManager.test.js] Teste: atualizar scores');
    manager.update('velha', { X: 3, O: 2 });
    const velha = manager.get('velha');
    console.log('[ScoreManager.test.js] Scores apos update:', JSON.stringify(velha));
    expect(velha.X).toBe(3);
    expect(velha.O).toBe(2);
  });

  it('should persist to localStorage', () => {
    console.log('[ScoreManager.test.js] Teste: persistencia');
    manager.update('forca', { wins: 5 });
    const raw = JSON.parse(localStorage.getItem('arcadehub_scores'));
    console.log('[ScoreManager.test.js] Dados no localStorage:', JSON.stringify(raw));
    expect(raw.forca.wins).toBe(5);
  });

  it('should load from localStorage', () => {
    console.log('[ScoreManager.test.js] Teste: carregar do localStorage');
    const data = { forca: { wins: 3, losses: 1 } };
    localStorage.setItem('arcadehub_scores', JSON.stringify(data));
    const loaded = new ScoreManager();
    console.log('[ScoreManager.test.js] Dados carregados:', JSON.stringify(loaded.get('forca')));
    expect(loaded.get('forca').wins).toBe(3);
  });

  it('should handle corrupted localStorage', () => {
    console.log('[ScoreManager.test.js] Teste: localStorage corrompido');
    localStorage.setItem('arcadehub_scores', 'invalid json');
    const safe = new ScoreManager();
    console.log('[ScoreManager.test.js] Manager apos corrupcao:', JSON.stringify(safe.get('velha')));
    expect(safe.get('velha')).toBeDefined();
  });

  it('should reset individual game', () => {
    console.log('[ScoreManager.test.js] Teste: reset individual');
    manager.update('jokenpo', { wins: 10 });
    manager.reset('jokenpo');
    console.log('[ScoreManager.test.js] Scores apos reset:', JSON.stringify(manager.get('jokenpo')));
    expect(manager.get('jokenpo').wins).toBe(0);
  });

  it('should reset all games', () => {
    console.log('[ScoreManager.test.js] Teste: reset total');
    manager.update('velha', { X: 5 });
    manager.update('forca', { wins: 3 });
    manager.resetAll();
    console.log('[ScoreManager.test.js] Velha apos reset:', JSON.stringify(manager.get('velha')));
    console.log('[ScoreManager.test.js] Forca apos reset:', JSON.stringify(manager.get('forca')));
    expect(manager.get('velha').X).toBe(0);
    expect(manager.get('forca').wins).toBe(0);
  });

  it('should return all data', () => {
    console.log('[ScoreManager.test.js] Teste: getAll');
    manager.update('memoria', { wins: 1, bestScore: 10 });
    const all = manager.getAll();
    console.log('[ScoreManager.test.js] Todos os dados:', JSON.stringify(all));
    expect(all.memoria.wins).toBe(1);
    expect(all.memoria.bestScore).toBe(10);
  });

  it('should return default for unknown game', () => {
    console.log('[ScoreManager.test.js] Teste: jogo desconhecido');
    const unknown = manager.get('unknown');
    console.log('[ScoreManager.test.js] Jogo desconhecido:', JSON.stringify(unknown));
    expect(unknown).toBeDefined();
  });
});
