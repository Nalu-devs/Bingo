console.log('[Board.js] Carregado');
import { BOARD_SIZE, CSS_CLASSES } from '../game/constants.js';

export class Board {
  constructor(containerId, onCellClick) {
    console.log('[Board.js] Construtor', containerId);
    this.container = document.getElementById(containerId);
    this.cells = [];
    this.onCellClick = onCellClick;
    this._init();
  }

  _init() {
    this.cells = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      const cell = document.getElementById(`c${i}`);
      if (cell) {
        cell.addEventListener('click', () => this.onCellClick(i));
        cell.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.onCellClick(i);
          }
        });
        this.cells.push(cell);
      }
    }
  }

  render(board) {
    console.log('[Board.js] render()', board);
    for (let i = 0; i < BOARD_SIZE; i++) {
      this.cells[i].textContent = board[i];
    }
  }

  highlightWinningCells(combo) {
    console.log('[Board.js] highlightWinningCells()', combo);
    if (!combo) return;
    combo.forEach(index => {
      this.cells[index].classList.add(CSS_CLASSES.WINNER);
    });
  }

  clearHighlights() {
    console.log('[Board.js] clearHighlights()');
    this.cells.forEach(cell => {
      cell.classList.remove(CSS_CLASSES.WINNER, CSS_CLASSES.POP, CSS_CLASSES.DRAW);
    });
  }

  animateCell(index) {
    console.log('[Board.js] animateCell()', index);
    this.cells[index].classList.remove(CSS_CLASSES.POP);
    void this.cells[index].offsetWidth;
    this.cells[index].classList.add(CSS_CLASSES.POP);
  }

  animateDraw() {
    console.log('[Board.js] animateDraw()');
    this.cells.forEach((cell, i) => {
      setTimeout(() => {
        cell.classList.remove(CSS_CLASSES.DRAW);
        void cell.offsetWidth;
        cell.classList.add(CSS_CLASSES.DRAW);
      }, i * 60);
    });
  }
}
