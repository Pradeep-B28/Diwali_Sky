// sky.js - Canvas management, resize handling, bloom overlay, and scene coordination

import { SceneManager } from './scene.js';

export class SkyManager {
  constructor(skyCanvas, fireworksCanvas, bloomCanvas = null) {
    this.skyCanvas = skyCanvas;
    this.fireworksCanvas = fireworksCanvas;
    this.bloomCanvas = bloomCanvas;
    this.skyCtx = skyCanvas.getContext('2d');
    this.fireworksCtx = fireworksCanvas.getContext('2d');
    this.bloomCtx = bloomCanvas ? bloomCanvas.getContext('2d') : null;
    this.bloomEnabled = false;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.scene = new SceneManager(skyCanvas);

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.resize(), 100);
    });
  }

  setBloomEnabled(enabled) {
    this.bloomEnabled = !!enabled;
    if (this.bloomCanvas) {
      this.bloomCanvas.style.display = this.bloomEnabled ? 'block' : 'none';
      if (!this.bloomEnabled && this.bloomCtx) {
        this.bloomCtx.clearRect(0, 0, this.bloomCanvas.width, this.bloomCanvas.height);
      }
    }
  }

  setQualityTier(tier) {
    this.scene.setQualityTier(tier);
    this.setBloomEnabled(tier === 'high');
  }

  setReducedMotion(enabled) {
    this.scene.setReducedMotion(enabled);
  }

  addBurstLight(x, y, colorId) {
    this.scene.addBurstLight(x, y, colorId);
  }

  setCameraPush(showTime, focusX, focusY) {
    this.scene.setCameraPush(showTime, focusX, focusY);
  }

  updateBloom() {
    if (!this.bloomEnabled || !this.bloomCtx || !this.bloomCanvas) return;
    this.bloomCtx.clearRect(0, 0, this.bloomCanvas.width, this.bloomCanvas.height);
    this.bloomCtx.drawImage(
      this.fireworksCanvas,
      0, 0,
      this.bloomCanvas.width,
      this.bloomCanvas.height
    );
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    const physicalWidth = Math.floor(this.width * this.dpr);
    const physicalHeight = Math.floor(this.height * this.dpr);

    // Resize scene and its sky canvas
    this.scene.resize();

    // Resize fireworks canvas
    this.fireworksCanvas.width = physicalWidth;
    this.fireworksCanvas.height = physicalHeight;
    this.fireworksCanvas.style.width = `${this.width}px`;
    this.fireworksCanvas.style.height = `${this.height}px`;
    this.fireworksCtx.setTransform(1, 0, 0, 1, 0, 0);
    this.fireworksCtx.scale(this.dpr, this.dpr);

    // Resize bloom canvas at 1/4 resolution
    if (this.bloomCanvas && this.bloomCtx) {
      this.bloomCanvas.width = Math.max(1, Math.floor(physicalWidth / 4));
      this.bloomCanvas.height = Math.max(1, Math.floor(physicalHeight / 4));
      this.bloomCanvas.style.width = `${this.width}px`;
      this.bloomCanvas.style.height = `${this.height}px`;
    }
  }

  updateAndDraw(dt, isNameHoldActive = false, nameBounds = null) {
    this.scene.update(dt);
    this.scene.draw(isNameHoldActive, nameBounds);
  }
}
