import './styles/main.css';
import { Router, ScoreManager } from './core/index.js';
import { HomePage } from './games/home/HomePage.js';
import { VelhaGame } from './games/velha/VelhaGame.js';
import { ForcaGame } from './games/forca/ForcaGame.js';
import { JokenpoGame } from './games/jokenpo/JokenpoGame.js';
import { MemoriaGame } from './games/memoria/MemoriaGame.js';
import { StatsPage } from './games/stats/StatsPage.js';
const content = document.getElementById('content');
const scoreManager = new ScoreManager();

let currentPage = null;
function mountPage(page) {
  if (currentPage && currentPage.onLeave) {
    currentPage.onLeave();
  }
  currentPage = page;
  page.mount();
  document.getElementById('sidebar').classList.add('hidden');
  document.getElementById('sidebar-overlay').classList.add('hidden');
}
const router = new Router([
  { path: '/', handler: () => mountPage(new HomePage(content, scoreManager)) },
  { path: '/velha', handler: () => mountPage(new VelhaGame(content, scoreManager)) },
  { path: '/forca', handler: () => mountPage(new ForcaGame(content, scoreManager)) },
  { path: '/jokenpo', handler: () => mountPage(new JokenpoGame(content, scoreManager)) },
  { path: '/memoria', handler: () => mountPage(new MemoriaGame(content, scoreManager)) },
  { path: '/stats', handler: () => mountPage(new StatsPage(content, scoreManager)) },
]);

document.getElementById('menuBtn').addEventListener('click', () => {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.toggle('hidden');
  overlay.classList.toggle('hidden');
});



document.getElementById('sidebar-overlay').addEventListener('click', () => {
  document.getElementById('sidebar').classList.add('hidden');
  document.getElementById('sidebar-overlay').classList.add('hidden');
});

document.querySelectorAll('[data-nav]').forEach(el => {
  el.addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('hidden');
    document.getElementById('sidebar-overlay').classList.add('hidden');
  });
});

document.getElementById('soundToggle').addEventListener('click', () => {
  const btn = document.getElementById('soundToggle');
  const isMuted = btn.dataset.muted === 'true';
  btn.dataset.muted = String(!isMuted);
  btn.textContent = isMuted ? '🔊' : '🔇';
});

document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const btn = document.getElementById('themeToggle');
  btn.textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
});

router.start();
