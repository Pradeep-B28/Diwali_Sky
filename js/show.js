// show.js - The name show timeline and spark animation engine

import { generateNamePoints } from './nameText.js';
import { COLOR_IDS } from './fireworks.js';
import { PALETTE_COLORS } from './particles.js';

// Pre-generated RGBA strings: [colorId][alphaBin]
const ALPHA_BINS = 20;
const COLOR_ALPHA_LUT = PALETTE_COLORS.map(c => {
  const arr = [];
  for (let i = 0; i <= ALPHA_BINS; i++) {
    const a = (i / ALPHA_BINS).toFixed(2);
    arr.push(`rgba(${c.r}, ${c.g}, ${c.b}, ${a})`);
  }
  return arr;
});

export class ShowTimeline {
  constructor(fireworksEngine, skyManager) {
    this.fireworks = fireworksEngine;
    this.sky = skyManager;

    this.name = 'Priya';
    this.senderName = 'Vivek';
    this.greeting = 'Happy Diwali';

    this.nameData = null;
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

    // Rocket launch schedule flags
    this.launchedRocket1 = false;
    this.launchedRocket2 = false;
    this.launchedRocket3 = false;
    this.launchedHeroRocket = false;
    this.explodedHeroShell = false;
    this.heroTargetX = 0;
    this.heroTargetY = 0;

    this.onHeroBoom = null;
    this.onNameArrival = null;
    this.onMeltBegin = null;
    this.onComplete = null;
    this.hasTriggeredNameSound = false;
    this.hasTriggeredMeltCallback = false;
  }

  setReducedMotion(enabled) {
    this.isReducedMotion = enabled;
  }

  start(name = 'Priya', senderName = 'Vivek', greeting = 'Happy Diwali') {
    this.name = name || 'Priya';
    this.senderName = senderName || '';
    this.greeting = greeting || 'Happy Diwali';

    this.nameData = generateNamePoints(this.name, this.sky.width, this.sky.height);
    this.sparkCount = Math.min(this.nameData.points.length, this.maxCapacity);

    this.heroTargetX = this.nameData.bounds.centerX;
    this.heroTargetY = this.nameData.bounds.centerY;

    // Initialize name sparks data
    for (let i = 0; i < this.sparkCount; i++) {
      const p = this.nameData.points[i];
      this.targetX[i] = p.targetX;
      this.targetY[i] = p.targetY;
      this.u[i] = p.u;
      this.colorId[i] = p.colorId;
      this.isGlint[i] = p.isGlint ? 1 : 0;
      this.size[i] = p.size;

      // Stagger arrivals so the name builds from left to right (4.1s to 5.8s)
      this.arrivalTime[i] = 4.1 + p.u * 1.6;

      this.x[i] = this.heroTargetX;
      this.y[i] = this.heroTargetY;
      this.vx[i] = 0;
      this.vy[i] = 0;
    }

    this.currentTime = 0;
    this.isActive = true;
    this.launchedRocket1 = false;
    this.launchedRocket2 = false;
    this.launchedRocket3 = false;
    this.launchedHeroRocket = false;
    this.explodedHeroShell = false;
    this.hasTriggeredNameSound = false;
    this.hasTriggeredMeltCallback = false;
  }

  explodeHeroShell() {
    this.explodedHeroShell = true;

    if (this.onHeroBoom) {
      this.onHeroBoom();
    }

    // If reduced motion: sparks stay directly in place and simply fade in
    if (this.isReducedMotion) {
      for (let i = 0; i < this.sparkCount; i++) {
        this.x[i] = this.targetX[i];
        this.y[i] = this.targetY[i];
        this.vx[i] = 0;
        this.vy[i] = 0;
      }
      return;
    }

    // Normal motion: initial radial outward expansion for sparks
    for (let i = 0; i < this.sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 90 + Math.random() * 140;
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

    // Step 1: 0.0 to 2.5 s - Three rockets launch and burst
    if (t >= 0.35 && !this.launchedRocket1) {
      this.launchedRocket1 = true;
      this.fireworks.launch(this.sky.width * 0.30, this.sky.height * 0.28, 'peony');
    }
    if (t >= 1.15 && !this.launchedRocket2) {
      this.launchedRocket2 = true;
      this.fireworks.launch(this.sky.width * 0.70, this.sky.height * 0.26, 'ring');
    }
    if (t >= 1.90 && !this.launchedRocket3) {
      this.launchedRocket3 = true;
      this.fireworks.launch(this.sky.width * 0.48, this.sky.height * 0.34, 'willow');
    }

    // Step 2: 2.5 to 3.5 s - One large rocket with an emerald trail rises to upper middle
    if (t >= 2.50 && !this.launchedHeroRocket) {
      this.launchedHeroRocket = true;
      this.fireworks.launch(
        this.heroTargetX,
        this.heroTargetY,
        'peony',
        [COLOR_IDS.emerald, COLOR_IDS.mint]
      );
    }

    // Step 3: 3.5 s - Shell explodes into name sparks
    if (t >= 3.50 && !this.explodedHeroShell) {
      this.explodeHeroShell();
    }

    // Step 4 & 5: Spark physics and homing flight (3.5 to 9.5 s)
    if (t >= 3.50 && t < 9.50) {
      if (t >= 4.10 && !this.hasTriggeredNameSound) {
        this.hasTriggeredNameSound = true;
        if (this.onNameArrival) {
          this.onNameArrival();
        }
      }
      this.updateFormation(dt, t);
    }

    // Step 6: 9.5 to 12.0 s - Melt (gravity kicks in, falls like a willow, fades to gold)
    if (t >= 9.50 && t < 12.0) {
      if (!this.hasTriggeredMeltCallback) {
        this.hasTriggeredMeltCallback = true;
        if (this.onMeltBegin) {
          this.onMeltBegin();
        }
      }
      this.updateMelt(dt, t);
    }

    // Step 7: 12.0 s onwards - Ambient mode
    if (t >= 12.0 && this.isActive) {
      this.isActive = false;
      if (this.onComplete) {
        this.onComplete();
      }
    }
  }

  updateFormation(dt, t) {
    if (this.isReducedMotion) {
      return;
    }

    const timeRatio = dt * 60;
    const blastDamping = Math.pow(0.94, timeRatio);
    const homingDamping = Math.pow(0.85, timeRatio);

    for (let i = 0; i < this.sparkCount; i++) {
      const arrT = this.arrivalTime[i];

      if (t < 4.05) {
        // Initial outward blast
        this.vx[i] *= blastDamping;
        this.vy[i] *= blastDamping;
        this.x[i] += this.vx[i] * dt;
        this.y[i] += this.vy[i] * dt;
      } else if (t < arrT) {
        // Curve and fly into place: spring force toward target
        const homingProgress = Math.min(1.0, (t - 4.05) / (arrT - 4.05));
        const dx = this.targetX[i] - this.x[i];
        const dy = this.targetY[i] - this.y[i];

        // Smooth steering acceleration
        const force = 9.0 + homingProgress * 15.0;
        this.vx[i] += dx * force * dt;
        this.vy[i] += dy * force * dt;

        // Velocity damping as it approaches
        this.vx[i] *= homingDamping;
        this.vy[i] *= homingDamping;

        this.x[i] += this.vx[i] * dt;
        this.y[i] += this.vy[i] * dt;
      } else {
        // Arrived: anchor to target point with tiny organic jitter
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
    const meltDamping = Math.pow(0.982, timeRatio);
    const meltElapsed = t - 9.50;

    for (let i = 0; i < this.sparkCount; i++) {
      // Release from target points: willow gravity and gentle drag
      this.vy[i] += 80.0 * dt;
      this.vx[i] *= meltDamping;
      this.vy[i] *= meltDamping;

      this.x[i] += this.vx[i] * dt;
      this.y[i] += this.vy[i] * dt;

      // Color shifts to gold (#FCD34D, id 4) as it falls
      if (meltElapsed > 0.4 && this.colorId[i] !== COLOR_IDS.gold) {
        if (Math.random() < 0.08) {
          this.colorId[i] = COLOR_IDS.gold;
        }
      }
    }
  }

  draw(ctx, dt) {
    const t = this.currentTime;
    if (t < 3.50 || t >= 12.0) return;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const isHold = t >= 6.0 && t < 9.50;
    const isMelt = t >= 9.50;

    // Draw name sparks
    for (let i = 0; i < this.sparkCount; i++) {
      let alpha = 1.0;

      if (this.isReducedMotion) {
        if (t < 4.5) {
          alpha = Math.min(1.0, (t - 3.6) / 0.9);
        } else if (isMelt) {
          alpha = Math.max(0.0, 1.0 - (t - 9.5) / 2.2);
        }
      } else {
        if (t < 4.05) {
          alpha = 0.95;
        } else if (isHold) {
          // Shimmer and small random twinkle
          alpha = 0.88 + 0.12 * ((i + Math.floor(t * 8)) % 4 === 0 ? 0.3 : 1.0);
        } else if (isMelt) {
          // Fade over melt
          alpha = Math.max(0.0, 1.0 - (t - 9.5) / 2.4);
        }
      }

      if (alpha <= 0.02) continue;

      let cId = this.colorId[i];
      // Gold twinkle for glints
      if (this.isGlint[i] && ((i + Math.floor(t * 14)) % 7 === 0)) {
        cId = COLOR_IDS.gold;
      }

      const aBin = Math.min(ALPHA_BINS, Math.max(0, Math.floor(alpha * ALPHA_BINS)));
      const colorStr = COLOR_ALPHA_LUT[cId][aBin];
      const curSize = this.size[i];

      const px = this.x[i];
      const py = this.y[i];
      const vx = this.vx[i];
      const vy = this.vy[i];

      if (isMelt && (vy > 20 || Math.abs(vx) > 10)) {
        // Willow trailing streaks as it melts
        const streakFactor = 0.65;
        const prevX = px - vx * Math.min(dt, 0.035) * streakFactor;
        const prevY = py - vy * Math.min(dt, 0.035) * streakFactor;
        ctx.strokeStyle = colorStr;
        ctx.lineWidth = curSize;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(px, py);
        ctx.stroke();
      } else {
        // Solid spark dot
        ctx.fillStyle = colorStr;
        const half = curSize * 0.5;
        ctx.fillRect(px - half, py - half, curSize, curSize);
      }
    }

    ctx.restore();

    // Draw Greeting and Sender text during hold and melt
    if (t >= 6.0 && t < 11.0 && this.nameData) {
      this.drawTextOverlays(ctx, t);
    }
  }

  drawTextOverlays(ctx, t) {
    const fontStack = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    const isPhone = this.sky.width < 600;

    // Greeting: fades in 6.0 to 6.8s, fades out 9.5 to 10.5s
    let greetAlpha = 0;
    if (t < 6.8) {
      greetAlpha = Math.min(1.0, (t - 6.0) / 0.8);
    } else if (t < 9.5) {
      greetAlpha = 1.0;
    } else {
      greetAlpha = Math.max(0.0, 1.0 - (t - 9.5) / 1.0);
    }

    if (greetAlpha > 0.01) {
      ctx.save();
      const greetSize = isPhone ? 20 : 28;
      ctx.font = `800 ${greetSize}px ${fontStack}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '-0.01em';

      // --spark-gold: #FCD34D with soft glow
      ctx.shadowColor = '#FCD34D';
      ctx.shadowBlur = 10;
      ctx.fillStyle = `rgba(252, 211, 77, ${greetAlpha.toFixed(2)})`;

      const greetY = Math.max(48, this.nameData.bounds.minY - (isPhone ? 30 : 42));
      ctx.fillText(this.greeting, this.nameData.bounds.centerX, greetY);
      ctx.restore();
    }

    // Sender text ("from Vivek"): fades in 6.5 to 7.3s
    if (this.senderName && this.senderName.trim()) {
      let senderAlpha = 0;
      if (t < 7.3) {
        senderAlpha = Math.min(1.0, (t - 6.5) / 0.8);
      } else if (t < 9.5) {
        senderAlpha = 0.9;
      } else {
        senderAlpha = Math.max(0.0, 0.9 - ((t - 9.5) / 1.0));
      }

      if (senderAlpha > 0.01) {
        ctx.save();
        const senderSize = isPhone ? 14 : 18;
        ctx.font = `500 ${senderSize}px ${fontStack}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // --on-sky: #F1F5F9
        ctx.fillStyle = `rgba(241, 245, 249, ${senderAlpha.toFixed(2)})`;
        const senderY = Math.min(this.sky.height - 40, this.nameData.bounds.maxY + (isPhone ? 28 : 38));
        ctx.fillText(`from ${this.senderName.trim()}`, this.nameData.bounds.centerX, senderY);
        ctx.restore();
      }
    }
  }
}
