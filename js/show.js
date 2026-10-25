// show.js - The name show timeline, glowing aura, and spark animation engine
import { generateNamePoints } from './nameText.js';
import { COLOR_IDS } from './fireworks.js';
import { getNameGradientSprite, GLINT_SPRITE } from './sprites.js';

export class ShowTimeline {
  constructor(fireworksEngine, skyManager) {
    this.fireworks = fireworksEngine;
    this.sky = skyManager;
    this.name = 'Priya';
    this.senderName = 'Vivek';
    this.greeting = 'Happy Diwali';
    this.nameData = null;
    this.auraCanvas = null;
    this.sparkCount = 0;

    // Typed arrays for name sparks
    this.maxCapacity = 3200;
    this.x = new Float32Array(this.maxCapacity);
    this.y = new Float32Array(this.maxCapacity);
    this.vx = new Float32Array(this.maxCapacity);
    this.vy = new Float32Array(this.maxCapacity);
    this.targetX = new Float32Array(this.maxCapacity);
    this.targetY = new Float32Array(this.maxCapacity);
    this.startX = new Float32Array(this.maxCapacity);
    this.startY = new Float32Array(this.maxCapacity);
    this.u = new Float32Array(this.maxCapacity);
    this.colorId = new Uint8Array(this.maxCapacity);
    this.isGlint = new Uint8Array(this.maxCapacity);
    this.size = new Float32Array(this.maxCapacity);
    this.arrivalTime = new Float32Array(this.maxCapacity);
    this.drawSize = new Float32Array(this.maxCapacity);
    this.halfDraw = new Float32Array(this.maxCapacity);
    this.baseSprite = new Array(this.maxCapacity);

    this.isActive = false;
    this.currentTime = 0;
    this.isReducedMotion = false;
    this.launchedRocket1 = false;
    this.launchedRocket2 = false;
    this.launchedRocket3 = false;
    this.launchedRocket4 = false;
    this.launchedRocket5 = false;
    this.launchedHeroRocket = false;
    this.explodedHeroShell = false;
    this.hasPushedMelt = false;
    this.heroTargetX = 0;
    this.heroTargetY = 0;

    this.onHeroBoom = null;
    this.onNameArrival = null;
    this.onCaptureStill = null;
    this.onMeltBegin = null;
    this.onComplete = null;
    this.hasTriggeredNameSound = false;
    this.hasTriggeredMeltCallback = false;
    this.hasCapturedStill = false;
    this.hasBakedHoldCanvas = false;
  }

  setReducedMotion(enabled) {
    this.isReducedMotion = enabled;
  }

  start(name = 'Priya', senderName = 'Vivek', greeting = 'Happy Diwali', startRocketFromButton = false) {
    this.name = name || 'Priya';
    this.senderName = senderName || '';
    const lower = (greeting || '').toLowerCase().trim();
    this.greeting = (lower === 'deepavali' || lower === 'happy deepavali') ? 'Happy Deepavali' : 'Happy Diwali';

    this.nameData = generateNamePoints(this.name, this.sky.width, this.sky.height);
    this.sparkCount = Math.min(this.nameData.points.length, this.maxCapacity);
    this.heroTargetX = this.nameData.bounds.centerX;
    this.heroTargetY = this.nameData.bounds.centerY;

    for (let i = 0; i < this.sparkCount; i++) {
      const p = this.nameData.points[i];
      this.targetX[i] = p.targetX;
      this.targetY[i] = p.targetY;
      this.u[i] = p.u;
      this.colorId[i] = p.colorId;
      this.isGlint[i] = p.isGlint ? 1 : 0;
      this.size[i] = p.size;
      this.drawSize[i] = p.size * 3.0;
      this.halfDraw[i] = p.size * 1.5;
      this.baseSprite[i] = p.isGlint ? GLINT_SPRITE : getNameGradientSprite(p.u);
      this.arrivalTime[i] = 4.05 + p.u * 1.15;
      this.x[i] = this.heroTargetX;
      this.y[i] = this.heroTargetY;
      this.vx[i] = 0;
      this.vy[i] = 0;
    }

    this.generateNameAura();
    this.generateTextOverlay();
    this.currentTime = 0;
    this.isActive = true;
    this.launchedRocket1 = !!startRocketFromButton;
    this.launchedRocket2 = false;
    this.launchedRocket3 = false;
    this.launchedRocket4 = false;
    this.launchedRocket5 = false;
    this.launchedHeroRocket = false;
    this.explodedHeroShell = false;
    this.hasPushedMelt = false;
    this.hasTriggeredNameSound = false;
    this.hasTriggeredMeltCallback = false;
    this.hasCapturedStill = false;
    this.hasBakedHoldCanvas = false;
  }

  generateNameAura() {
    if (!this.nameData) return;
    const pad = 24;
    const b = this.nameData.bounds;
    const ax = Math.max(0, b.minX - pad);
    const ay = Math.max(0, b.minY - pad);
    const aw = Math.min(this.sky.width - ax, (b.maxX - b.minX) + pad * 2);
    const ah = Math.min(this.sky.height - ay, (b.maxY - b.minY) + pad * 2);

    this.auraBounds = { x: ax, y: ay, w: aw, h: ah };

    const qw = Math.max(2, Math.floor(aw / 4));
    const qh = Math.max(2, Math.floor(ah / 4));
    if (!this.auraCanvas) this.auraCanvas = document.createElement('canvas');
    this.auraCanvas.width = qw;
    this.auraCanvas.height = qh;
    const actx = this.auraCanvas.getContext('2d');
    actx.clearRect(0, 0, qw, qh);

    const scale = 0.25;
    const qFontSize = this.nameData.fontSize * scale;
    actx.font = `800 ${qFontSize}px ${this.nameData.fontStack}`;
    actx.textAlign = 'center';
    actx.textBaseline = 'middle';

    const minX = (b.minX - ax) * scale;
    const maxX = (b.maxX - ax) * scale;
    const grad = actx.createLinearGradient(minX, 0, maxX, 0);
    grad.addColorStop(0.0, '#34D399');
    grad.addColorStop(0.5, '#2DD4BF');
    grad.addColorStop(1.0, '#22D3EE');
    actx.fillStyle = grad;

    const qLineH = this.nameData.lineHeight * scale;
    const qTotalH = this.nameData.lines.length * qLineH;
    const qStartY = ((b.centerY - ay) * scale) - (qTotalH * 0.5) + (qLineH * 0.5);

    for (let l = 0; l < this.nameData.lines.length; l++) {
      actx.fillText(this.nameData.lines[l], (b.centerX - ax) * scale, qStartY + l * qLineH);
    }

    // Downscale and upscale with smoothing
    const smallW = Math.max(2, Math.floor(qw / 4));
    const smallH = Math.max(2, Math.floor(qh / 4));
    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = smallW;
    smallCanvas.height = smallH;
    const smallCtx = smallCanvas.getContext('2d');
    smallCtx.imageSmoothingEnabled = true;

    smallCtx.drawImage(this.auraCanvas, 0, 0, smallW, smallH);
    actx.clearRect(0, 0, qw, qh);
    actx.imageSmoothingEnabled = true;
    actx.drawImage(smallCanvas, 0, 0, qw, qh);
  }

  explodeHeroShell() {
    this.explodedHeroShell = true;
    if (this.onHeroBoom) this.onHeroBoom();

    if (this.isReducedMotion) {
      for (let i = 0; i < this.sparkCount; i++) {
        this.x[i] = this.targetX[i];
        this.y[i] = this.targetY[i];
        this.vx[i] = 0;
        this.vy[i] = 0;
      }
      return;
    }

    for (let i = 0; i < this.sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 110 + Math.random() * 160;
      this.x[i] = this.heroTargetX;
      this.y[i] = this.heroTargetY;
      this.startX[i] = this.heroTargetX;
      this.startY[i] = this.heroTargetY;
      this.vx[i] = Math.cos(angle) * speed;
      this.vy[i] = Math.sin(angle) * speed;
    }
  }

  update(dt) {
    if (!this.isActive) return;
    this.currentTime += dt;
    const t = this.currentTime;

    // Step 1: 0.0 to 2.4 s - 3 opening rockets spread across the sky (Section 4C)
    if (t >= 0.25 && !this.launchedRocket1) {
      this.launchedRocket1 = true;
      this.fireworks.launch(this.sky.width * 0.26, this.sky.height * 0.28, 'peony');
    }
    if (t >= 0.95 && !this.launchedRocket2) {
      this.launchedRocket2 = true;
      this.fireworks.launch(this.sky.width * 0.74, this.sky.height * 0.26, 'ring');
    }
    if (t >= 1.70 && !this.launchedRocket3) {
      this.launchedRocket3 = true;
      this.fireworks.launch(this.sky.width * 0.48, this.sky.height * 0.33, 'willow');
    }

    // Step 2: 2.5 to 3.5 s - Emerald hero rocket rises
    if (t >= 2.50 && !this.launchedHeroRocket) {
      this.launchedHeroRocket = true;
      this.fireworks.launch(this.heroTargetX, this.heroTargetY, 'peony', [COLOR_IDS.emerald, COLOR_IDS.mint]);
    }

    // Step 3: 3.5 s - Hero shell explodes
    if (t >= 3.50 && !this.explodedHeroShell) {
      this.explodeHeroShell();
    }

    // Step 4 & 5: Spark physics and homing flight (3.5 to 9.5 s)
    if (t >= 3.50 && t < 9.50) {
      if (t >= 4.10 && !this.hasTriggeredNameSound) {
        this.hasTriggeredNameSound = true;
        if (this.onNameArrival) this.onNameArrival();
      }
      if (t >= 7.75 && !this.hasCapturedStill) {
        this.hasCapturedStill = true;
        if (this.onCaptureStill) this.onCaptureStill();
      }
      this.updateFormation(dt, t);
    }

    // Step 6: 9.5 to 12.7 s - Real Melt (3.2 s duration)
    if (t >= 9.50 && t < 12.70) {
      if (!this.hasTriggeredMeltCallback) {
        this.hasTriggeredMeltCallback = true;
        if (this.onMeltBegin) this.onMeltBegin();
      }
      if (!this.hasPushedMelt) {
        this.hasPushedMelt = true;
        for (let i = 0; i < this.sparkCount; i++) {
          this.vx[i] = (Math.random() * 2 - 1) * 25.0;
          this.vy[i] = 10.0 + Math.random() * 30.0;
        }
      }
      this.updateMelt(dt, t);
    }

    // Step 7: 12.7 s onwards - Ambient mode
    if (t >= 12.70 && this.isActive) {
      this.isActive = false;
      if (this.onComplete) this.onComplete();
    }
  }

  updateFormation(dt, t) {
    if (this.isReducedMotion || t >= 6.0) return;
    const timeRatio = dt * 60;
    const blastDamping = Math.pow(0.94, timeRatio);
    const homingDamping = Math.pow(0.85, timeRatio);
    const timeFloor12 = Math.floor(t * 12);

    for (let i = 0; i < this.sparkCount; i++) {
      const arrT = this.arrivalTime[i];
      if (t < 4.05) {
        this.vx[i] *= blastDamping;
        this.vy[i] *= blastDamping;
        this.x[i] += this.vx[i] * dt;
        this.y[i] += this.vy[i] * dt;
      } else if (t < arrT) {
        const homingProgress = Math.min(1.0, (t - 4.05) / (arrT - 4.05));
        const dx = this.targetX[i] - this.x[i];
        const dy = this.targetY[i] - this.y[i];
        const force = 9.0 + homingProgress * 15.0;
        this.vx[i] += dx * force * dt;
        this.vy[i] += dy * force * dt;
        this.vx[i] *= homingDamping;
        this.vy[i] *= homingDamping;
        this.x[i] += this.vx[i] * dt;
        this.y[i] += this.vy[i] * dt;
      } else if (this.vx[i] !== 0 || this.vy[i] !== 0) {
        this.x[i] = this.targetX[i];
        this.y[i] = this.targetY[i];
        this.vx[i] = 0;
        this.vy[i] = 0;
      }
    }
  }

  updateMelt(dt, t) {
    const timeRatio = dt * 60;
    const meltDamping = Math.pow(0.988, timeRatio);
    const grav = 160.0 * dt;

    for (let i = 0; i < this.sparkCount; i++) {
      this.vy[i] += grav;
      this.vx[i] *= meltDamping;
      this.vy[i] *= meltDamping;
      this.x[i] += this.vx[i] * dt;
      this.y[i] += this.vy[i] * dt;
    }
  }

  bakeHoldCanvas() {
    if (!this.nameData) return;
    const pad = 12;
    const b = this.nameData.bounds;
    const bx = Math.max(0, Math.floor(b.minX - pad));
    const by = Math.max(0, Math.floor(b.minY - pad));
    const bw = Math.min(this.sky.width - bx, Math.ceil(b.maxX - b.minX + pad * 2));
    const bh = Math.min(this.sky.height - by, Math.ceil(b.maxY - b.minY + pad * 2));
    this.holdBounds = { x: bx, y: by, w: bw, h: bh };

    if (!this.holdCanvas) this.holdCanvas = document.createElement('canvas');
    this.holdCanvas.width = bw;
    this.holdCanvas.height = bh;
    const hctx = this.holdCanvas.getContext('2d');
    hctx.clearRect(0, 0, bw, bh);

    for (let i = 0; i < this.sparkCount; i++) {
      const sprite = this.baseSprite[i];
      const px = this.targetX[i] - bx;
      const py = this.targetY[i] - by;
      const sz = this.drawSize[i];
      const h = this.halfDraw[i];
      hctx.drawImage(sprite, px - h, py - h, sz, sz);
    }
    this.hasBakedHoldCanvas = true;
  }

  draw(ctx, dt) {
    const t = this.currentTime;
    if (t < 3.50 || t >= 12.70) return;

    // 1. Hero burst local soft flash at 3.5 s (max 35% strength, 150 ms)
    if (t >= 3.50 && t < 3.65) {
      const flashProgress = (t - 3.50) / 0.15;
      const flashAlpha = 0.35 * (1.0 - flashProgress);
      const flashRadius = Math.min(this.sky.width, this.sky.height) * 0.38;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const radGrad = ctx.createRadialGradient(
        this.heroTargetX, this.heroTargetY, 0,
        this.heroTargetX, this.heroTargetY, flashRadius
      );
      radGrad.addColorStop(0.00, `rgba(248, 250, 252, ${flashAlpha.toFixed(3)})`);
      radGrad.addColorStop(0.35, `rgba(52, 211, 153, ${(flashAlpha * 0.75).toFixed(3)})`);
      radGrad.addColorStop(1.00, 'rgba(52, 211, 153, 0.0)');
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(this.heroTargetX, this.heroTargetY, flashRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Glowing aura behind name sparks during hold (breathing between 22% and 34%)
    if (t >= 5.0 && t < 10.5 && this.auraCanvas) {
      let auraAlpha = 0;
      if (t < 6.0) {
        auraAlpha = ((t - 5.0) / 1.0) * 0.28;
      } else if (t < 9.5) {
        const cycle = ((t - 6.0) / 2.5) * Math.PI * 2;
        auraAlpha = 0.28 + 0.06 * Math.sin(cycle);
      } else {
        auraAlpha = Math.max(0.0, (1.0 - (t - 9.5) / 1.0) * 0.28);
      }

      if (auraAlpha > 0.01 && this.auraBounds) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = auraAlpha;
        ctx.drawImage(this.auraCanvas, this.auraBounds.x, this.auraBounds.y, this.auraBounds.w, this.auraBounds.h);
        ctx.restore();
      }
    }

    // 3. Name sparks with glow sprites and smooth gradient
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const isHold = t >= 6.0 && t < 9.50;
    const isMelt = t >= 9.50;
    const timeFloor8 = Math.floor(t * 8);
    const timeFloor14 = Math.floor(t * 14);
    const meltProgress = isMelt ? Math.min(1.0, (t - 9.50) / 3.2) : 0;
    const meltAlpha = isMelt ? Math.max(0.0, 1.0 - Math.pow(meltProgress, 1.7)) : 0;
    const streakDt = Math.min(dt, 0.035) * 0.65;
    let lastAlpha = -1;

    if (isMelt && meltAlpha > 0.05) {
      ctx.lineCap = 'round';
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#FCD34D';
      ctx.globalAlpha = meltAlpha;
      ctx.beginPath();
      for (let i = 0; i < this.sparkCount; i++) {
        if (this.vy[i] > 25 || Math.abs(this.vx[i]) > 10) {
          const px = this.x[i];
          const py = this.y[i];
          ctx.moveTo(px - this.vx[i] * streakDt, py - this.vy[i] * streakDt);
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    }

    let batchAlpha = 1.0;
    if (this.isReducedMotion) {
      if (t < 4.5) batchAlpha = Math.min(1.0, (t - 3.6) / 0.9);
      else if (isMelt) batchAlpha = Math.max(0.0, 1.0 - (t - 9.5) / 3.0);
    } else {
      if (isMelt) batchAlpha = meltAlpha;
      else if (t < 4.05) batchAlpha = 0.95;
    }

    if (batchAlpha > 0.02) {
      ctx.globalAlpha = batchAlpha;
      if (isMelt) {
        for (let i = 0; i < this.sparkCount; i++) {
          const px = this.x[i];
          const py = this.y[i];
          const drawSize = this.drawSize[i];
          const halfDraw = this.halfDraw[i];
          ctx.drawImage(GLINT_SPRITE, px - halfDraw, py - halfDraw, drawSize, drawSize);
        }
      } else if (isHold) {
        if (!this.hasBakedHoldCanvas) this.bakeHoldCanvas();
        if (this.holdBounds) ctx.drawImage(this.holdCanvas, this.holdBounds.x, this.holdBounds.y);

        // Twinkling glints (1 in 10 sparks)
        for (let i = 0; i < this.sparkCount; i++) {
          if ((i + timeFloor14) % 10 === 0) {
            const px = this.targetX[i];
            const py = this.targetY[i];
            const drawSize = this.drawSize[i];
            const halfDraw = this.halfDraw[i];
            ctx.drawImage(GLINT_SPRITE, px - halfDraw, py - halfDraw, drawSize, drawSize);
          }
        }
      } else {
        for (let i = 0; i < this.sparkCount; i++) {
          const sprite = (i + timeFloor14) % 10 === 0 ? GLINT_SPRITE : this.baseSprite[i];
          const px = this.x[i];
          const py = this.y[i];
          const drawSize = this.drawSize[i];
          const halfDraw = this.halfDraw[i];
          ctx.drawImage(sprite, px - halfDraw, py - halfDraw, drawSize, drawSize);
        }
      }
    }
    ctx.restore();

    // 4. Greeting and sender text overlays
    if (t >= 6.0 && t < 11.5 && this.nameData) {
      this.drawTextOverlays(ctx, t);
    }
  }

  generateTextOverlay() {
    if (!this.nameData) return;
    const w = this.sky.width;
    const h = this.sky.height;
    const fontStack = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    const isPhone = w < 600;

    // Greeting overlay: tightly bounded
    const gw = Math.min(w, isPhone ? 320 : 440);
    const gh = isPhone ? 46 : 60;
    if (!this.greetCanvas) this.greetCanvas = document.createElement('canvas');
    this.greetCanvas.width = gw;
    this.greetCanvas.height = gh;
    const gctx = this.greetCanvas.getContext('2d');
    gctx.clearRect(0, 0, gw, gh);
    const greetSize = isPhone ? 20 : 28;
    gctx.font = `800 ${greetSize}px ${fontStack}`;
    gctx.textAlign = 'center';
    gctx.textBaseline = 'middle';
    gctx.letterSpacing = '-0.01em';
    gctx.shadowColor = '#FCD34D';
    gctx.shadowBlur = 10;
    gctx.fillStyle = '#FCD34D';
    gctx.fillText(this.greeting, gw * 0.5, gh * 0.5);

    const greetCenterY = Math.max(48, this.nameData.bounds.minY - (isPhone ? 30 : 42));
    this.greetPos = {
      x: this.nameData.bounds.centerX - gw * 0.5,
      y: greetCenterY - gh * 0.5
    };

    // Sender overlay: tightly bounded
    if (this.senderName && this.senderName.trim()) {
      const sw = Math.min(w, isPhone ? 280 : 380);
      const sh = isPhone ? 36 : 48;
      if (!this.senderCanvas) this.senderCanvas = document.createElement('canvas');
      this.senderCanvas.width = sw;
      this.senderCanvas.height = sh;
      const sctx = this.senderCanvas.getContext('2d');
      sctx.clearRect(0, 0, sw, sh);
      const senderSize = isPhone ? 14 : 18;
      sctx.font = `500 ${senderSize}px ${fontStack}`;
      sctx.textAlign = 'center';
      sctx.textBaseline = 'middle';
      sctx.fillStyle = '#F1F5F9';
      sctx.fillText(`from ${this.senderName.trim()}`, sw * 0.5, sh * 0.5);

      const senderCenterY = Math.min(h - 40, this.nameData.bounds.maxY + (isPhone ? 28 : 38));
      this.senderPos = {
        x: this.nameData.bounds.centerX - sw * 0.5,
        y: senderCenterY - sh * 0.5
      };
    }
  }

  drawTextOverlays(ctx, t) {
    if (!this.nameData) return;

    let greetAlpha = 0;
    if (t < 6.8) greetAlpha = Math.min(1.0, (t - 6.0) / 0.8);
    else if (t < 9.5) greetAlpha = 1.0;
    else greetAlpha = Math.max(0.0, 1.0 - (t - 9.5) / 1.6);

    if (greetAlpha > 0.01 && this.greetCanvas && this.greetPos) {
      ctx.save();
      ctx.globalAlpha = greetAlpha;
      ctx.drawImage(this.greetCanvas, this.greetPos.x, this.greetPos.y);
      ctx.restore();
    }

    if (this.senderName && this.senderName.trim() && this.senderCanvas && this.senderPos) {
      let senderAlpha = 0;
      if (t < 7.3) senderAlpha = Math.min(1.0, (t - 6.5) / 0.8);
      else if (t < 9.5) senderAlpha = 0.9;
      else senderAlpha = Math.max(0.0, 0.9 - ((t - 9.5) / 1.6));

      if (senderAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = senderAlpha;
        ctx.drawImage(this.senderCanvas, this.senderPos.x, this.senderPos.y);
        ctx.restore();
      }
    }
  }
}
