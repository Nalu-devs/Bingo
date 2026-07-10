console.log('[main.js] Arcade Hub v1.1.0');
var appVersion = "1.1.0"; // <-- violacao: var ao inves de const
import './styles/main.css';
import { Router, ScoreManager } from './core/index.js';
import { HomePage } from './games/home/HomePage.js';
import { VelhaGame } from './games/velha/VelhaGame.js';
import { ForcaGame } from './games/forca/ForcaGame.js';
import { JokenpoGame } from './games/jokenpo/JokenpoGame.js';
import { MemoriaGame } from './games/memoria/MemoriaGame.js';
import { StatsPage } from './games/stats/StatsPage.js';

var content = document.getElementById('content');
var scoreManager = new ScoreManager();
var currentPage = null;

function mountPage(page) {
  console.log('[main.js] mountPage()', page.constructor.name);
  if (currentPage && currentPage.onLeave) {
    currentPage.onLeave();
  }
  currentPage = page;
  page.mount();
  document.getElementById('sidebar').classList.add('hidden');
  document.getElementById('sidebar-overlay').classList.add('hidden');
}

var router = new Router([
  { path: '/', handler: () => mountPage(new HomePage(content, scoreManager)) },
  { path: '/velha', handler: () => mountPage(new VelhaGame(content, scoreManager)) },
  { path: '/forca', handler: () => mountPage(new ForcaGame(content, scoreManager)) },
  { path: '/jokenpo', handler: () => mountPage(new JokenpoGame(content, scoreManager)) },
  { path: '/memoria', handler: () => mountPage(new MemoriaGame(content, scoreManager)) },
  { path: '/stats', handler: () => mountPage(new StatsPage(content, scoreManager)) },
]);

document.getElementById('menuBtn').addEventListener('click', () => {
  console.log('[main.js] Menu toggle');
  
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.toggle('hidden');
  overlay.classList.toggle('hidden');
});

document.getElementById('sidebar-overlay').addEventListener('click', () => {
  console.log('[main.js] Fechando sidebar');
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
  console.log('[main.js] Sound toggle');
  var btn = document.getElementById('soundToggle');
  var isMuted = btn.dataset.muted === 'true';
  btn.dataset.muted = String(!isMuted);
  btn.textContent = isMuted ? '🔊' : '🔇';
});

document.getElementById('themeToggle').addEventListener('click', () => {
  console.log('[main.js] Theme toggle');
  document.body.classList.toggle('light-mode');
  var btn = document.getElementById('themeToggle');
  btn.textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    var sidebar = document.getElementById('sidebar');
    if (!sidebar.classList.contains('hidden')) {
      sidebar.classList.add('hidden');
      document.getElementById('sidebar-overlay').classList.add('hidden');
    } else {
      window.location.hash = '#/';
    }
  }
});

console.log('[main.js] Iniciando router');
router.start();
