export class SoundManager {
  constructor() {
    this.enabled = true;
    this.audioContext = null;
    this._init();
  }

  _init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      console.warn('Web Audio API não suportada neste navegador.');
      this.enabled = false;
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  _ensureResumed() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  _playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.enabled || !this.audioContext) return;
    this._ensureResumed();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = type;
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  _playSequence(notes, volume = 0.3) {
    if (!this.enabled || !this.audioContext) return;
    this._ensureResumed();

    const now = this.audioContext.currentTime;

    notes.forEach(([frequency, startOffset, duration]) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      const startTime = now + startOffset;
      gainNode.gain.setValueAtTime(volume, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.frequency.setValueAtTime(frequency, startTime);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  }

  click() {
    this._playTone(440, 0.1, 'square', 0.15);
  }

  move() {
    this._playTone(660, 0.12, 'sine', 0.2);
  }

  win() {
    this._playSequence([
      [523, 0, 0.15],
      [659, 0.1, 0.15],
      [784, 0.2, 0.2],
    ], 0.3);
  }

  lose() {
    this._playSequence([
      [200, 0, 0.15],
      [150, 0.1, 0.15],
      [100, 0.2, 0.15],
    ], 0.25);
  }

  draw() {
    this._playSequence([
      [330, 0, 0.12],
      [330, 0.12, 0.12],
      [330, 0.24, 0.2],
    ], 0.2);
  }
}
