console.log('[constants.js] Carregado');
export const SYMBOLS = ['X', 'O', 'Y'];

export const GAME_MODES = {
  PVP: 'pvp',
  PVE: 'pve',
  PVP3: 'pvp3',
};

export const DIFFICULTIES = {
  EASY: 'facil',
  MEDIUM: 'medio',
  HARD: 'dificil',
};

export const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export const BOARD_SIZE = 9;
export const BOARD_DIMENSION = 3;
export const COUNTDOWN_SECONDS = 10;
export const AI_DELAY_MS = 500;

console.log('[TEST] constants.js loaded'); // test: no-console-log rule

export const CSS_CLASSES = {
  WINNER: 'vencedor',
  POP: 'pop',
  DRAW: 'draw-cell',
  DISABLED: 'disabled',
  LIGHT_MODE: 'light-mode',
};
