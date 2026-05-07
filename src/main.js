import './styles/main.css';
import { GameController } from './game/GameController.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new GameController();

  const undoBtn = document.getElementById('undoBtn');
  const resetBtn = document.getElementById('resetBtn');
  const clearScoresBtn = document.getElementById('clearScoresBtn');

  if (undoBtn) undoBtn.addEventListener('click', () => game._undo());
  if (resetBtn) resetBtn.addEventListener('click', () => game._resetGame());
  if (clearScoresBtn) clearScoresBtn.addEventListener('click', () => game.resetScores());
});
