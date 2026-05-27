console.log('[ThemeManager.js] Carregado');
import { CSS_CLASSES } from '../game/constants.js';

export class ThemeManager {
  constructor() {
    this.isLightMode = false;
    this.button = document.getElementById('themeToggle');
    if (this.button) {
      this.button.addEventListener('click', () => this.toggle());
    }
  }

  toggle() {
    this.isLightMode = !this.isLightMode;
    document.body.classList.toggle(CSS_CLASSES.LIGHT_MODE, this.isLightMode);
  }

  get currentTheme() {
    return this.isLightMode ? 'light' : 'dark';
  }
}
