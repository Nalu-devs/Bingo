console.log('[ForcaGame.js] Carregado');
const WORDS = [
  'ABACATE', 'BANANA', 'CAVALO', 'DINHEIRO', 'ELEFANTE',
  'FLORESTA', 'GIRAFa', 'HOSPITAL', 'IGREJA', 'JANELA',
  'LARANJA', 'MACACO', 'NAVIO', 'ONTEM', 'PAPAGAIO',
  'QUEIJO', 'ROBOT', 'SAPATO', 'TUCANO', 'UVA',
  'VENTO', 'WATTS', 'XICARA', 'ZEBRA', 'AMIGO',
  'BRASIL', 'CACHORRO', 'DOMINGO', 'ESCOLA', 'FELIZ',
];

const STAGES = [
  '',
  'O',
  'O\n|',
  'O\n/|',
  'O\n/|\\',
  'O\n/|\\\n/',
  'O\n/|\\\n/ \\',
];

export class ForcaGame {
  constructor(container, scoreManager) {
    this.container = container;
    this.scoreManager = scoreManager;
    this.word = '';
    this.guessed = [];
    this.errors = 0;
    this.revealed = [];
    this.isActive = false;
    this._handleKey = this._handleKey.bind(this);
  }

  mount() {
    this.container.innerHTML = `
      <div class="game-page">
        <div class="game-header">
          <h2>Jogo da Forca</h2>
          <button id="forcaNewGame" class="btn">Nova Partida</button>
        </div>
        <div class="forca-layout">
          <div class="forca-gallows">
            <pre id="forcaBoneco" class="forca-boneco">${STAGES[0]}</pre>
          </div>
          <div class="forca-main">
            <div id="forcaPalavra" class="forca-palavra"></div>
            <div id="forcaLetras" class="forca-letras"></div>
            <div id="forcaStatus" class="forca-status">Clique em "Nova Partida" para começar</div>
            <div class="forca-teclado" id="forcaTeclado"></div>
          </div>
        </div>
      </div>
    `;

    this.wordEl = document.getElementById('forcaPalavra');
    this.lettersEl = document.getElementById('forcaLetras');
    this.statusEl = document.getElementById('forcaStatus');
    this.bonecoEl = document.getElementById('forcaBoneco');
    this.tecladoEl = document.getElementById('forcaTeclado');

    document.getElementById('forcaNewGame').addEventListener('click', () => this._startGame());
    document.addEventListener('keydown', this._handleKey);

    this._buildKeyboard();
    this._startGame();
  }

  _startGame() {
    const raw = WORDS[Math.floor(Math.random() * WORDS.length)];
    this.word = raw.toUpperCase();
    this.guessed = new Set();
    this.errors = 0;
    this.isActive = true;
    this.revealed = this.word.split('').map(() => false);
    this._render();
    this._updateKeyboard();
    this.statusEl.textContent = 'Digite uma letra ou clique no teclado!';
  }

  _buildKeyboard() {
    this.tecladoEl.innerHTML = '';
    const linhas = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
    linhas.forEach(linha => {
      const div = document.createElement('div');
      div.className = 'teclado-linha';
      linha.split('').forEach(letra => {
        const btn = document.createElement('button');
        btn.className = 'tecla';
        btn.textContent = letra;
        btn.dataset.letra = letra;
        btn.addEventListener('click', () => this._guess(letra));
        div.appendChild(btn);
      });
      this.tecladoEl.appendChild(div);
    });
  }

  _updateKeyboard() {
    this.tecladoEl.querySelectorAll('.tecla').forEach(btn => {
      const letra = btn.dataset.letra;
      btn.classList.remove('correct', 'wrong');
      btn.disabled = false;
      if (this.guessed.has(letra)) {
        btn.disabled = true;
        if (this.word.includes(letra)) {
          btn.classList.add('correct');
        } else {
          btn.classList.add('wrong');
        }
      }
      if (!this.isActive) {
        btn.disabled = true;
      }
    });
  }

  _guess(letra) {
    if (!this.isActive || this.guessed.has(letra)) return;

    this.guessed.add(letra);

    if (this.word.includes(letra)) {
      for (let i = 0; i < this.word.length; i++) {
        if (this.word[i] === letra) {
          this.revealed[i] = true;
        }
      }
    } else {
      this.errors++;
    }

    this._render();
    this._updateKeyboard();
    this._checkEnd();
  }

  _render() {
    const display = this.revealed.map((r, i) => {
      if (r) return this.word[i];
      return '_';
    }).join(' ');

    this.wordEl.textContent = display;
    this.bonecoEl.textContent = STAGES[Math.min(this.errors, STAGES.length - 1)];

    const remaining = this.word.split('').filter((c, i) => !this.revealed[i]);
    const guessedWrong = [...this.guessed].filter(l => !this.word.includes(l));
    this.lettersEl.innerHTML = `
      <span class="hint">Restantes: ${remaining.length} letra(s)</span>
      <span class="wrong-letters">Erros (${this.errors}/6): ${guessedWrong.join(' ') || '-'}</span>
    `;
  }

  _checkEnd() {
    if (this.errors >= 6) {
      this.isActive = false;
      this.statusEl.innerHTML = `Você perdeu! A palavra era: <strong>${this.word}</strong>`;
      this.scoreManager.update('forca', { losses: (this.scoreManager.get('forca').losses ?? 0) + 1 });
      return;
    }

    if (this.revealed.every(r => r)) {
      this.isActive = false;
      this.statusEl.innerHTML = `Parabéns! Você acertou: <strong>${this.word}</strong>`;
      this.scoreManager.update('forca', { wins: (this.scoreManager.get('forca').wins ?? 0) + 1 });
    }
  }

  _handleKey(e) {
    if (!this.isActive) return;
    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key) && key.length === 1) {
      this._guess(key);
    }
  }

  onLeave() {
    document.removeEventListener('keydown', this._handleKey);
  }
}
