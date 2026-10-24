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

    // Freeze mode for exact frame testing: ?debug=1&freeze=7.5
    if (this.isDebug && this.freezeTime !== null && !isNaN(this.freezeTime)) {
      this.ui.clear();
      this.playShow(this.queryName || 'Priya', this.querySender || 'Vivek');
      const stepDt = 1 / 60;
      while (this.show.currentTime < this.freezeTime) {
        this.skyManager.updateAndDraw(stepDt);
        this.fireworks.update(stepDt);
        this.particlePool.update(stepDt);
        this.show.update(stepDt);
        this.particlePool.draw(this.skyManager.fireworksCtx, this.skyManager.width, this.skyManager.height, stepDt);
        this.fireworks.draw(this.skyManager.fireworksCtx);
        this.show.draw(this.skyManager.fireworksCtx, stepDt);
      }
      this.skyManager.updateBloom();
      this.isPaused = true;

      // Update debug HUD values for frozen frame
      if (this.debugHud) {
        if (this.debugFps) this.debugFps.textContent = `FPS: 60`;
        if (this.debugParticles) {
          const totalParticles = this.particlePool.getActiveCount() + (this.show.isActive ? this.show.sparkCount : 0);
          this.debugParticles.textContent = `Particles: ${totalParticles}`;
        }
        if (this.debugRockets) {
          this.debugRockets.textContent = `Rockets: ${this.fireworks.getRocketCount()}`;
        }
      }
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
        this.skyManager.updateAndDraw(fixedDt);
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
    if (this.skyManager) this.skyManager.setBloomEnabled(tier === 'high');
  }

  wireAudioCallbacks() {
    this.fireworks.onLaunch = () => this.sound.playLaunch();
    this.fireworks.onBurst = (type) => this.sound.playBurst(type);
    this.fireworks.onCrackle = () => this.sound.playCrackle();

    this.show.onHeroBoom = () => this.sound.playBurst('peony');
    this.show.onNameArrival = () => this.sound.playNameArrival();
    this.show.onMeltBegin = () => {
      if (this.isReceiverFlow) {
        this.ui.showEndCard();
      } else {
        this.ui.showSharePanel();
      }
    };
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
  }

  playShow(name = 'Priya', sender = 'Vivek', greeting = 'Happy Diwali') {
    this.enableAmbient = false;
    this.show.start(name, sender, greeting);
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
    });
  }

  startLoop() {
    const loop = (now) => {
      requestAnimationFrame(loop);

      if (this.isPaused) return;

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

      // Update and draw background sky, stars, and diyas
      this.skyManager.updateAndDraw(dt);

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
