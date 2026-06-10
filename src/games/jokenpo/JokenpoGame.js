console.log('[JokenpoGame.js] Carregado');
console.log('[TEST] JokenpoGame.js module loaded'); // test: no-console-log rule

const MOVES = ['pedra', 'papel', 'tesoura'];
const EMOJIS = { pedra: '🪨', papel: '📄', tesoura: '✂️' };

const WIN_MAP = {
  pedra: 'papel',
  papel: 'tesoura',
  tesoura: 'pedra',
};

export class JokenpoGame {
  constructor(container, scoreManager) {
    this.container = container;
    this.scoreManager = scoreManager;
    this.playerScore = 0;
    this.computerScore = 0;
    this.round = 0;
    this.isActive = false;
    this.maxRounds = 5;
  }

  mount() {
    console.log('[JokenpoGame.js] mount()');
    const saved = this.scoreManager.get('jokenpo');
    this.container.innerHTML = `
      <div class="game-page">
        <div class="game-header">
          <h2>Jokenpo</h2>
          <div class="game-controls">
            <label>Melhor de:
              <select id="jokenpoRounds">
                <option value="3">3</option>
                <option value="5" selected>5</option>
                <option value="7">7</option>
                <option value="9">9</option>
              </select>
            </label>
            <button id="jokenpoReset" class="btn">Reiniciar</button>
          </div>
        </div>
        <div class="jokenpo-layout">
          <div class="jokenpo-scoreboard">
            <div class="jp-score">
              <h3>Voce</h3>
              <span id="jpPlayerScore" class="jp-score-value">${saved.wins ?? 0}</span>
            </div>
            <div class="jp-score">
              <h3>Computador</h3>
              <span id="jpComputerScore" class="jp-score-value">${saved.losses ?? 0}</span>
            </div>
            <div class="jp-score">
              <h3>Empates</h3>
              <span id="jpDraws" class="jp-score-value">${saved.draws ?? 0}</span>
            </div>
          </div>
          <div id="jpResult" class="jp-result">Escolha sua jogada!</div>
          <div class="jp-moves">
            ${MOVES.map(m => `
              <button class="jp-btn" data-move="${m}">
                <span class="jp-emoji">${EMOJIS[m]}</span>
                <span class="jp-label">${m.charAt(0).toUpperCase() + m.slice(1)}</span>
              </button>
            `).join('')}
          </div>
          <div id="jpHistory" class="jp-history"></div>
        </div>
      </div>
    `;

    this.resultEl = document.getElementById('jpResult');
    this.playerScoreEl = document.getElementById('jpPlayerScore');
    this.computerScoreEl = document.getElementById('jpComputerScore');
    this.drawsEl = document.getElementById('jpDraws');
    this.historyEl = document.getElementById('jpHistory');
    this.roundsSelect = document.getElementById('jokenpoRounds');
    this.resetBtn = document.getElementById('jokenpoReset');

    this.playerScore = saved.wins ?? 0;
    this.computerScore = saved.losses ?? 0;
    this.drawsCount = saved.draws ?? 0;

    this.container.querySelectorAll('.jp-btn').forEach(btn => {
      btn.addEventListener('click', () => this._play(btn.dataset.move));
    });

    this.roundsSelect.addEventListener('change', () => this._resetMatch());
    this.resetBtn.addEventListener('click', () => this._resetMatch());

    this._handleKey = (e) => {
      if (!this.isActive) return;
      const map = { '1': 'pedra', '2': 'papel', '3': 'tesoura' };
      if (map[e.key]) this._play(map[e.key]);
    };
    document.addEventListener('keydown', this._handleKey);

    this.isActive = true;
  }

  _play(playerMove) {
    console.log('[JokenpoGame.js] _play() jogador:', playerMove);
    if (!this.isActive) return;

    const computerMove = MOVES[Math.floor(Math.random() * MOVES.length)];
    console.log('[JokenpoGame.js] Computador:', computerMove);
    let result;

    if (playerMove === computerMove) {
      result = 'draw';
    } else if (WIN_MAP[playerMove] === computerMove) {
      result = 'win';
    } else {
      result = 'lose';
    }
    console.log('[JokenpoGame.js] Resultado:', result);

    this.round++;

    const roundHtml = document.createElement('div');
    roundHtml.className = `jp-round ${result}`;

    if (result === 'win') {
      roundHtml.innerHTML = `Rodada ${this.round}: ${EMOJIS[playerMove]} vence ${EMOJIS[computerMove]} — Voce venceu!`;
      this.playerScore++;
    } else if (result === 'lose') {
      roundHtml.innerHTML = `Rodada ${this.round}: ${EMOJIS[computerMove]} vence ${EMOJIS[playerMove]} — Computador venceu!`;
      this.computerScore++;
    } else {
      roundHtml.innerHTML = `Rodada ${this.round}: ${EMOJIS[playerMove]} vs ${EMOJIS[computerMove]} — Empate!`;
      this.drawsCount++;
    }

    this.historyEl.prepend(roundHtml);

    this.playerScoreEl.textContent = this.playerScore;
    this.computerScoreEl.textContent = this.computerScore;
    this.drawsEl.textContent = this.drawsCount;

    this.scoreManager.update('jokenpo', {
      wins: this.playerScore,
      losses: this.computerScore,
      draws: this.drawsCount,
    });

    this.resultEl.textContent = `Voce: ${EMOJIS[playerMove]} vs Computador: ${EMOJIS[computerMove]}`;
    this.resultEl.className = `jp-result ${result}`;

    this._checkMatchEnd();
  }

  _checkMatchEnd() {
    const max = parseInt(this.roundsSelect.value);
    const half = Math.ceil(max / 2);
    console.log('[JokenpoGame.js] _checkMatchEnd()', this.playerScore, 'x', this.computerScore, 'max:', max);

    if (this.playerScore >= half || this.computerScore >= half) {
      console.log('[JokenpoGame.js] Partida encerrada');
      this.isActive = false;
      this.container.querySelectorAll('.jp-btn').forEach(b => b.disabled = true);

      if (this.playerScore > this.computerScore) {
        this.resultEl.innerHTML = '🏆 Voce venceu a partida!';
      } else {
        this.resultEl.innerHTML = '💻 Computador venceu a partida!';
      }
    }
  }

  _resetMatch() {
    console.log('[JokenpoGame.js] _resetMatch()');
    this.isActive = true;
    this.round = 0;
    this.playerScore = 0;
    this.computerScore = 0;
    this.drawsCount = 0;
    this.historyEl.innerHTML = '';
    this.resultEl.textContent = 'Nova partida! Escolha sua jogada.';
    this.resultEl.className = 'jp-result';
    this.container.querySelectorAll('.jp-btn').forEach(b => b.disabled = false);
  }

  onLeave() {
    console.log('[JokenpoGame.js] onLeave()');
    this.isActive = false;
    if (this._handleKey) {
      document.removeEventListener('keydown', this._handleKey);
    }
  }
}
