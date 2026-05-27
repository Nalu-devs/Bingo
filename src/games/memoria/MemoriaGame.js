console.log('[MemoriaGame.js] Carregado');
const EMOJIS = [
  '🍎', '🍊', '🍋', '🍇', '🍓', '🍒',
  '🍑', '🥝', '🍌', '🍉', '🍍', '🥭',
];

const GRID_SIZES = { facil: 12, medio: 16, dificil: 20 };

export class MemoriaGame {
  constructor(container, scoreManager) {
    this.container = container;
    this.scoreManager = scoreManager;
    this.cards = [];
    this.flipped = [];
    this.matched = 0;
    this.moves = 0;
    this.isLocked = false;
    this.isActive = false;
    this.timer = 0;
    this.timerInterval = null;
  }

  mount() {
    console.log('[MemoriaGame.js] mount()');
    this.container.innerHTML = `
      <div class="game-page">
        <div class="game-header">
          <h2>Jogo da Memoria</h2>
          <div class="game-controls">
            <select id="memoriaDifficulty">
              <option value="facil">Facil (6 pares)</option>
              <option value="medio" selected>Medio (8 pares)</option>
              <option value="dificil">Dificil (10 pares)</option>
            </select>
            <button id="memoriaNewGame" class="btn">Nova Partida</button>
          </div>
        </div>
        <div class="memoria-stats">
          <span>Movimentos: <strong id="memoriaMoves">0</strong></span>
          <span>Pares: <strong id="memoriaMatched">0</strong></span>
          <span>Tempo: <strong id="memoriaTimer">0s</strong></span>
        </div>
        <div id="memoriaGrid" class="memoria-grid"></div>
        <div id="memoriaStatus" class="memoria-status"></div>
      </div>
    `;

    this.gridEl = document.getElementById('memoriaGrid');
    this.movesEl = document.getElementById('memoriaMoves');
    this.matchedEl = document.getElementById('memoriaMatched');
    this.timerEl = document.getElementById('memoriaTimer');
    this.statusEl = document.getElementById('memoriaStatus');
    this.diffSelect = document.getElementById('memoriaDifficulty');
    this.newGameBtn = document.getElementById('memoriaNewGame');

    this.newGameBtn.addEventListener('click', () => this._startGame());
    this.diffSelect.addEventListener('change', () => this._startGame());

    this._startGame();
  }

  _startGame() {
    console.log('[MemoriaGame.js] _startGame()');
    this._stopTimer();
    const diff = this.diffSelect.value;
    const totalCards = GRID_SIZES[diff];
    const numPairs = totalCards / 2;
    const selected = EMOJIS.slice(0, numPairs);
    const deck = [...selected, ...selected];

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    this.cards = deck;
    this.flipped = [];
    this.matched = 0;
    this.moves = 0;
    this.isLocked = false;
    this.isActive = true;
    this.timer = 0;

    this.movesEl.textContent = '0';
    this.matchedEl.textContent = '0';
    this.timerEl.textContent = '0s';
    this.statusEl.textContent = '';

    this.gridEl.style.gridTemplateColumns = `repeat(${Math.min(5, Math.ceil(Math.sqrt(totalCards)))}, 1fr)`;
    this.gridEl.innerHTML = this.cards.map((emoji, i) => `
      <div class="memoria-card" data-index="${i}">
        <div class="memoria-card-inner">
          <div class="memoria-card-front">?</div>
          <div class="memoria-card-back">${emoji}</div>
        </div>
      </div>
    `).join('');

    this.gridEl.querySelectorAll('.memoria-card').forEach(card => {
      card.addEventListener('click', () => this._flipCard(card));
    });

    this._startTimer();
  }

  _flipCard(card) {
    if (!this.isActive || this.isLocked) return;
    const index = parseInt(card.dataset.index);
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (this.flipped.length >= 2) return;

    card.classList.add('flipped');
    this.flipped.push(index);
    console.log('[MemoriaGame.js] _flipCard()', index, 'viradas:', this.flipped.length);

    if (this.flipped.length === 2) {
      this.moves++;
      this.movesEl.textContent = this.moves;
      this._checkMatch();
    }
  }

  _checkMatch() {
    console.log('[MemoriaGame.js] _checkMatch()', this.flipped);
    this.isLocked = true;
    const [a, b] = this.flipped;

    if (this.cards[a] === this.cards[b]) {
      console.log('[MemoriaGame.js] Par encontrado!', this.cards[a]);
      this.matched++;
      this.matchedEl.textContent = this.matched;
      const cards = this.gridEl.querySelectorAll('.memoria-card');
      cards[a].classList.add('matched');
      cards[b].classList.add('matched');
      this.flipped = [];
      this.isLocked = false;

      if (this.matched === this.cards.length / 2) {
        console.log('[MemoriaGame.js] Todos os pares encontrados!');
        this._endGame(true);
      }
    } else {
      setTimeout(() => {
        const cards = this.gridEl.querySelectorAll('.memoria-card');
        cards[a].classList.remove('flipped');
        cards[b].classList.remove('flipped');
        this.flipped = [];
        this.isLocked = false;
      }, 800);
    }
  }

  _startTimer() {
    console.log('[MemoriaGame.js] _startTimer()');
    this._stopTimer();
    this.timerInterval = setInterval(() => {
      this.timer++;
      this.timerEl.textContent = `${this.timer}s`;
    }, 1000);
  }

  _stopTimer() {
    if (this.timerInterval) {
      console.log('[MemoriaGame.js] _stopTimer()');
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  _endGame(won) {
    console.log('[MemoriaGame.js] _endGame() venceu:', won);
    this.isActive = false;
    this._stopTimer();

    const saved = this.scoreManager.get('memoria');

    if (won) {
      const bestScore = saved.bestScore ?? Infinity;
      const isNewBest = this.moves < bestScore;

      this.scoreManager.update('memoria', {
        wins: (saved.wins ?? 0) + 1,
        bestScore: isNewBest ? this.moves : bestScore,
      });

      this.statusEl.innerHTML = `
        <span class="win">Parabens! Voce encontrou todos os pares em ${this.moves} movimentos (${this.timer}s)!</span>
        ${isNewBest ? '<span class="new-record">🎉 Novo recorde!</span>' : ''}
      `;
    } else {
      this.scoreManager.update('memoria', {
        losses: (saved.losses ?? 0) + 1,
      });
      this.statusEl.textContent = 'Fim de jogo!';
    }
  }

  onLeave() {
    console.log('[MemoriaGame.js] onLeave()');
    this._stopTimer();
    this.isActive = false;
  }
}
