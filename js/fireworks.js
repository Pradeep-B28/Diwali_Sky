// fireworks.js - Rockets, trajectory physics, and the 4 required burst types

import { PARTICLE_TYPES } from './particles.js';

// Color indices matching PALETTE_COLORS in particles.js:
// 0: Emerald (#34D399), 1: Teal (#2DD4BF), 2: Cyan (#22D3EE), 3: Mint (#A7F3D0)
// 4: Gold (#FCD34D), 5: Amber (#FBBF24), 6: White (#F8FAFC)
export const COLOR_IDS = {
  emerald: 0,
  teal: 1,
  cyan: 2,
  mint: 3,
  gold: 4,
  amber: 5,
  white: 6
};

const BRAND_COLOR_IDS = [COLOR_IDS.emerald, COLOR_IDS.teal, COLOR_IDS.cyan, COLOR_IDS.mint];
const FESTIVE_COLOR_IDS = [COLOR_IDS.gold, COLOR_IDS.amber];

const COLOR_HEXES = ['#34D399', '#2DD4BF', '#22D3EE', '#A7F3D0', '#FCD34D', '#FBBF24', '#F8FAFC'];

export class FireworksEngine {
  constructor(particlePool) {
    this.pool = particlePool;
    this.rockets = [];
    this.burstHistory = []; // Keeps track of brand vs festive ratio
    this.burstTimestamps = []; // Rate limiter for eye safety (<= 3 per sec)
    this.isReducedMotion = false;
    this.onLaunch = null;
    this.onBurst = null;
    this.onCrackle = null;
  }

  setReducedMotion(enabled) {
    this.isReducedMotion = enabled;
  }

  getRocketCount() {
    return this.rockets.length;
  }

  pickColorsForBurst(burstType) {
    if (burstType === 'willow') {
      // Willow always uses gold and amber
      return [COLOR_IDS.gold, COLOR_IDS.amber];
    }

    // At least 3 of every 5 bursts must use brand colours
    const recent5 = this.burstHistory.slice(-4);
    const brandCount = recent5.filter(isBrand => isBrand).length;
    let useBrand = true;

    if (recent5.length === 4 && brandCount < 3) {
      useBrand = true;
    } else {
      useBrand = Math.random() < 0.68;
    }

    this.burstHistory.push(useBrand);
    if (this.burstHistory.length > 20) this.burstHistory.shift();

    if (useBrand) {
      const c1 = BRAND_COLOR_IDS[Math.floor(Math.random() * BRAND_COLOR_IDS.length)];
      let c2 = BRAND_COLOR_IDS[Math.floor(Math.random() * BRAND_COLOR_IDS.length)];
      if (Math.random() < 0.3) {
        c2 = FESTIVE_COLOR_IDS[Math.floor(Math.random() * FESTIVE_COLOR_IDS.length)];
      }
      return [c1, c2];
    } else {
      return [COLOR_IDS.gold, COLOR_IDS.amber];
    }
  }

  launch(targetX, targetY, burstType = null, colorOverride = null) {
    // Maximum 6 rockets in the air at once
    if (this.rockets.length >= 6) {
      return false;
    }

    const startX = targetX + (Math.random() - 0.5) * 60;
    const startY = window.innerHeight + 8;

    const chosenType = burstType || ['peony', 'ring', 'willow', 'crackle'][Math.floor(Math.random() * 4)];
    const colors = colorOverride || this.pickColorsForBurst(chosenType);

    // Responsive ascent time: 0.55 to 0.75 seconds for snappy, magical feel
    const duration = 0.55 + Math.random() * 0.2;
    const dy = targetY - startY;
    const dx = targetX - startX;

    // Physics constants for ascent so rocket reaches apex (vy = 0) at targetY
    const vy0 = (2 * dy) / duration;
    const ay = -vy0 / duration;
    const vx = dx / duration;

    this.rockets.push({
      x: startX,
      y: startY,
      vx,
      vy: vy0,
      ay,
      targetX,
      targetY,
      duration,
      elapsed: 0,
      burstType: chosenType,
      colors,
      trailTimer: 0
    });

    if (this.onLaunch) {
      this.onLaunch();
    }

    return true;
  }

  burstPeony(x, y, colors) {
    const isPhone = window.innerWidth < 600;
    const count = this.isReducedMotion ? 75 : (isPhone ? 210 : 310);
    const baseSpeed = isPhone ? 238 : 288;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = baseSpeed * (0.4 + 0.65 * Math.random());
      const colId = Math.random() < 0.55 ? colors[0] : colors[1];
      const maxL = (1.1 + Math.random() * 0.45) * 1.30;

      this.pool.spawn(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        colId,
        maxL,
        2.2,
        PARTICLE_TYPES.STANDARD,
        0.958,
        105,
        3.5
      );
    }
  }

  burstRing(x, y, colors) {
    const isPhone = window.innerWidth < 600;
    const count = this.isReducedMotion ? 65 : (isPhone ? 190 : 270);
    const baseSpeed = isPhone ? 225 : 275;
    const rotOffset = Math.random() * Math.PI * 2;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rotOffset;
      const speed = baseSpeed * (0.92 + 0.14 * Math.random());
      const colId = i % 2 === 0 ? colors[0] : colors[1];
      const maxL = (1.1 + Math.random() * 0.35) * 1.30;

      this.pool.spawn(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        colId,
        maxL,
        2.0,
        PARTICLE_TYPES.STANDARD,
        0.954,
        80,
        2.0
      );
    }
  }

  burstWillow(x, y) {
    const isPhone = window.innerWidth < 600;
    const count = this.isReducedMotion ? 85 : (isPhone ? 230 : 340);
    const baseSpeed = isPhone ? 188 : 238;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = baseSpeed * (0.35 + 0.7 * Math.random());
      const colId = Math.random() < 0.6 ? COLOR_IDS.gold : COLOR_IDS.amber;
      const maxL = (2.4 + Math.random() * 0.6) * 1.30;

      this.pool.spawn(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed - 35, // slight upward bias
        colId,
        maxL,
        2.2,
        PARTICLE_TYPES.WILLOW,
        0.984, // low drag causes long graceful droop
        70,    // gentle gravity
        2.5
      );
    }
  }

  burstCrackle(x, y, colors) {
    const isPhone = window.innerWidth < 600;
    const count = this.isReducedMotion ? 60 : (isPhone ? 180 : 260);
    const baseSpeed = isPhone ? 212 : 262;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = baseSpeed * (0.4 + 0.65 * Math.random());
      const colId = colors[0];
      const maxL = (0.45 + Math.random() * 0.35) * 1.30;

      this.pool.spawn(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        colId,
        maxL,
        1.8,
        this.isReducedMotion ? PARTICLE_TYPES.STANDARD : PARTICLE_TYPES.CRACKLE_PRE,
        0.948,
        90,
        5.0
      );
    }
  }

  triggerBurst(x, y, burstType, colors, bypassRateLimit = false) {
    // Eye safety: rate limit large bright bursts to <= 3 per second
    if (!bypassRateLimit) {
      const now = performance.now();
      this.burstTimestamps = this.burstTimestamps.filter(t => now - t < 1000);
      if (this.burstTimestamps.length >= 3) {
        // Stagger extra burst by 220ms instead of dropping user click
        setTimeout(() => {
          this.triggerBurst(x, y, burstType, colors, true);
        }, 220);
        return;
      }
      this.burstTimestamps.push(now);
    }

    if (this.onBurst) {
      this.onBurst(burstType, x, y);
    }

    // Nice to have: Haptic vibration on bursts where supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(30);
      } catch (err) {
        // Ignored quietly where not supported
      }
    }

    switch (burstType) {
      case 'peony':
        this.burstPeony(x, y, colors);
        break;
      case 'ring':
        this.burstRing(x, y, colors);
        break;
      case 'willow':
        this.burstWillow(x, y);
        break;
      case 'crackle':
        this.burstCrackle(x, y, colors);
        if (this.onCrackle) {
          setTimeout(() => this.onCrackle(), 180);
        }
        break;
      default:
        this.burstPeony(x, y, colors);
        break;
    }
  }

  update(dt) {
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.elapsed += dt;

      // Rocket ascent physics
      r.vy += r.ay * dt;
      r.x += r.vx * dt;
      r.y += r.vy * dt;

      // Spawn bright sparkling trail behind rising rocket
      r.trailTimer += dt;
      if (r.trailTimer >= 0.016) {
        r.trailTimer = 0;
        const trailColId = r.colors[0];
        this.pool.spawn(
          r.x + (Math.random() - 0.5) * 4,
          r.y + (Math.random() - 0.5) * 4,
          -r.vx * 0.15 + (Math.random() - 0.5) * 20,
          -r.vy * 0.08 + (Math.random() - 0.5) * 20,
          trailColId,
          0.32,
          2.0,
          PARTICLE_TYPES.TRAIL,
          0.93,
          60,
          4.0
        );
      }

      // Check if rocket reached the apex of its trajectory
      if (r.elapsed >= r.duration || r.vy >= -10) {
        this.triggerBurst(r.x, r.y, r.burstType, r.colors);
        this.rockets.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    // Draw bright glowing head for each active rising rocket
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < this.rockets.length; i++) {
      const r = this.rockets[i];
      const colId = r.colors[0];
      const hex = COLOR_HEXES[colId] || '#34D399';

      // Outer color glow
      ctx.fillStyle = hex;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Inner white hot core (#F8FAFC)
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.arc(r.x, r.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
