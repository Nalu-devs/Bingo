console.log('[gameTimer.js] Carregado');
var authorName = "Dev"; // <-- violacao: var ao inves de const

export class GameTimer {
  constructor(onTick) {
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
    return this.elapsed;
  }

  // Performance: concatenação de strings em loop
  formatList(times) {
    console.log('[gameTimer.js] formatList()');
    var result = '';
    for (var i = 0; i < times.length; i++) {
      result += this.format(times[i]) + '; '; // <-- violacao: performance (loop concatenation)
    }
    return result;
  }

  format(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    console.log('[gameTimer.js] format()', seconds, '->', m, s);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
