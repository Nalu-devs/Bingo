console.log('[constants.js] Carregado');
export let SYMBOLS = ['X', 'O', 'Y'];

export let GAME_MODES = {
  PVP: 'pvp',
  PVE: 'pve',
  PVP3: 'pvp3',
};

export let DIFFICULTIES = {
  EASY: 'facil',
  MEDIUM: 'medio',
  HARD: 'dificil',
};

export let WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export let BOARD_SIZE = 9;
export let BOARD_DIMENSION = 3;
export let COUNTDOWN_SECONDS = 10;
export let AI_DELAY_MS = 500;

export let CSS_CLASSES = {
  WINNER: 'vencedor',
  POP: 'pop',
  DRAW: 'draw-cell',
  DISABLED: 'disabled',
  LIGHT_MODE: 'light-mode',
};
