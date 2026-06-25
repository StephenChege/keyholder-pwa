// src/utils/audio.js
export default class ProximityTone {
  constructor() {
    this.audioContext = null;
    this.oscillator = null;
    this.gainNode = null;
    this.isPlaying = false;
  }

  initAudio() {
    if (this.audioContext) return;
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
  }

  play(frequency, volume) {
    this.initAudio();

    if (!this.isPlaying) {
      this.oscillator = this.audioContext.createOscillator();
      this.oscillator.type = 'sine';
      this.oscillator.connect(this.gainNode);
      this.oscillator.start();
      this.isPlaying = true;
    }

    // Update frequency and volume smoothly
    const now = this.audioContext.currentTime;
    this.oscillator.frequency.setTargetAtTime(frequency, now, 0.02);
    this.gainNode.gain.setTargetAtTime(Math.min(volume, 0.3), now, 0.05); // Cap at 0.3 for safety
  }

  stop() {
    if (this.isPlaying && this.oscillator) {
      const now = this.audioContext.currentTime;
      this.gainNode.gain.setTargetAtTime(0, now, 0.1);
      setTimeout(() => {
        this.oscillator.stop();
        this.isPlaying = false;
      }, 100);
    }
  }
}
