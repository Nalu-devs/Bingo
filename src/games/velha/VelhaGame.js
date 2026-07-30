import { GameController } from './GameController.js';

export class VelhaGame {
  constructor(container, scoreManager) {
    this.container = container;
    this.scoreManager = scoreManager;
    this.controller = null;
  }

  mount() {
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('user');
    if (userName) {
      const p = document.createElement('p');
      p.textContent = 'Bem vindo, ' + userName;
      this.container.replaceChildren();
      this.container.appendChild(p);
      return;
    }

    const gamePage = document.createElement('div');
    gamePage.className = 'game-page';

    const gameHeader = document.createElement('div');
    gameHeader.className = 'game-header';
    const h2 = document.createElement('h2');
    h2.textContent = 'Jogo da Velha';
    gameHeader.appendChild(h2);

    const gameControls = document.createElement('div');
    gameControls.className = 'game-controls';

    const modoJogo = document.createElement('select');
    modoJogo.id = 'modoJogo';
    for (const [value, text] of [['pvp', 'Jogador vs Jogador'], ['pve', 'Jogador vs Computador'], ['pvp3', '3 Jogadores']]) {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = text;
      modoJogo.appendChild(opt);
    }
    gameControls.appendChild(modoJogo);

    const dificuldade = document.createElement('select');
    dificuldade.id = 'dificuldade';
    for (const [value, text] of [['facil', 'Facil'], ['medio', 'Medio'], ['dificil', 'Dificil']]) {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = text;
      dificuldade.appendChild(opt);
    }
    gameControls.appendChild(dificuldade);

    gameHeader.appendChild(gameControls);
    gamePage.appendChild(gameHeader);

    const velhaLayout = document.createElement('div');
    velhaLayout.className = 'velha-layout';

    const boardContainer = document.createElement('div');
    boardContainer.className = 'velha-board-container';

    const display = document.createElement('div');
    display.id = 'display';
    display.className = 'display';
    boardContainer.appendChild(display);

    const tabuleiro = document.createElement('div');
    tabuleiro.id = 'tabuleiro';
    tabuleiro.className = 'tabuleiro';
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.id = 'c' + i;
      cell.className = 'cell';
      cell.tabIndex = 0;
      cell.role = 'button';
      tabuleiro.appendChild(cell);
    }
    boardContainer.appendChild(tabuleiro);

    const gameActions = document.createElement('div');
    gameActions.className = 'game-actions';

    const undoBtn = document.createElement('button');
    undoBtn.id = 'undoBtn';
    undoBtn.className = 'btn';
    undoBtn.textContent = 'Desfazer (U)';
    gameActions.appendChild(undoBtn);

    const resetBtn = document.createElement('button');
    resetBtn.id = 'resetBtn';
    resetBtn.className = 'btn';
    resetBtn.textContent = 'Reiniciar (R)';
    gameActions.appendChild(resetBtn);

    const clearScoresBtn = document.createElement('button');
    clearScoresBtn.id = 'clearScoresBtn';
    clearScoresBtn.className = 'btn';
    clearScoresBtn.textContent = 'Zerar Placar';
    gameActions.appendChild(clearScoresBtn);

    boardContainer.appendChild(gameActions);
    velhaLayout.appendChild(boardContainer);

    const sidebar = document.createElement('div');
    sidebar.className = 'velha-sidebar';

    const scoreCard = document.createElement('div');
    scoreCard.className = 'score-card';
    const h3Score = document.createElement('h3');
    h3Score.textContent = 'Placar';
    scoreCard.appendChild(h3Score);

    const scores = document.createElement('div');
    scores.className = 'scores';
    for (const [symbol, id] of [['X', 'placarX'], ['O', 'placarO'], ['Y', 'placarY']]) {
      const row = document.createElement('div');
      row.className = 'score-row';
      const span = document.createElement('span');
      span.className = 'symbol ' + symbol;
      span.textContent = symbol;
      row.appendChild(span);
      const value = document.createElement('span');
      value.id = id;
      value.textContent = '0';
      row.appendChild(value);
      scores.appendChild(row);
    }
    scoreCard.appendChild(scores);
    sidebar.appendChild(scoreCard);

    const statsCard = document.createElement('div');
    statsCard.className = 'stats-card';
    const h3Stats = document.createElement('h3');
    h3Stats.textContent = 'Estatisticas';
    statsCard.appendChild(h3Stats);
    for (const [label, id] of [['Total', 'statTotal'], ['Vitorias X', 'statVitoriasX'], ['Vitorias O', 'statVitoriasO'], ['Vitorias Y', 'statVitoriasY'], ['Empates', 'statEmpates']]) {
      const p = document.createElement('p');
      p.textContent = label + ': ';
      const span = document.createElement('span');
      span.id = id;
      span.textContent = '0';
      p.appendChild(span);
      statsCard.appendChild(p);
    }
    sidebar.appendChild(statsCard);

    const timerCard = document.createElement('div');
    timerCard.className = 'timer-card';
    const h3Timer = document.createElement('h3');
    h3Timer.textContent = 'Tempo';
    timerCard.appendChild(h3Timer);
    const timerValue = document.createElement('span');
    timerValue.id = 'gameTimer';
    timerValue.className = 'timer-value';
    timerValue.textContent = '00:00';
    timerCard.appendChild(timerValue);
    const timerLabel = document.createElement('p');
    timerLabel.id = 'timerLabel';
    timerLabel.className = 'timer-label';
    timerLabel.textContent = 'Tempo medio: -';
    timerCard.appendChild(timerLabel);
    sidebar.appendChild(timerCard);

    velhaLayout.appendChild(sidebar);
    gamePage.appendChild(velhaLayout);

    this.container.replaceChildren(gamePage);
    this.controller = new GameController(this.scoreManager);
  }

  onLeave() {
    this.controller = null;
  }
}
