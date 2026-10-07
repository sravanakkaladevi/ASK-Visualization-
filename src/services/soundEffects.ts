// Sound FX Synthesizer using Web Audio API

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.3; // 0 to 1

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted() {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume() {
    return this.volume;
  }

  /**
   * Play tone for a given frequency, duration, oscillator type, and envelope.
   */
  public playTone(
    freq: number,
    durationMs: number = 100,
    type: OscillatorType = 'sine',
    gainMultiplier: number = 1
  ) {
    if (this.isMuted || this.volume <= 0) return;

    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const now = ctx.currentTime;
      const attack = 0.01;
      const release = durationMs / 1000;
      const targetGain = this.volume * gainMultiplier * 0.5;

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(targetGain, now + attack);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + release);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + release);
    } catch {
      // Ignore audio context errors on user interaction boundaries
    }
  }

  /**
   * Play pitch based on element value relative to min and max range.
   */
  public playValueTone(value: number, minVal: number = 5, maxVal: number = 100, isSwap: boolean = false) {
    if (this.isMuted || this.volume <= 0) return;

    // Map value to pentatonic musical scale frequencies (C3 to C6)
    const minFreq = 180;
    const maxFreq = 880;
    const ratio = Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal || 1)));
    const freq = minFreq + ratio * (maxFreq - minFreq);

    if (isSwap) {
      // Dual pitch glide for swap action
      this.playTone(freq * 1.25, 120, 'triangle', 1.2);
      setTimeout(() => {
        this.playTone(freq, 100, 'sine', 1);
      }, 50);
    } else {
      this.playTone(freq, 90, 'sine', 0.8);
    }
  }

  /**
   * Play completion fanfare arpeggio chime!
   */
  public playCompletionFanfare() {
    if (this.isMuted || this.volume <= 0) return;

    // C Major Arpeggio: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 250, 'triangle', 1.2);
      }, index * 80);
    });
  }

  /**
   * Play click sound for simple UI interaction or step progression
   */
  public playStepClick() {
    if (this.isMuted || this.volume <= 0) return;
    this.playTone(440, 40, 'sine', 0.4);
  }
}

export const soundEffects = new SoundEffectsManager();
