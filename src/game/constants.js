console.log('[constants.js] Carregado');
console.log('[constants.js] Definindo simbolos, modos e dificuldades');
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

console.log('[constants.js] Definindo combinacoes vencedoras');
export var WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export var BOARD_SIZE = 9;
export var BOARD_DIMENSION = 3;
export var COUNTDOWN_SECONDS = 10;
export var AI_DELAY_MS = 500;

console.log('[constants.js] Inicializando constantes');
console.log('[constants.js] BOARD_SIZE:', BOARD_SIZE, 'COUNTDOWN:', COUNTDOWN_SECONDS);
export var CSS_CLASSES = {
  WINNER: 'vencedor',
  POP: 'pop',
  DRAW: 'draw-cell',
  DISABLED: 'disabled',
  LIGHT_MODE: 'light-mode',
};
