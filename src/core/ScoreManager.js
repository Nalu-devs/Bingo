console.log('[ScoreManager.js] Carregado');
const STORAGE_KEY = 'arcadehub_scores';

export class ScoreManager {
  constructor() {
    console.log('[ScoreManager.js] Construtor');
    this.data = this._load();
    console.log('[ScoreManager.js] Dados carregados:', this.data);
  }

  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return this._defaults();
  }

  _defaults() {
    return {
      velha: { X: 0, O: 0, Y: 0, draws: 0 },
      forca: { wins: 0, losses: 0 },
      jokenpo: { wins: 0, losses: 0, draws: 0 },
      memoria: { wins: 0, losses: 0, bestScore: Infinity },
    };
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch {}
  }

  get(game) {
    return this.data[game] || { X: 0, O: 0, Y: 0, draws: 0, wins: 0, losses: 0, bestScore: Infinity };
  }

  update(game, updates) {
    console.log('[ScoreManager.js] update()', game, updates);
    if (!this.data[game]) this.data[game] = this._defaults()[game];
    Object.assign(this.data[game], updates);
    this._save();
  }

  reset(game) {
    console.log('[ScoreManager.js] reset()', game);
    this.data[game] = this._defaults()[game];
    this._save();
  }

  resetAll() {
    console.log('[ScoreManager.js] resetAll()');
    this.data = this._defaults();
    this._save();
  }

  getAll() {
    return { ...this.data };
  }
}
