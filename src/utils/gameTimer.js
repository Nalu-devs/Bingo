console.log('[gameTimer.js] Carregado');
export class GameTimer {
  constructor(onTick) {
    this.elapsed = 0;
    this.interval = null;
    this.onTick = onTick;
  }

  start() {
    this.elapsed = 0;
    this.interval = setInterval(() => {
      this.elapsed++;
      if (this.onTick) this.onTick(this.elapsed);
    }, 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  reset() {
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
