// main.js - Application bootstrap, animation loop, routing, and audio interactions

import { SkyManager } from './sky.js';
import { ParticlePool } from './particles.js';
import { FireworksEngine } from './fireworks.js';
import { ShowTimeline } from './show.js';
import { SoundManager } from './audio.js';
import { UIManager } from './ui.js';
import { DemoManager } from './demo.js';
import { parseShareHash } from './link.js';
import { runSelfTests } from './selftest.js';

class DiwaliSkyApp {
  constructor() {
    this.appContainer = document.getElementById('app-container');
    this.skyCanvas = document.getElementById('sky-canvas');
    this.fireworksCanvas = document.getElementById('fireworks-canvas');
    this.bloomCanvas = document.getElementById('bloom-canvas');
    this.debugHud = document.getElementById('debug-hud');
    this.debugFpsEl = document.getElementById('debug-fps');
    this.debugParticlesEl = document.getElementById('debug-particles');
    this.debugRocketsEl = document.getElementById('debug-rockets');
    this.logoChip = document.getElementById('logo-chip');
    this.logoImg = document.getElementById('logo-img');

    // URL Parameters
    const urlParams = new URLSearchParams(window.location.search);
    this.isDebug = urlParams.get('debug') === '1';
    this.isTestMode = urlParams.get('test') === '1';
    this.isDemoMode = urlParams.get('demo') === '1';
    this.demoName = urlParams.get('name') || 'Priya';
    this.queryName = urlParams.get('name') || urlParams.get('recipient') || 'Priya';
    this.querySender = urlParams.get('from') || urlParams.get('sender') || 'Vivek';
    this.autoPlayShow = urlParams.get('show') === '1';

    // Budget setup
    const isPhone = window.innerWidth < 600;
    this.initialBudget = isPhone ? 2500 : 6000;

    // Subsystems
    this.sound = new SoundManager();
    this.skyManager = new SkyManager(this.skyCanvas, this.fireworksCanvas, this.bloomCanvas);
    this.particlePool = new ParticlePool(this.initialBudget);
    this.fireworks = new FireworksEngine(this.particlePool);
    this.show = new ShowTimeline(this.fireworks, this.skyManager);
    this.ui = new UIManager(this, this.sound);
    this.demoManager = new DemoManager(this, this.ui, this.sound);

    // Quality tier setup (?quality=high|medium|low)
    const forcedQuality = (urlParams.get('quality') || '').toLowerCase();
    if (['high', 'medium', 'low'].includes(forcedQuality)) {
      this.qualityTier = forcedQuality;
    } else {
      this.qualityTier = isPhone ? 'medium' : 'high';
    }
    this.setQualityTier(this.qualityTier);

    this.isReceiverFlow = false;

    // Wire sound effects to fireworks and show events
    this.wireAudioCallbacks();

    // Reduced motion support
    this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.handleReducedMotionChange(this.reducedMotionQuery.matches);
    this.reducedMotionQuery.addEventListener('change', (e) => this.handleReducedMotionChange(e.matches));

    // Logo image error fallback
    if (this.logoImg) {
      this.logoImg.addEventListener('error', () => {
        if (this.logoChip) this.logoChip.classList.add('fallback');
      });
    }

    // Performance tracking
    this.fpsHistory = [];
    this.currentFps = 60;
    this.startTime = performance.now();
    this.hasEvaluatedPerformance = false;

    // Animation loop state
    this.lastTime = performance.now();
    this.isPaused = false;
    this.enableAmbient = true;
    this.ambientTimer = 0;
    this.selectedBurstType = null;
    this.lastTapTime = 0;

    this.freezeTime = urlParams.get('freeze') !== null ? parseFloat(urlParams.get('freeze')) : null;

    this.initDebugHud();
    this.initFrameTools();
    this.bindEvents();

    // Check for self-test query param
    if (this.isTestMode) {
      runSelfTests();
    }

    const lightupParam = urlParams.get('receiver_lightup');
    const livePreviewParam = urlParams.get('livepreview');
    const buttonLaunchParam = urlParams.get('button_launch') === '1';
    const showShareCardParam = urlParams.get('show_share_card') === '1';
    const showEndCardParam = urlParams.get('show_end_card') === '1';
    this.isFrozenDebug = false;

    // Freeze mode for exact frame testing: ?debug=1&freeze=7.5
    if (this.isDebug && this.freezeTime !== null && !isNaN(this.freezeTime)) {
      this.ui.clear();
      this.recomputeFrozenState();
      this.isFrozenDebug = true;
      this.isPaused = true;
    } else if (this.isDebug && buttonLaunchParam) {
      this.ui.showSenderFlow({ recipient: 'Priya' });
      const submitBtn = document.querySelector('.ww-btn-primary');
      let btnOrigin = { x: window.innerWidth * 0.25, y: window.innerHeight * 0.65 };
      if (submitBtn) {
        const r = submitBtn.getBoundingClientRect();
        btnOrigin = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
      const homeLayout = document.querySelector('.home-layout');
      if (homeLayout) homeLayout.classList.add('animate-out');
      this.fireworks.launch(this.skyManager.width * 0.35, this.skyManager.height * 0.28, 'peony', null, btnOrigin);
      const stepDt = 1 / 60;
      for (let s = 0; s < 18; s++) {
        this.skyManager.updateAndDraw(stepDt);
        this.fireworks.update(stepDt);
        this.particlePool.update(stepDt);
        this.particlePool.draw(this.skyManager.fireworksCtx, this.skyManager.width, this.skyManager.height, stepDt);
        this.fireworks.draw(this.skyManager.fireworksCtx);
      }
      this.skyManager.updateBloom();
      this.isFrozenDebug = true;
      this.isPaused = true;
    } else if (this.isDebug && showShareCardParam) {
      this.isReceiverFlow = false;
      this.ui.currentData = { recipient: 'Priya', sender: 'Vivek', greeting: 'Happy Diwali' };
      this.playShow('Priya', 'Vivek');
      const stepDt = 1 / 60;
      while (this.show.currentTime < 10.0) {
        const isHold = this.show.currentTime >= 4.6 && this.show.currentTime < 9.5;
        this.skyManager.updateAndDraw(stepDt, isHold);
        this.fireworks.update(stepDt);
        this.particlePool.update(stepDt);
        this.show.update(stepDt);
        this.particlePool.draw(this.skyManager.fireworksCtx, this.skyManager.width, this.skyManager.height, stepDt);
        this.fireworks.draw(this.skyManager.fireworksCtx);
        this.show.draw(this.skyManager.fireworksCtx, stepDt);
      }
      this.skyManager.updateBloom();
      this.isFrozenDebug = true;
      this.isPaused = true;
    } else if (this.isDebug && showEndCardParam) {
      this.isReceiverFlow = true;
      this.ui.currentData = { recipient: 'Priya', sender: 'Vivek', greeting: 'Happy Diwali' };
      this.playShow('Priya', 'Vivek');
      const stepDt = 1 / 60;
      while (this.show.currentTime < 10.0) {
        const isHold = this.show.currentTime >= 4.6 && this.show.currentTime < 9.5;
        this.skyManager.updateAndDraw(stepDt, isHold);
        this.fireworks.update(stepDt);
        this.particlePool.update(stepDt);
        this.show.update(stepDt);
        this.particlePool.draw(this.skyManager.fireworksCtx, this.skyManager.width, this.skyManager.height, stepDt);
        this.fireworks.draw(this.skyManager.fireworksCtx);
        this.show.draw(this.skyManager.fireworksCtx, stepDt);
      }
      this.skyManager.updateBloom();
      this.isFrozenDebug = true;
      this.isPaused = true;
    } else if (this.isDebug && lightupParam !== null) {
      this.isReceiverFlow = true;
      this.ui.showReceiverFlow({ recipient: this.queryName || 'Priya', sender: this.querySender || 'Vivek', greeting: 'Happy Diwali' });
      const lightTime = parseFloat(lightupParam);
      if (lightTime <= 0) {
        this.skyManager.setReceiverDimmed(true);
      } else {
        this.skyManager.setReceiverDimmed(true);
        this.skyManager.startReceiverLightUp();
        const stepDt = 1 / 60;
        let elapsed = 0;
        while (elapsed < lightTime && this.skyManager.scene.isLightingUp) {
          elapsed += stepDt;
          this.skyManager.updateAndDraw(stepDt);
        }
        if (lightTime >= 1.5) {
          this.skyManager.scene.isReceiverDimmed = false;
          this.skyManager.scene.receiverLightUpProgress = 1.0;
        }
      }
      this.skyManager.updateAndDraw(0);
      this.isFrozenDebug = true;
      this.isPaused = true;
    } else if (this.isDebug && livePreviewParam !== null) {
      this.ui.showSenderFlow({ recipient: livePreviewParam });
      this.skyManager.setLivePreviewName(livePreviewParam);
    } else if (this.isDemoMode) {
      this.demoManager.start(this.demoName);
    } else {
      this.handleHashRoute();

      if (this.autoPlayShow) {
        this.ui.clear();
        this.playShow(this.queryName, this.querySender);
      }
    }

    this.startLoop();
  }

  initFrameTools() {
    if (!this.isDebug) return;

    window.dsPause = () => {
      this.isPaused = true;
      console.log(`[FrameTool] Paused at show time: ${this.show.currentTime.toFixed(3)}s`);
    };

    window.dsResume = () => {
      this.isPaused = false;
      this.lastTime = performance.now();
      console.log('[FrameTool] Resumed');
    };

    window.dsStep = (seconds = 1 / 60) => {
      const fixedDt = 1 / 60;
      const count = Math.max(1, Math.round(seconds / fixedDt));
      for (let i = 0; i < count; i++) {
        const isHold = this.show.isActive && this.show.currentTime >= 4.6 && this.show.currentTime < 9.5;
        const nameBounds = (this.show.isActive && this.show.nameData) ? this.show.nameData.bounds : null;
        if (this.show.isActive) {
          this.skyManager.setCameraPush(this.show.currentTime, this.show.heroTargetX, this.show.heroTargetY);
        }
        this.skyManager.updateAndDraw(fixedDt, isHold, nameBounds);
        this.fireworks.update(fixedDt);
        this.particlePool.update(fixedDt);
        this.show.update(fixedDt);
        this.particlePool.draw(this.skyManager.fireworksCtx, this.skyManager.width, this.skyManager.height, fixedDt);
        this.fireworks.draw(this.skyManager.fireworksCtx);
        this.show.draw(this.skyManager.fireworksCtx, fixedDt);
      }
      this.skyManager.updateBloom();
      console.log(`[FrameTool] Stepped forward ${seconds}s to show time: ${this.show.currentTime.toFixed(3)}s`);
    };
  }

  setQualityTier(tier) {
    this.qualityTier = tier;
    if (this.particlePool) this.particlePool.setQualityTier(tier);
    if (this.skyManager) this.skyManager.setQualityTier(tier);
  }

  wireAudioCallbacks() {
    this.fireworks.onLaunch = () => this.sound.playLaunch();
    this.fireworks.onBurst = (type, x, y, colors) => {
      this.sound.playBurst(type);
      if (x !== undefined && y !== undefined) {
        const colId = (colors && colors[0] !== undefined) ? colors[0] : 0;
        this.skyManager.addBurstLight(x, y, colId);
      }
    };
    this.fireworks.onCrackle = () => this.sound.playCrackle();

    this.show.onHeroBoom = () => {
      this.sound.playBurst('peony');
      this.skyManager.addBurstLight(this.show.heroTargetX, this.show.heroTargetY, 0);
    };
    this.show.onNameArrival = () => this.sound.playNameArrival();
    this.show.onCaptureStill = () => {
      this.capturedStillUrl = this.captureStillImage();
    };
    this.show.onMeltBegin = () => {
      if (!this.capturedStillUrl) {
        this.capturedStillUrl = this.captureStillImage();
      }
      if (this.isReceiverFlow) {
        this.ui.showEndCard(this.capturedStillUrl);
      } else {
        this.ui.showSharePanel(this.capturedStillUrl);
      }
    };
  }

  setReceiverDimmed(isDimmed) {
    this.skyManager.setReceiverDimmed(isDimmed);
  }

  startReceiverLightUp(onComplete) {
    this.skyManager.startReceiverLightUp(onComplete);
  }

  setLivePreviewName(name) {
    this.skyManager.setLivePreviewName(name);
  }

  captureStillImage() {
    try {
      const width = this.skyManager.width;
      const height = this.skyManager.height;
      const canvas = document.createElement('canvas');
      const targetW = 480;
      const targetH = Math.round(targetW * (height / width));
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(this.skyCanvas, 0, 0, targetW, targetH);
      ctx.drawImage(this.fireworksCanvas, 0, 0, targetW, targetH);
      return canvas.toDataURL('image/jpeg', 0.85);
    } catch (err) {
      console.error('Failed to capture still image:', err);
      return null;
    }
  }

  handleHashRoute() {
    const parsed = parseShareHash();
    if (parsed.hasShowData) {
      if (parsed.valid) {
        this.isReceiverFlow = true;
        this.ui.showReceiverFlow(parsed.data);
      } else {
        this.isReceiverFlow = false;
        this.ui.showSenderFlow({}, true);
      }
    } else {
      this.isReceiverFlow = false;
      if (!this.autoPlayShow) {
        this.ui.showSenderFlow();
      }
    }
  }

  handleReducedMotionChange(isReduced) {
    this.particlePool.setReducedMotion(isReduced);
    this.fireworks.setReducedMotion(isReduced);
    this.show.setReducedMotion(isReduced);
    if (this.skyManager) this.skyManager.setReducedMotion(isReduced);
  }

  playShow(name = 'Priya', sender = 'Vivek', greeting = 'Happy Diwali', startRocketFromButton = false) {
    this.enableAmbient = false;
    this.capturedStillUrl = null;
    this.show.start(name, sender, greeting, startRocketFromButton);
    this.show.onComplete = () => {
      this.enableAmbient = true;
    };
  }

  initDebugHud() {
    if (!this.isDebug || !this.debugHud) {
      if (this.debugHud) {
        this.debugHud.classList.remove('visible');
        this.debugHud.style.display = 'none';
      }
      return;
    }

    this.debugHud.classList.add('visible');
    this.debugHud.style.display = 'flex';
    this.debugHud.hidden = false;

    // Debug buttons for burst types
    const buttons = this.debugHud.querySelectorAll('.debug-btn:not(#debug-show-btn)');
    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.sound.unlock();
        const type = btn.getAttribute('data-burst');
        this.selectedBurstType = type;
        buttons.forEach((b) => b.classList.toggle('active', b === btn));

        const targetX = window.innerWidth * (0.35 + Math.random() * 0.3);
        const targetY = window.innerHeight * (0.2 + Math.random() * 0.2);
        this.fireworks.launch(targetX, targetY, type);
      });
    });

    const showBtn = document.getElementById('debug-show-btn');
    if (showBtn) {
      showBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.sound.unlock();
        this.playShow(this.queryName, this.querySender);
      });
    }

    // Keyboard shortcuts: 1-4 for burst types, 's' to play show
    window.addEventListener('keydown', (e) => {
      const keyMap = { '1': 'peony', '2': 'ring', '3': 'willow', '4': 'crackle' };
      if (keyMap[e.key]) {
        this.sound.unlock();
        this.selectedBurstType = keyMap[e.key];
        buttons.forEach((btn) => {
          btn.classList.toggle('active', btn.getAttribute('data-burst') === this.selectedBurstType);
        });
        const targetX = window.innerWidth * (0.35 + Math.random() * 0.3);
        const targetY = window.innerHeight * (0.2 + Math.random() * 0.2);
        this.fireworks.launch(targetX, targetY, this.selectedBurstType);
      } else if (e.key === 's' || e.key === 'S') {
        this.sound.unlock();
        this.playShow(this.queryName, this.querySender);
      }
    });
  }

  bindEvents() {
    const handleTap = (clientX, clientY) => {
      this.sound.unlock();
      const now = performance.now();
      if (now - this.lastTapTime < 60) return;
      this.lastTapTime = now;

      const rect = this.fireworksCanvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Restrict launch to top 75% of sky
      const targetY = Math.min(y, window.innerHeight * 0.72);
      this.fireworks.launch(x, targetY, this.selectedBurstType);
    };

    // Listen on container for pointerdown and click
    const tapTarget = this.appContainer || this.fireworksCanvas;

    tapTarget.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.top-bar') || e.target.closest('.ww-card')) return;
      handleTap(e.clientX, e.clientY);
    });

    tapTarget.addEventListener('click', (e) => {
      if (e.target.closest('.top-bar') || e.target.closest('.ww-card')) return;
      handleTap(e.clientX, e.clientY);
    });

    // Handle hash change for in-tab navigation
    window.addEventListener('hashchange', () => {
      this.handleHashRoute();
    });

    // Pause on hidden tab
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isPaused = true;
      } else {
        this.isPaused = false;
        this.lastTime = performance.now();
      }
    });

    // Orientation and resize safety
    window.addEventListener('resize', () => {
      const isPhone = window.innerWidth < 600;
      const budget = isPhone ? 2500 : 6000;
      this.particlePool.setBudget(budget);
      if (this.isFrozenDebug) {
        if (this.freezeTime !== null && !isNaN(this.freezeTime)) {
          this.recomputeFrozenState();
        }
        this.renderFrozenFrame();
      }
    });
  }

  recomputeFrozenState() {
    if (this.isDebug && this.freezeTime !== null && !isNaN(this.freezeTime)) {
      this.particlePool.clear();
      this.fireworks.rockets = [];
      this.playShow(this.queryName || 'Priya', this.querySender || 'Vivek');
      const stepDt = 1 / 60;
      while (this.show.currentTime < this.freezeTime) {
        const isHold = this.show.isActive && this.show.currentTime >= 4.6 && this.show.currentTime < 9.5;
        const nameBounds = (this.show.isActive && this.show.nameData) ? this.show.nameData.bounds : null;
        if (this.show.isActive) {
          this.skyManager.setCameraPush(this.show.currentTime, this.show.heroTargetX, this.show.heroTargetY);
        }
        this.skyManager.updateAndDraw(stepDt, isHold, nameBounds);
        this.fireworks.update(stepDt);
        this.particlePool.update(stepDt);
        this.show.update(stepDt);
        this.particlePool.draw(this.skyManager.fireworksCtx, this.skyManager.width, this.skyManager.height, stepDt);
        this.fireworks.draw(this.skyManager.fireworksCtx);
        this.show.draw(this.skyManager.fireworksCtx, stepDt);
      }
      this.skyManager.updateBloom();

      if (this.debugHud) {
        if (this.debugFpsEl) this.debugFpsEl.textContent = `FPS: 60`;
        if (this.debugParticlesEl) {
          const totalParticles = this.particlePool.getActiveCount() + (this.show.isActive ? this.show.sparkCount : 0);
          this.debugParticlesEl.textContent = `Particles: ${totalParticles}`;
        }
        if (this.debugRocketsEl) {
          this.debugRocketsEl.textContent = `Rockets: ${this.fireworks.getRocketCount()}`;
        }
      }
    }
  }

  renderFrozenFrame() {
    if (!this.isFrozenDebug) return;
    const isHold = this.show.isActive && this.show.currentTime >= 4.6 && this.show.currentTime < 9.5;
    const nameBounds = (this.show.isActive && this.show.nameData) ? this.show.nameData.bounds : null;
    if (this.show.isActive) {
      this.skyManager.setCameraPush(this.show.currentTime, this.show.heroTargetX, this.show.heroTargetY);
    }
    this.skyManager.scene.draw(isHold, nameBounds);
    this.skyManager.fireworksCtx.clearRect(0, 0, this.skyManager.width, this.skyManager.height);
    this.particlePool.draw(this.skyManager.fireworksCtx, this.skyManager.width, this.skyManager.height, 0.016);
    this.fireworks.draw(this.skyManager.fireworksCtx);
    this.show.draw(this.skyManager.fireworksCtx, 0);
    this.skyManager.updateBloom();
  }

  startLoop() {
    const loop = (now) => {
      requestAnimationFrame(loop);

      if (this.isPaused) {
        if (this.isFrozenDebug) {
          this.renderFrozenFrame();
        }
        return;
      }

      // Delta time in seconds, capped at 0.05
      let dt = (now - this.lastTime) / 1000;
      this.lastTime = now;
      if (dt > 0.05) dt = 0.05;
      if (dt <= 0) dt = 0.001;

      // FPS tracking
      const instantFps = 1 / dt;
      this.fpsHistory.push(instantFps);
      if (this.fpsHistory.length > 30) this.fpsHistory.shift();
      const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
      this.currentFps = Math.round(avgFps);

      // Performance evaluation during first 2 seconds: cut budget by 30% if under 45 fps
      const elapsed = (now - this.startTime) / 1000;
      if (!this.hasEvaluatedPerformance && elapsed >= 2.0 && this.fpsHistory.length >= 25) {
        this.hasEvaluatedPerformance = true;
        if (avgFps < 45) {
          const reducedBudget = Math.floor(this.initialBudget * 0.7);
          this.particlePool.setBudget(reducedBudget);
          console.warn(`Frame rate under 45 fps (${Math.round(avgFps)} fps). Reduced particle budget to ${reducedBudget}.`);
        }
      }

      // Camera push and name hold status
      const isHold = this.show.isActive && this.show.currentTime >= 4.6 && this.show.currentTime < 9.5;
      const nameBounds = (this.show.isActive && this.show.nameData) ? this.show.nameData.bounds : null;
      if (this.show.isActive) {
        this.skyManager.setCameraPush(this.show.currentTime, this.show.heroTargetX, this.show.heroTargetY);
      } else {
        this.skyManager.setCameraPush(0, this.skyManager.width * 0.5, this.skyManager.height * 0.38);
      }

      // Update and draw background sky, depth layers, lanterns, and diyas
      this.skyManager.updateAndDraw(dt, isHold, nameBounds);

      // Update fireworks rockets, particles, and show timeline
      this.fireworks.update(dt);
      this.particlePool.update(dt);
      this.show.update(dt);

      // Draw fireworks particles on front canvas
      this.particlePool.draw(
        this.skyManager.fireworksCtx,
        this.skyManager.width,
        this.skyManager.height,
        dt
      );

      // Draw glowing heads of rising rockets
      this.fireworks.draw(this.skyManager.fireworksCtx);

      // Draw name sparks and text overlays
      this.show.draw(this.skyManager.fireworksCtx, dt);

      // Update bloom canvas (High tier)
      this.skyManager.updateBloom();

      // Ambient fireworks when show is not actively forming
      if (this.enableAmbient && !this.show.isActive) {
        this.ambientTimer += dt;
        const ambientInterval = this.reducedMotionQuery.matches ? 4.5 : 2.6;
        if (this.ambientTimer >= ambientInterval) {
          this.ambientTimer = 0;
          if (this.fireworks.getRocketCount() < 2) {
            const randX = window.innerWidth * (0.2 + Math.random() * 0.6);
            const randY = window.innerHeight * (0.18 + Math.random() * 0.35);
            this.fireworks.launch(randX, randY);
          }
        }
      }

      // Update debug HUD
      if (this.isDebug && this.debugHud) {
        const totalLiveParticles = this.particlePool.getActiveCount() + (this.show.isActive ? this.show.sparkCount : 0);
        this.debugFpsEl.textContent = `FPS: ${this.currentFps}`;
        this.debugParticlesEl.textContent = `Particles: ${totalLiveParticles}`;
        this.debugRocketsEl.textContent = `Rockets: ${this.fireworks.getRocketCount()}`;
      }
    };

    requestAnimationFrame(loop);
  }
}

// Start application when DOM is ready or immediately if already loaded
function initApp() {
  if (!window.diwaliSkyApp) {
    window.diwaliSkyApp = new DiwaliSkyApp();
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
