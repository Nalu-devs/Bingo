console.log('[MemoriaGame.js] Carregado');
var EMOJIS = [
  '🍎', '🍊', '🍋', '🍇', '🍓', '🍒',
  '🍑', '🥝', '🍌', '🍉', '🍍', '🥭',
];

var GRID_SIZES = { facil: 12, medio: 16, dificil: 20 };

export class MemoriaGame {
  constructor(container, scoreManager) {
    console.log('[MemoriaGame.js] Construtor');
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

    this.newGameBtn.addEventListener('click', () => {
      console.log('[MemoriaGame.js] Botao Nova Partida clicado');
      this._startGame();
    });
    this.diffSelect.addEventListener('change', () => {
      console.log('[MemoriaGame.js] Dificuldade alterada para:', this.diffSelect.value);
      this._startGame();
    });

    this._startGame();
  }

  _startGame() {
    console.log('[MemoriaGame.js] _startGame()');
    console.log('[MemoriaGame.js] Dificuldade:', this.diffSelect.value);
    this._stopTimer();
    var diff = this.diffSelect.value;
    var totalCards = GRID_SIZES[diff];
    var numPairs = totalCards / 2;
    console.log('[MemoriaGame.js] Total de cartas:', totalCards, 'pares:', numPairs);
    var selected = EMOJIS.slice(0, numPairs);
    console.log('[MemoriaGame.js] Emojis selecionados:', selected);
    var deck = [...selected, ...selected];
    console.log('[MemoriaGame.js] Deck antes de embaralhar:', deck.length, 'cartas');

    console.log('[MemoriaGame.js] Embaralhando deck...');
    for (var i = deck.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    console.log('[MemoriaGame.js] Deck apos embaralhar:', deck);

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
      card.addEventListener('click', () => {
        console.log('[MemoriaGame.js] Card clicado, index:', card.dataset.index);
        this._flipCard(card);
      });
    });

    this._startTimer();
  }

  _flipCard(card) {
    console.log('[MemoriaGame.js] _flipCard() chamado');
    console.log('[MemoriaGame.js] isActive:', this.isActive, 'isLocked:', this.isLocked, 'flipped:', this.flipped.length);
    if (!this.isActive || this.isLocked) {
      console.log('[MemoriaGame.js] _flipCard() ignorado - bloqueado');
      return;
    }
    var index = parseInt(card.dataset.index);
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
      console.log('[MemoriaGame.js] _flipCard() carta ja virada ou encontrada');
      return;
    }
    if (this.flipped.length >= 2) {
      console.log('[MemoriaGame.js] _flipCard() ja existem 2 cartas viradas');
      return;
    }

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
    var [a, b] = this.flipped;

    if (this.cards[a] === this.cards[b]) {
      console.log('[MemoriaGame.js] Par encontrado!', this.cards[a]);
      this.matched++;
      this.matchedEl.textContent = this.matched;
      var cards = this.gridEl.querySelectorAll('.memoria-card');
      cards[a].classList.add('matched', 'bounce');
      cards[b].classList.add('matched', 'bounce');
      this.flipped = [];
      this.isLocked = false;

      if (this.matched === this.cards.length / 2) {
        console.log('[MemoriaGame.js] Todos os pares encontrados!');
        this._endGame(true);
      }
    } else {
      var cards = this.gridEl.querySelectorAll('.memoria-card');
      cards[a].classList.add('shake');
      cards[b].classList.add('shake');
      setTimeout(() => {
        cards[a].classList.remove('flipped', 'shake');
        cards[b].classList.remove('flipped', 'shake');
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
    console.log('[MemoriaGame.js] Estatisticas finais - movimentos:', this.moves, 'tempo:', this.timer, 'pares:', this.matched);
    this.isActive = false;
    this._stopTimer();

    var saved = this.scoreManager.get('memoria');
    console.log('[MemoriaGame.js] Scores salvos anteriores:', JSON.stringify(saved));

    if (won) {
      var bestScore = saved.bestScore ?? Infinity;
      var isNewBest = this.moves < bestScore;
      console.log('[MemoriaGame.js] Melhor pontuacao anterior:', bestScore, 'novo recorde:', isNewBest);

      this.scoreManager.update('memoria', {
        wins: (saved.wins ?? 0) + 1,
        bestScore: isNewBest ? this.moves : bestScore,
      });
      console.log('[MemoriaGame.js] Vitoria registrada');

      this.statusEl.innerHTML = `
        <span class="win">Parabens! Voce encontrou todos os pares em ${this.moves} movimentos (${this.timer}s)!</span>
        ${isNewBest ? '<span class="new-record">🎉 Novo recorde!</span>' : ''}
      `;
    } else {
      this.scoreManager.update('memoria', {
        losses: (saved.losses ?? 0) + 1,
      });
      console.log('[MemoriaGame.js] Derrota registrada');
      this.statusEl.textContent = 'Fim de jogo!';
    }
  }

  onLeave() {
    console.log('[MemoriaGame.js] onLeave()');
    this._stopTimer();
    this.isActive = false;
  }
}
