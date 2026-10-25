// audio.js - Web Audio sound effects synthesizer with voice limiting and mute control

export class SoundManager {
  constructor() {
    this.ctx = null;
    this.compressor = null;
    this.masterGain = null;
    this.noiseBuffer = null;
    this.activeVoices = 0;
    this.maxVoices = 8;

    // Load initial mute preference from localStorage
    this.isMuted = false;
    try {
      const stored = localStorage.getItem('ds-muted');
      if (stored !== null) {
        this.isMuted = stored === 'true';
      }
    } catch (err) {
      this.isMuted = false;
    }

    // Handle tab visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.ctx && this.ctx.state === 'running') {
          this.ctx.suspend().catch(() => {});
        }
      } else {
        if (this.ctx && this.ctx.state === 'suspended' && !this.isMuted) {
          this.ctx.resume().catch(() => {});
        }
      }
    });
  }

  /**
   * Initializes the AudioContext upon first user interaction.
   */
  initContext() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    // Compressor to prevent clipping on multiple bursts
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
    this.compressor.knee.setValueAtTime(12, this.ctx.currentTime);
    this.compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

    // Master gain
    this.masterGain = this.ctx.createGain();
    const initialVolume = this.isMuted ? 0 : 0.45;
    this.masterGain.gain.setValueAtTime(initialVolume, this.ctx.currentTime);

    this.compressor.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    // Pre-create 1-second static white noise buffer
    const bufferSize = this.ctx.sampleRate;
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }

  unlock() {
    this.initContext();
  }

  setMuted(muted) {
    this.isMuted = !!muted;
    try {
      localStorage.setItem('ds-muted', this.isMuted ? 'true' : 'false');
    } catch (err) {
      // Storage unavailable or disabled
    }

    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.45, now);
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  startVoice() {
    if (this.activeVoices >= this.maxVoices) return false;
    this.activeVoices++;
    return true;
  }

  endVoice() {
    this.activeVoices = Math.max(0, this.activeVoices - 1);
  }

  /**
   * Short, quiet rising whistle for rocket ascent.
   */
  playLaunch() {
    if (this.isMuted || !this.ctx) return;
    if (!this.startVoice()) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = 260 + Math.random() * 40;
    const endFreq = 680 + Math.random() * 80;
    const duration = 0.55;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

    // Soft rising and falling gain envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + duration * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.compressor);

    osc.start(now);
    osc.stop(now + duration);

    osc.onended = () => {
      this.endVoice();
      osc.disconnect();
      gain.disconnect();
    };
  }

  /**
   * Deep boom burst made from low-pass filtered noise and a sine thump.
   * @param {string} type - 'peony', 'ring', 'willow', 'crackle'
   */
  playBurst(type = 'peony') {
    if (this.isMuted || !this.ctx || !this.noiseBuffer) return;
    if (!this.startVoice()) return;

    const now = this.ctx.currentTime;
    const duration = type === 'willow' ? 0.7 : 0.45;
    const pitchShift = 0.9 + Math.random() * 0.2;
    const volumeMod = 0.85 + Math.random() * 0.3;

    // 1. Low sine thump
    const thump = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();
    thump.type = 'sine';
    const startPitch = (120 + Math.random() * 20) * pitchShift;
    thump.frequency.setValueAtTime(startPitch, now);
    thump.frequency.exponentialRampToValueAtTime(38, now + duration);

    thumpGain.gain.setValueAtTime(0.4 * volumeMod, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    thump.connect(thumpGain);
    thumpGain.connect(this.compressor);

    thump.start(now);
    thump.stop(now + duration);

    // 2. Filtered noise blast
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime((550 + Math.random() * 100) * pitchShift, now);
    filter.frequency.exponentialRampToValueAtTime(140, now + duration);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35 * volumeMod, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.compressor);

    noise.start(now);
    noise.stop(now + duration);

    let endedCount = 0;
    const cleanup = () => {
      endedCount++;
      if (endedCount === 2) {
        this.endVoice();
        thump.disconnect();
        thumpGain.disconnect();
        noise.disconnect();
        filter.disconnect();
        noiseGain.disconnect();
      }
    };

    thump.onended = cleanup;
    noise.onended = cleanup;
  }

  /**
   * Rapid tiny noise clicks spread over 0.5 to 0.8 seconds.
   */
  playCrackle() {
    if (this.isMuted || !this.ctx || !this.noiseBuffer) return;
    if (!this.startVoice()) return;

    const now = this.ctx.currentTime;
    const totalDuration = 0.65;
    const clickCount = 10;

    for (let i = 0; i < clickCount; i++) {
      const clickTime = now + (i / clickCount) * totalDuration + Math.random() * 0.04;
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200 + Math.random() * 1200, clickTime);
      filter.Q.setValueAtTime(3.0, clickTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12 + Math.random() * 0.08, clickTime);
      gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.035);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.compressor);

      noise.start(clickTime);
      noise.stop(clickTime + 0.04);
    }

    setTimeout(() => {
      this.endVoice();
    }, totalDuration * 1000 + 50);
  }

  /**
   * Soft shimmering crackle for sparks assembling into the name.
   */
  playNameArrival() {
    if (this.isMuted || !this.ctx) return;
    if (!this.startVoice()) return;

    const now = this.ctx.currentTime;
    const duration = 1.4;
    const pings = 8;

    for (let i = 0; i < pings; i++) {
      const pingTime = now + (i / pings) * duration + Math.random() * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400 + Math.random() * 1600, pingTime);

      gain.gain.setValueAtTime(0.02 + Math.random() * 0.02, pingTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, pingTime + 0.12);

      osc.connect(gain);
      gain.connect(this.compressor);

      osc.start(pingTime);
      osc.stop(pingTime + 0.13);
    }

    setTimeout(() => {
      this.endVoice();
    }, duration * 1000 + 150);
  }

  /**
   * Single temple bell ring (Web Audio: sine tones at ratios 1, 2.76, 5.4, 8.9 fading over 2.5s, quiet).
   */
  playTempleBell() {
    if (this.isMuted || !this.ctx) return;
    if (!this.startVoice()) return;

    const now = this.ctx.currentTime;
    const baseFreq = 480;
    const ratios = [1, 2.76, 5.4, 8.9];
    const duration = 2.5;
    const relativeGains = [0.12, 0.07, 0.035, 0.015];

    let activeCount = ratios.length;
    const onPartEnd = () => {
      activeCount--;
      if (activeCount === 0) {
        this.endVoice();
      }
    };

    for (let i = 0; i < ratios.length; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * ratios[i], now);

      const g0 = relativeGains[i];
      gain.gain.setValueAtTime(g0, now);
      const decayTime = duration / (1 + i * 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

      osc.connect(gain);
      gain.connect(this.compressor);

      osc.start(now);
      osc.stop(now + decayTime);

      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
        onPartEnd();
      };
    }
  }
}
