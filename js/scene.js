// scene.js - Coordinates depth layers, parallax, camera push, and scene lighting

import {
  SCENE_COLORS,
  createFarCityCanvas,
  createMidGopuramCanvas,
  createFrontLedgeCanvas,
  createMistCanvases
} from './sceneLayers.js';

import {
  createStars,
  createMilkyWayStars,
  createDiyas,
  createLanternItem,
  createEmberItem,
  drawSkyAtmosphere,
  drawLanterns,
  drawBurstLighting,
  drawDiyas
} from './sceneRenderers.js';

export class SceneManager {
  constructor(skyCanvas) {
    this.canvas = skyCanvas;
    this.ctx = skyCanvas.getContext('2d');

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.qualityTier = 'high';
    this.isReducedMotion = false;
    this.time = 0;

    // Parallax (-1 to 1 normalized)
    this.targetShiftX = 0;
    this.currentShiftX = 0;
    this.autoDriftTimer = 0;

    // Camera push state (1.00 to 1.05 over 10s)
    this.cameraScale = 1.00;
    this.cameraFocusX = this.width * 0.5;
    this.cameraFocusY = this.height * 0.38;

    // Active burst lights (at most 6, fading over 0.6s)
    this.activeLights = [];

    // Scene elements
    this.stars = [];
    this.milkyWayStars = [];
    this.shootingStar = null;
    this.shootingStarTimer = 8;
    this.lanterns = [];
    this.diyas = [];
    this.embers = [];
    this.mistCanvases = [];
    this.mistOffsets = [0, 100, 240];

    // Offscreen layers
    this.farCity = null;
    this.midGopuram = null;
    this.frontLedge = null;
    this.cachedSkyCanvas = document.createElement('canvas');
    this.cachedSkyCtx = this.cachedSkyCanvas.getContext('2d');

    this.initEventListeners();
    this.resize();
  }

  setQualityTier(tier) {
    this.qualityTier = tier;
    this.initLanterns();
    this.initEmbers();
  }

  setReducedMotion(enabled) {
    this.isReducedMotion = enabled;
  }

  initEventListeners() {
    window.addEventListener('mousemove', (e) => {
      if (this.isReducedMotion || this.qualityTier === 'low') return;
      const norm = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetShiftX = Math.max(-1, Math.min(1, norm));
    });

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', (e) => {
        if (this.isReducedMotion || this.qualityTier === 'low') return;
        if (e.gamma !== null) {
          this.targetShiftX = Math.max(-1, Math.min(1, e.gamma / 30));
        }
      });
    }
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.stars = createStars(this.width, this.height);
    this.milkyWayStars = createMilkyWayStars(this.width, this.height);
    this.diyas = createDiyas(this.width, this.height);

    this.renderCachedSky();
    this.farCity = createFarCityCanvas(this.width, this.height, this.dpr);
    this.midGopuram = createMidGopuramCanvas(this.width, this.height, this.dpr);
    this.frontLedge = createFrontLedgeCanvas(this.width, this.height, this.dpr);
    this.mistCanvases = createMistCanvases(this.width, this.height);

    this.initLanterns();
    this.initEmbers();
  }

  renderCachedSky() {
    this.cachedSkyCanvas.width = Math.floor(this.width * this.dpr);
    this.cachedSkyCanvas.height = Math.floor(this.height * this.dpr);
    const ctx = this.cachedSkyCtx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(this.dpr, this.dpr);

    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, '#020617');
    grad.addColorStop(0.55, '#0F172A');
    grad.addColorStop(1, '#0F2431');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    const rad = Math.max(this.width * 0.75, 450);
    const hglow = ctx.createRadialGradient(
      this.width * 0.5, this.height + 20, 10,
      this.width * 0.5, this.height + 20, rad
    );
    hglow.addColorStop(0, 'rgba(16, 185, 129, 0.16)');
    hglow.addColorStop(0.5, 'rgba(16, 185, 129, 0.05)');
    hglow.addColorStop(1, 'rgba(16, 185, 129, 0)');
    ctx.fillStyle = hglow;
    ctx.fillRect(0, 0, this.width, this.height);

    // Pre-render static Milky Way cluster into cached background
    ctx.fillStyle = SCENE_COLORS.sparkMint;
    for (let i = 0; i < this.milkyWayStars.length; i++) {
      const s = this.milkyWayStars[i];
      ctx.globalAlpha = s.alpha;
      ctx.fillRect(s.x, s.y, s.r, s.r);
    }
    ctx.globalAlpha = 1.0;
  }

  initLanterns() {
    const limits = { high: 10, medium: 6, low: 3 };
    const maxCount = limits[this.qualityTier] || 6;
    this.lanterns = [];
    for (let i = 0; i < maxCount; i++) {
      this.lanterns.push(createLanternItem(this.width, this.height, this.isReducedMotion, true));
    }
  }

  initEmbers() {
    const limits = { high: 40, medium: 20, low: 0 };
    const maxCount = limits[this.qualityTier] || 20;
    this.embers = [];
    for (let i = 0; i < maxCount; i++) {
      this.embers.push(createEmberItem(this.diyas, true));
    }
  }

  addBurstLight(x, y, colorId) {
    if (this.qualityTier === 'low') return;
    this.activeLights.push({
      x,
      y,
      colorId: typeof colorId === 'number' ? colorId : 0,
      strength: 1.0,
      age: 0
    });
    if (this.activeLights.length > 6) {
      this.activeLights.shift();
    }
  }

  setCameraPush(showTime, focusX, focusY) {
    if (this.isReducedMotion || this.qualityTier === 'low') {
      this.cameraScale = 1.00;
      return;
    }
    const pushProg = Math.min(1.0, Math.max(0.0, showTime / 10.0));
    this.cameraScale = 1.00 + pushProg * 0.05;
    this.cameraFocusX = focusX || (this.width * 0.5);
    this.cameraFocusY = focusY || (this.height * 0.38);
  }

  update(dt) {
    this.time += dt;

    this.autoDriftTimer += dt * 0.4;
    const drift = Math.sin(this.autoDriftTimer) * 0.4;
    const target = this.targetShiftX !== 0 ? this.targetShiftX : drift;
    this.currentShiftX += (target - this.currentShiftX) * 0.08;

    for (let i = this.activeLights.length - 1; i >= 0; i--) {
      const l = this.activeLights[i];
      l.age += dt;
      l.strength = Math.max(0.0, 1.0 - (l.age / 0.6));
      if (l.strength <= 0) this.activeLights.splice(i, 1);
    }

    if (!this.isReducedMotion) {
      this.shootingStarTimer -= dt;
      if (this.shootingStarTimer <= 0 && !this.shootingStar) {
        this.shootingStarTimer = 10 + Math.random() * 8;
        this.shootingStar = {
          startX: this.width * (0.2 + Math.random() * 0.6),
          startY: this.height * (0.05 + Math.random() * 0.25),
          vx: 400 + Math.random() * 300,
          vy: 200 + Math.random() * 150,
          progress: 0,
          duration: 0.6
        };
      }
      if (this.shootingStar) {
        this.shootingStar.progress += dt / this.shootingStar.duration;
        if (this.shootingStar.progress >= 1.0) this.shootingStar = null;
      }
    }

    for (let m = 0; m < this.mistOffsets.length; m++) {
      this.mistOffsets[m] = (this.mistOffsets[m] + (6 + m * 2) * dt) % (this.width + 120);
    }

    for (let i = 0; i < this.lanterns.length; i++) {
      const l = this.lanterns[i];
      l.y -= l.speedY * dt;
      l.phase += l.swaySpeed * dt;
      if (l.y < -30) {
        this.lanterns[i] = createLanternItem(this.width, this.height, this.isReducedMotion, false);
      }
    }

    for (let i = 0; i < this.embers.length; i++) {
      const e = this.embers[i];
      if (!e) continue;
      e.life += dt;
      e.x += e.vx * dt;
      e.y += e.vy * dt;
      if (e.life >= e.maxLife) {
        this.embers[i] = createEmberItem(this.diyas, false);
      }
    }
  }

  draw(isNameHoldActive = false, nameBounds = null) {
    const ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(this.dpr, this.dpr);

    if (this.cameraScale > 1.0001) {
      ctx.translate(this.cameraFocusX, this.cameraFocusY);
      ctx.scale(this.cameraScale, this.cameraScale);
      ctx.translate(-this.cameraFocusX, -this.cameraFocusY);
    }

    // 1. Sky Background & Atmosphere (Stars, Milky Way, Shooting Star)
    ctx.drawImage(this.cachedSkyCanvas, 0, 0, this.width, this.height);
    drawSkyAtmosphere(ctx, this, this.time);

    // 2. Far Layer: Distant City (Parallax max 4px)
    const farShift = this.currentShiftX * 4;
    if (this.farCity) {
      ctx.drawImage(this.farCity.canvas, -20 + farShift, 0, this.width + 40, this.height);
    }

    // 3. Mid Layer: Gopuram & Houses (Parallax max 10px)
    const midShift = this.currentShiftX * 10;
    if (this.midGopuram) {
      ctx.drawImage(this.midGopuram.canvas, -20 + midShift, 0, this.width + 40, this.height);
    }

    // 4. Mist Bands (lower third)
    if (this.qualityTier !== 'low' && this.mistCanvases) {
      const mistCount = this.qualityTier === 'high' ? 3 : 2;
      const baseMistY = this.height * 0.72;
      for (let m = 0; m < mistCount; m++) {
        const mCanvas = this.mistCanvases[m];
        if (!mCanvas) continue;
        const mx = -60 + this.mistOffsets[m] - (this.width + 120) * 0.5;
        ctx.drawImage(mCanvas, mx, baseMistY + m * 24);
      }
    }

    // 5. Floating Sky Lanterns
    drawLanterns(ctx, this.lanterns, isNameHoldActive, nameBounds);

    // 6. Burst Scene Lighting & Rim Lights
    if (this.qualityTier !== 'low') {
      drawBurstLighting(ctx, this.activeLights, this.width, this.midGopuram, midShift);
    }

    // 7. Front Layer: Rooftop Ledge (Parallax max 18px)
    const frontShift = this.currentShiftX * 18;
    if (this.frontLedge) {
      ctx.drawImage(this.frontLedge.canvas, -20 + frontShift, 0, this.width + 40, this.height);
    }

    // 8. Clay Diyas (1.4x larger) & Embers
    drawDiyas(ctx, this.diyas, frontShift, this.time);

    if (this.embers.length > 0) {
      ctx.save();
      ctx.fillStyle = SCENE_COLORS.sparkAmber;
      for (let i = 0; i < this.embers.length; i++) {
        const e = this.embers[i];
        if (!e) continue;
        ctx.globalAlpha = Math.max(0.0, 1.0 - (e.life / e.maxLife)) * 0.8;
        ctx.fillRect(e.x + frontShift, e.y, e.r, e.r);
      }
      ctx.restore();
    }
  }
}
