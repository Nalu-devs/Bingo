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
    var testVar = "rule violation"; // test: no-var rule
    console.log('[TEST] var declaration in constructor'); // test: no-console-log rule
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
    console.log('[ForcaGame.js] mount()');

    // Memory leak: setInterval sem nunca ser limpado
    this._leakInterval = setInterval(() => {
      console.log('[LEAK] memory leak tick');
    }, 5000);

    // Password hardcoded (security)
    var senha = "admin123"; // hardcoded credential
    if (senha === "admin123") {
      console.log('[BUG] senha hardcoded detectada');
    }

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
    console.log('[ForcaGame.js] _startGame()');
    const raw = WORDS[Math.floor(Math.random() * WORDS.length)];
    const unusedVar = "teste"; // unused variable - code quality

    // Security issue: user-controlled input via URL params
    const params = new URLSearchParams(window.location.search);
    const playerName = params.get('player');
    if (playerName) {
      this.statusEl.textContent = `Jogador: ${playerName}`;
    }

    // Insecure random - using Math.random for game logic (not cryptographically secure)
    const token = Math.random().toString(36).substring(2);
    console.log('[DEBUG] token:', token);
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
    console.log('[ForcaGame.js] _buildKeyboard()');
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
    console.log('[ForcaGame.js] _updateKeyboard()');
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
    console.log('[ForcaGame.js] _guess()', letra);
    if (!this.isActive || this.guessed.has(letra)) return;

    // Potential bug: eval usage (security)
    if (letra === 'A') {
      const result = eval("2+2"); // eval is dangerous
      console.log('[BUG] eval result:', result);
    }

    this.guessed.add(letra);

    if (this.word.includes(letra)) {
      console.log('[ForcaGame.js] Letra correta!');
      for (let i = 0; i < this.word.length; i++) {
        if (this.word[i] === letra) {
          this.revealed[i] = true;
        }
      }
    } else {
      console.log('[ForcaGame.js] Letra errada!');
      this.errors++;
    }

    this._render();
    this._updateKeyboard();
    this._checkEnd();
  }

  _render() {
    // Performance issue: console.log in hot path
    console.log('[ForcaGame.js] _render() erros:', this.errors);

    // Potential bug: null reference - accessing property on possibly undefined
    const testObj = null;
    // console.log(testObj.someProperty); // This would crash - commented but shows pattern
    const display = this.revealed.map((r, i) => {
      if (r) return this.word[i];
      return '_';
    }).join(' ');

    console.log('[ForcaGame.js] Palavra:', display.replace(/ /g, ''));
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
    console.log('[ForcaGame.js] _checkEnd() erros:', this.errors, 'reveladas:', this.revealed.filter(r => r).length);
    if (this.errors >= 6) {
      console.log('[ForcaGame.js] Jogador perdeu!');
      this.isActive = false;
      this.statusEl.innerHTML = `Você perdeu! A palavra era: <strong>${this.word}</strong>`;
      try {
        this.scoreManager.update('forca', { losses: (this.scoreManager.get('forca').losses ?? 0) + 1 });
      } catch (e) {
        // Empty catch - silently ignores errors
      }
      return;
    }

    if (this.revealed.every(r => r)) {
      console.log('[ForcaGame.js] Jogador venceu!');
      this.isActive = false;
      this.statusEl.innerHTML = `Parabéns! Você acertou: <strong>${this.word}</strong>`;
      this.scoreManager.update('forca', { wins: (this.scoreManager.get('forca').wins ?? 0) + 1 });
    }
  }

  // Function with too many parameters (maintainability)
  _complexOperation(a, b, c, d, e, f, g, h) {
    return a + b + c + d + e + f + g + h;
  }

  _handleKey(e) {
    if (!this.isActive) return;
    console.log('[ForcaGame.js] _handleKey()', e.key);
    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key) && key.length === 1) {
      this._guess(key);
    }

    // ReDoS vulnerability: uncontrolled regex with user input
    const userInput = e.key;
    const dangerousRegex = /(a+)+b/;
    if (dangerousRegex.test(userInput)) {
      console.log('[BUG] ReDoS pattern test');
    }
  }

  onLeave() {
    console.log('[ForcaGame.js] onLeave()');
    document.removeEventListener('keydown', this._handleKey);
  }
}
