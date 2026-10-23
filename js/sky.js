// sky.js - Stacked canvases, resize handling, night sky gradient, stars, and diyas

export class SkyManager {
  constructor(skyCanvas, fireworksCanvas) {
    this.skyCanvas = skyCanvas;
    this.fireworksCanvas = fireworksCanvas;
    this.skyCtx = skyCanvas.getContext('2d');
    this.fireworksCtx = fireworksCanvas.getContext('2d');

    // Offscreen canvas for cached background gradient and horizon glow
    this.cachedSkyCanvas = document.createElement('canvas');
    this.cachedSkyCtx = this.cachedSkyCanvas.getContext('2d');

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.stars = [];
    this.diyas = [];
    this.time = 0;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.resize(), 100);
    });
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    const physicalWidth = Math.floor(this.width * this.dpr);
    const physicalHeight = Math.floor(this.height * this.dpr);

    // Resize sky canvas
    this.skyCanvas.width = physicalWidth;
    this.skyCanvas.height = physicalHeight;
    this.skyCanvas.style.width = `${this.width}px`;
    this.skyCanvas.style.height = `${this.height}px`;
    this.skyCtx.setTransform(1, 0, 0, 1, 0, 0);
    this.skyCtx.scale(this.dpr, this.dpr);

    // Resize fireworks canvas
    this.fireworksCanvas.width = physicalWidth;
    this.fireworksCanvas.height = physicalHeight;
    this.fireworksCanvas.style.width = `${this.width}px`;
    this.fireworksCanvas.style.height = `${this.height}px`;
    this.fireworksCtx.setTransform(1, 0, 0, 1, 0, 0);
    this.fireworksCtx.scale(this.dpr, this.dpr);

    // Pre-render static background to offscreen canvas
    this.renderCachedBackground();

    this.initStars();
    this.initDiyas();
  }

  renderCachedBackground() {
    this.cachedSkyCanvas.width = Math.floor(this.width * this.dpr);
    this.cachedSkyCanvas.height = Math.floor(this.height * this.dpr);
    const ctx = this.cachedSkyCtx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(this.dpr, this.dpr);

    // Sky gradient: --sky-top -> --sky-mid -> --sky-bottom
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    skyGrad.addColorStop(0, '#020617');
    skyGrad.addColorStop(0.55, '#0F172A');
    skyGrad.addColorStop(1, '#0F2431');

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Horizon glow: smooth radial glow centered at bottom
    const glowRadius = Math.max(this.width * 0.75, 450);
    const glowGrad = ctx.createRadialGradient(
      this.width * 0.5,
      this.height + 20,
      10,
      this.width * 0.5,
      this.height + 20,
      glowRadius
    );
    glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.14)');
    glowGrad.addColorStop(0.45, 'rgba(16, 185, 129, 0.07)');
    glowGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');

    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Distant city & temple tower skyline silhouette behind diyas
    this.drawSkyline(ctx);
  }

  drawSkyline(ctx) {
    const w = this.width;
    const h = this.height;
    const baseH = h - 14;

    ctx.save();
    ctx.fillStyle = '#0F172A';

    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, baseH - 20);

    // Buildings left
    ctx.lineTo(w * 0.08, baseH - 20);
    ctx.lineTo(w * 0.08, baseH - 32);
    ctx.lineTo(w * 0.16, baseH - 32);
    ctx.lineTo(w * 0.16, baseH - 16);

    ctx.lineTo(w * 0.22, baseH - 16);
    ctx.lineTo(w * 0.26, baseH - 38);
    ctx.lineTo(w * 0.30, baseH - 16);

    ctx.lineTo(w * 0.40, baseH - 16);
    ctx.lineTo(w * 0.40, baseH - 26);
    ctx.lineTo(w * 0.46, baseH - 26);

    // Temple Tower (Gopuram) silhouette near middle
    const twStart = w * 0.48;
    const twMid = w * 0.52;
    const twEnd = w * 0.56;
    ctx.lineTo(twStart, baseH - 18);
    ctx.lineTo(twStart + (w * 0.008), baseH - 36);
    ctx.lineTo(twStart + (w * 0.015), baseH - 50);
    ctx.lineTo(twStart + (w * 0.022), baseH - 64);
    // Spire peak
    ctx.lineTo(twMid - 2, baseH - 72);
    ctx.lineTo(twMid, baseH - 80);
    ctx.lineTo(twMid + 2, baseH - 72);
    ctx.lineTo(twEnd - (w * 0.022), baseH - 64);
    ctx.lineTo(twEnd - (w * 0.015), baseH - 50);
    ctx.lineTo(twEnd - (w * 0.008), baseH - 36);
    ctx.lineTo(twEnd, baseH - 18);

    // Buildings right
    ctx.lineTo(w * 0.65, baseH - 18);
    ctx.lineTo(w * 0.65, baseH - 30);
    ctx.lineTo(w * 0.72, baseH - 30);
    ctx.lineTo(w * 0.72, baseH - 15);

    ctx.lineTo(w * 0.80, baseH - 15);
    ctx.lineTo(w * 0.84, baseH - 35);
    ctx.lineTo(w * 0.88, baseH - 15);

    ctx.lineTo(w * 0.94, baseH - 22);
    ctx.lineTo(w, baseH - 22);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  initStars() {
    // 150 to 250 stars on laptop, 110 to 140 on phone
    const isPhone = this.width < 600;
    const starCount = isPhone ? 125 : 210;

    this.stars = [];
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height * 0.84),
        radius: 0.6 + Math.random() * 0.9,
        baseAlpha: 0.35 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 1.6
      });
    }
  }

  initDiyas() {
    // 5 to 9 diyas depending on screen width
    let count = 5;
    if (this.width >= 800) {
      count = 9;
    } else if (this.width >= 480) {
      count = 7;
    }

    const margin = Math.max(28, this.width * 0.08);
    const availableWidth = this.width - margin * 2;
    const spacing = count > 1 ? availableWidth / (count - 1) : 0;
    const baseY = this.height - 24;

    this.diyas = [];
    for (let i = 0; i < count; i++) {
      const x = count === 1 ? this.width / 2 : margin + i * spacing;
      this.diyas.push({
        x,
        y: baseY,
        bowlWidth: 28,
        bowlHeight: 14,
        flameHeight: 19,
        flameWidth: 10,
        phaseOffset: i * 1.35
      });
    }
  }

  drawSkyBackground() {
    // Blit pre-cached sky background with zero gradient creation overhead
    this.skyCtx.drawImage(this.cachedSkyCanvas, 0, 0, this.width, this.height);
  }

  drawStars(dt) {
    const ctx = this.skyCtx;
    ctx.fillStyle = '#E2E8F0';

    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      star.phase += star.speed * dt;

      // Gentle twinkle between 0.3 and 1.0 of baseAlpha
      const twinkle = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(star.phase));
      const alpha = star.baseAlpha * twinkle;

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }

  drawDiyas() {
    const ctx = this.skyCtx;
    const t = this.time;

    for (let i = 0; i < this.diyas.length; i++) {
      const diya = this.diyas[i];
      const { x, y, bowlWidth, bowlHeight, flameHeight, flameWidth, phaseOffset } = diya;

      // Gentle flame flicker
      const flicker = Math.sin(t * 6.0 + phaseOffset) * 0.16 + Math.cos(t * 8.5 + phaseOffset * 1.5) * 0.08;
      const curFlameH = flameHeight * (1 + flicker);
      const curFlameW = flameWidth * (1 - flicker * 0.4);
      const wobbleX = Math.sin(t * 7.0 + phaseOffset) * 1.8;

      // Flame glow
      const glowGrad = ctx.createRadialGradient(x, y - 6, 2, x, y - 8, 22);
      glowGrad.addColorStop(0, 'rgba(252, 211, 77, 0.28)');
      glowGrad.addColorStop(1, 'rgba(252, 211, 77, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(x, y - 8, 22, 0, Math.PI * 2);
      ctx.fill();

      // Outer flame: teardrop shape from #FBBF24 to #FCD34D
      const flameGrad = ctx.createLinearGradient(x, y, x, y - curFlameH);
      flameGrad.addColorStop(0, '#FBBF24');
      flameGrad.addColorStop(1, '#FCD34D');

      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(x - curFlameW * 0.5, y - 2);
      ctx.quadraticCurveTo(x - curFlameW * 0.6, y - curFlameH * 0.5, x + wobbleX, y - curFlameH);
      ctx.quadraticCurveTo(x + curFlameW * 0.6, y - curFlameH * 0.5, x + curFlameW * 0.5, y - 2);
      ctx.closePath();
      ctx.fill();

      // Inner flame core (bright gold)
      const innerH = curFlameH * 0.6;
      const innerW = curFlameW * 0.5;
      ctx.fillStyle = '#FCD34D';
      ctx.beginPath();
      ctx.moveTo(x - innerW * 0.5, y - 2);
      ctx.quadraticCurveTo(x - innerW * 0.5, y - innerH * 0.5, x + wobbleX * 0.5, y - innerH);
      ctx.quadraticCurveTo(x + innerW * 0.5, y - innerH * 0.5, x + innerW * 0.5, y - 2);
      ctx.closePath();
      ctx.fill();

      // Diya bowl (#1E293B)
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.ellipse(x, y + 2, bowlWidth * 0.5, bowlHeight * 0.65, 0, 0, Math.PI);
      ctx.closePath();
      ctx.fill();

      // Diya rim (#10B981)
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(x, y + 2, bowlWidth * 0.5, bowlHeight * 0.22, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  updateAndDraw(dt) {
    this.time += dt;
    this.drawSkyBackground();
    this.drawStars(dt);
    this.drawDiyas();
  }
}
