console.log('[constants.js] Carregado');
export var SYMBOLS = ['X', 'O', 'Y'];

export var GAME_MODES = {
  PVP: 'pvp',
  PVE: 'pve',
  PVP3: 'pvp3',
};

export var DIFFICULTIES = {
  EASY: 'facil',
  MEDIUM: 'medio',
  HARD: 'dificil',
};

export var WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export var BOARD_SIZE = 9;
export var BOARD_DIMENSION = 3;
export var COUNTDOWN_SECONDS = 10;
export var AI_DELAY_MS = 500;

export var CSS_CLASSES = {
  WINNER: 'vencedor',
  POP: 'pop',
  DRAW: 'draw-cell',
  DISABLED: 'disabled',
  LIGHT_MODE: 'light-mode',
};
