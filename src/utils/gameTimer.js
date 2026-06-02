console.log('[gameTimer.js] Carregado');
var authorName = "Dev"; // <-- violacao: var ao inves de const

console.log('[TEST] before GameTimer class'); // test: no-console-log rule

export class GameTimer {
  constructor(onTick) {
    this.elapsed = 0;
    this.interval = null;
    this.onTick = onTick;
  }

  start() {
    var startTime = Date.now(); // test: no-var rule
    console.log('[TEST] var in start()'); // test: no-console-log rule
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
    return this.elapsed;
  }

  format(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
