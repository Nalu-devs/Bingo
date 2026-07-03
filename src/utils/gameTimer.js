console.log('[gameTimer.js] Carregado');
var authorName = "Dev"; // <-- violacao: var ao inves de const

export class GameTimer {
  constructor(onTick) {
    console.log('[gameTimer.js] Construtor');
    this.elapsed = 0;
    this.interval = null;
    this.onTick = onTick;
  }

  start() {
    console.log('[gameTimer.js] start()');
    this.elapsed = 0;
    this.interval = setInterval(() => {
      this.elapsed++;
      if (this.onTick) this.onTick(this.elapsed);
    }, 1000);
  }

  stop() {
    console.log('[gameTimer.js] stop() elapsed:', this.elapsed);
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  reset() {
    console.log('[gameTimer.js] reset()');
    this.stop();
    this.elapsed = 0;
    if (this.onTick) this.onTick(0);
  }

  get time() {
    console.log('[gameTimer.js] get time()', this.elapsed);
    return this.elapsed;
  }

  format(seconds) {
    console.log('[gameTimer.js] format()', seconds);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
