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
      this.arrivalTime[i] = 4.1 + p.u * 1.6;
      this.x[i] = this.heroTargetX;
      this.y[i] = this.heroTargetY;
      this.vx[i] = 0;
      this.vy[i] = 0;
    }

    this.generateNameAura();
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
  }

  generateNameAura() {
    if (!this.nameData) return;
    const qw = Math.max(1, Math.floor(this.sky.width / 4));
    const qh = Math.max(1, Math.floor(this.sky.height / 4));
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

    const minX = this.nameData.bounds.minX * scale;
    const maxX = this.nameData.bounds.maxX * scale;
    const grad = actx.createLinearGradient(minX, 0, maxX, 0);
    grad.addColorStop(0.0, '#34D399');
    grad.addColorStop(0.5, '#2DD4BF');
    grad.addColorStop(1.0, '#22D3EE');
    actx.fillStyle = grad;

    const qLineH = this.nameData.lineHeight * scale;
    const qTotalH = this.nameData.lines.length * qLineH;
    const qStartY = (this.sky.height * 0.38 * scale) - (qTotalH * 0.5) + (qLineH * 0.5);

    for (let l = 0; l < this.nameData.lines.length; l++) {
      actx.fillText(this.nameData.lines[l], qw * 0.5, qStartY + l * qLineH);
    }

    // Downscale to 1/8 and upscale back with smoothing
    const smallW = Math.max(2, Math.floor(qw / 8));
    const smallH = Math.max(2, Math.floor(qh / 8));
    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = smallW;
    smallCanvas.height = smallH;
    const smallCtx = smallCanvas.getContext('2d');
    smallCtx.imageSmoothingEnabled = true;

    smallCtx.drawImage(this.auraCanvas, 0, 0, smallW, smallH);
    actx.clearRect(0, 0, qw, qh);
    actx.imageSmoothingEnabled = true;
    actx.drawImage(smallCanvas, 0, 0, qw, qh);

    smallCtx.clearRect(0, 0, smallW, smallH);
    smallCtx.drawImage(this.auraCanvas, 0, 0, smallW, smallH);
    actx.clearRect(0, 0, qw, qh);
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

    // Step 1: 0.0 to 2.4 s - 5 opening rockets spread across the sky
    if (t >= 0.30 && !this.launchedRocket1) {
      this.launchedRocket1 = true;
      this.fireworks.launch(this.sky.width * 0.22, this.sky.height * 0.28, 'peony');
    }
    if (t >= 0.75 && !this.launchedRocket2) {
      this.launchedRocket2 = true;
      this.fireworks.launch(this.sky.width * 0.78, this.sky.height * 0.26, 'ring');
    }
    if (t >= 1.25 && !this.launchedRocket3) {
      this.launchedRocket3 = true;
      this.fireworks.launch(this.sky.width * 0.36, this.sky.height * 0.34, 'willow');
    }
    if (t >= 1.75 && !this.launchedRocket4) {
      this.launchedRocket4 = true;
      this.fireworks.launch(this.sky.width * 0.65, this.sky.height * 0.24, 'crackle');
    }
    if (t >= 2.20 && !this.launchedRocket5) {
      this.launchedRocket5 = true;
      this.fireworks.launch(this.sky.width * 0.50, this.sky.height * 0.32, 'peony');
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
    if (this.isReducedMotion) return;
    const timeRatio = dt * 60;
    const blastDamping = Math.pow(0.94, timeRatio);
    const homingDamping = Math.pow(0.85, timeRatio);

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
      } else {
        const seed = (i * 17 + Math.floor(t * 12)) % 31;
        const jitterX = (seed % 5 - 2) * 0.35;
        const jitterY = ((seed * 7) % 5 - 2) * 0.35;
        this.x[i] = this.targetX[i] + jitterX;
        this.y[i] = this.targetY[i] + jitterY;
        this.vx[i] = 0;
        this.vy[i] = 0;
      }
    }
  }

  updateMelt(dt, t) {
    const timeRatio = dt * 60;
    const meltDamping = Math.pow(0.988, timeRatio);
    const meltProgress = Math.min(1.0, (t - 9.50) / 3.2);

    for (let i = 0; i < this.sparkCount; i++) {
      this.vy[i] += 160.0 * dt;
      this.vx[i] *= meltDamping;
      this.vy[i] *= meltDamping;
      this.x[i] += this.vx[i] * dt;
      this.y[i] += this.vy[i] * dt;

      if (meltProgress > 0.15 && this.colorId[i] !== COLOR_IDS.gold) {
        if (Math.random() < (0.05 + meltProgress * 0.20)) {
          this.colorId[i] = COLOR_IDS.gold;
        }
      }
    }
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

      if (auraAlpha > 0.01) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = auraAlpha;
        ctx.drawImage(this.auraCanvas, 0, 0, this.sky.width, this.sky.height);
        ctx.restore();
      }
    }

    // 3. Name sparks with glow sprites and smooth gradient
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const isHold = t >= 6.0 && t < 9.50;
    const isMelt = t >= 9.50;

    for (let i = 0; i < this.sparkCount; i++) {
      let alpha = 1.0;
      if (this.isReducedMotion) {
        if (t < 4.5) alpha = Math.min(1.0, (t - 3.6) / 0.9);
        else if (isMelt) alpha = Math.max(0.0, 1.0 - (t - 9.5) / 3.0);
      } else {
        if (t < 4.05) alpha = 0.95;
        else if (isHold) alpha = 0.90 + 0.10 * ((i + Math.floor(t * 8)) % 4 === 0 ? 0.4 : 1.0);
        else if (isMelt) {
          const meltProgress = Math.min(1.0, (t - 9.50) / 3.2);
          alpha = Math.max(0.0, 1.0 - Math.pow(meltProgress, 1.7));
        }
      }
      if (alpha <= 0.02) continue;

      let sprite;
      if (isMelt && this.colorId[i] === COLOR_IDS.gold) sprite = GLINT_SPRITE;
      else if (this.isGlint[i] || ((i + Math.floor(t * 14)) % 10 === 0 && (isHold || isMelt))) sprite = GLINT_SPRITE;
      else sprite = getNameGradientSprite(this.u[i]);

      const curSize = this.size[i];
      const px = this.x[i];
      const py = this.y[i];
      const vx = this.vx[i];
      const vy = this.vy[i];
      const drawSize = curSize * 3.0;
      const halfDraw = drawSize * 0.5;

      if (isMelt && (vy > 25 || Math.abs(vx) > 10)) {
        const streakFactor = 0.65;
        const streakDt = Math.min(dt, 0.035);
        const prevX = px - vx * streakDt * streakFactor;
        const prevY = py - vy * streakDt * streakFactor;
        ctx.save();
        ctx.strokeStyle = this.colorId[i] === COLOR_IDS.gold ? `rgba(252, 211, 77, ${(alpha * 0.75).toFixed(2)})` : `rgba(52, 211, 153, ${(alpha * 0.75).toFixed(2)})`;
        ctx.lineWidth = curSize * 1.1;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(px, py);
        ctx.stroke();
        ctx.restore();
      }

      ctx.globalAlpha = alpha;
      ctx.drawImage(sprite, px - halfDraw, py - halfDraw, drawSize, drawSize);
    }
    ctx.restore();

    // 4. Greeting and sender text overlays
    if (t >= 6.0 && t < 11.5 && this.nameData) {
      this.drawTextOverlays(ctx, t);
    }
  }

  drawTextOverlays(ctx, t) {
    const fontStack = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    const isPhone = this.sky.width < 600;

    let greetAlpha = 0;
    if (t < 6.8) greetAlpha = Math.min(1.0, (t - 6.0) / 0.8);
    else if (t < 9.5) greetAlpha = 1.0;
    else greetAlpha = Math.max(0.0, 1.0 - (t - 9.5) / 1.6);

    if (greetAlpha > 0.01) {
      ctx.save();
      const greetSize = isPhone ? 20 : 28;
      ctx.font = `800 ${greetSize}px ${fontStack}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '-0.01em';
      ctx.shadowColor = '#FCD34D';
      ctx.shadowBlur = 10;
      ctx.fillStyle = `rgba(252, 211, 77, ${greetAlpha.toFixed(2)})`;
      const greetY = Math.max(48, this.nameData.bounds.minY - (isPhone ? 30 : 42));
      ctx.fillText(this.greeting, this.nameData.bounds.centerX, greetY);
      ctx.restore();
    }

    if (this.senderName && this.senderName.trim()) {
      let senderAlpha = 0;
      if (t < 7.3) senderAlpha = Math.min(1.0, (t - 6.5) / 0.8);
      else if (t < 9.5) senderAlpha = 0.9;
      else senderAlpha = Math.max(0.0, 0.9 - ((t - 9.5) / 1.6));

      if (senderAlpha > 0.01) {
        ctx.save();
        const senderSize = isPhone ? 14 : 18;
        ctx.font = `500 ${senderSize}px ${fontStack}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(241, 245, 249, ${senderAlpha.toFixed(2)})`;
        const senderY = Math.min(this.sky.height - 40, this.nameData.bounds.maxY + (isPhone ? 28 : 38));
        ctx.fillText(`from ${this.senderName.trim()}`, this.nameData.bounds.centerX, senderY);
        ctx.restore();
      }
    }
  }
}
