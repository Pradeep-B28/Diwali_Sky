// particles.js - High-performance typed-array particle pool and physics

import { PALETTE_SPRITES } from './sprites.js';

export const PARTICLE_TYPES = {
  STANDARD: 0,
  WILLOW: 1,
  CRACKLE_PRE: 2,
  CRACKLE_POP: 3,
  TRAIL: 4
};

// Section 5 palette definitions (strictly matched to Section 5 hex values)
export const PALETTE_COLORS = [
  { id: 0, hex: '#34D399', r: 52,  g: 211, b: 153 }, // emerald
  { id: 1, hex: '#2DD4BF', r: 45,  g: 212, b: 191 }, // teal
  { id: 2, hex: '#22D3EE', r: 34,  g: 211, b: 238 }, // cyan
  { id: 3, hex: '#A7F3D0', r: 167, g: 243, b: 208 }, // mint
  { id: 4, hex: '#FCD34D', r: 252, g: 211, b: 77  }, // gold
  { id: 5, hex: '#FBBF24', r: 251, g: 191, b: 36  }, // amber
  { id: 6, hex: '#F8FAFC', r: 248, g: 250, b: 252 }  // white
];

// Pre-generated RGBA string lookup table: [colorId][alphaBin]
// 7 colors x 20 alpha levels = 140 strings. Zero allocations during animation frames.
const ALPHA_BINS = 20;
const COLOR_ALPHA_LUT = PALETTE_COLORS.map(c => {
  const arr = [];
  for (let i = 0; i <= ALPHA_BINS; i++) {
    const alpha = (i / ALPHA_BINS).toFixed(2);
    arr.push(`rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`);
  }
  return arr;
});

const MAX_CAPACITY = 7000;

export class ParticlePool {
  constructor(initialBudget = 6000) {
    this.capacity = MAX_CAPACITY;
    this.budget = initialBudget;
    this.qualityTier = 'high';

    // Typed arrays for particle data
    this.x = new Float32Array(this.capacity);
    this.y = new Float32Array(this.capacity);
    this.vx = new Float32Array(this.capacity);
    this.vy = new Float32Array(this.capacity);
    this.life = new Float32Array(this.capacity);
    this.maxLife = new Float32Array(this.capacity);
    this.size = new Float32Array(this.capacity);
    this.drag = new Float32Array(this.capacity);
    this.gravity = new Float32Array(this.capacity);
    this.flicker = new Float32Array(this.capacity);

    this.colorId = new Uint8Array(this.capacity);
    this.type = new Uint8Array(this.capacity);

    // Dense index tracking for O(1) allocation and removal
    this.activeIndices = new Int32Array(this.capacity);
    for (let i = 0; i < this.capacity; i++) {
      this.activeIndices[i] = i;
    }
    this.activeCount = 0;

    // Preallocated alpha bins for zero-flush batched drawing
    this.bin0 = new Int32Array(this.capacity);
    this.bin1 = new Int32Array(this.capacity);
    this.bin2 = new Int32Array(this.capacity);

    this.isReducedMotion = false;
  }

  setBudget(budget) {
    this.budget = Math.min(Math.max(budget, 800), this.capacity);
  }

  setReducedMotion(enabled) {
    this.isReducedMotion = enabled;
  }

  setQualityTier(tier) {
    this.qualityTier = tier;
  }

  spawn(x, y, vx, vy, colorId, maxLife, size = 2.0, type = PARTICLE_TYPES.STANDARD, drag = 0.96, gravity = 120, flicker = 0) {
    if (this.activeCount >= this.budget) {
      return -1;
    }

    const idx = this.activeIndices[this.activeCount];
    this.activeCount++;

    this.x[idx] = x;
    this.y[idx] = y;
    this.vx[idx] = vx;
    this.vy[idx] = vy;
    this.colorId[idx] = colorId;
    this.life[idx] = 0;
    this.maxLife[idx] = maxLife;
    this.size[idx] = size;
    this.type[idx] = type;
    this.drag[idx] = drag;
    this.gravity[idx] = gravity;
    this.flicker[idx] = flicker;

    return idx;
  }

  spawnCracklePops(x, y) {
    const popCount = 3 + Math.floor(Math.random() * 3);
    for (let k = 0; k < popCount; k++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 80;
      // White crackle pop: colorId 6 (#F8FAFC)
      this.spawn(
        x + (Math.random() - 0.5) * 8,
        y + (Math.random() - 0.5) * 8,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        6,
        0.18 + Math.random() * 0.12,
        1.6,
        PARTICLE_TYPES.CRACKLE_POP,
        0.88,
        40,
        18.0
      );
    }
  }

  update(dt) {
    const timeStepRatio = dt * 60;
    const dragCache = {};

    for (let i = 0; i < this.activeCount; i++) {
      const idx = this.activeIndices[i];

      this.life[idx] += dt;
      const currentLife = this.life[idx];
      const maxL = this.maxLife[idx];

      if (currentLife >= maxL) {
        // Trigger crackle pop when crackle-pre spark ends
        if (this.type[idx] === PARTICLE_TYPES.CRACKLE_PRE && !this.isReducedMotion) {
          this.spawnCracklePops(this.x[idx], this.y[idx]);
        }

        // Deactivate particle by swapping with last active
        this.activeCount--;
        const lastIdx = this.activeIndices[this.activeCount];
        this.activeIndices[i] = lastIdx;
        this.activeIndices[this.activeCount] = idx;
        i--;
        continue;
      }

      // Physics integration with cached drag calculation
      const d = this.drag[idx];
      let dragFactor = dragCache[d];
      if (dragFactor === undefined) {
        dragFactor = Math.pow(d, timeStepRatio);
        dragCache[d] = dragFactor;
      }

      this.vx[idx] *= dragFactor;
      this.vy[idx] = this.vy[idx] * dragFactor + this.gravity[idx] * dt;

      this.x[idx] += this.vx[idx] * dt;
      this.y[idx] += this.vy[idx] * dt;
    }
  }

  draw(ctx, width, height, dt) {
    // Fade front canvas slightly each frame so sparks leave short glowing trails
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = this.isReducedMotion ? 'rgba(0, 0, 0, 0.40)' : 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(0, 0, width, height);

    // Draw sparks with 'lighter' blending so overlaps glow
    ctx.globalCompositeOperation = 'lighter';

    const isLowTier = this.qualityTier === 'low';
    let count0 = 0;
    let count1 = 0;
    let count2 = 0;

    for (let i = 0; i < this.activeCount; i++) {
      const idx = this.activeIndices[i];
      const progress = this.life[idx] / this.maxLife[idx];
      let alpha = 1.0 - progress;

      const flickSpeed = this.flicker[idx];
      if (flickSpeed > 0) {
        alpha *= (0.6 + 0.4 * Math.sin(this.life[idx] * flickSpeed));
      }

      if (alpha <= 0.08) continue;

      if (alpha >= 0.72) {
        this.bin2[count2++] = idx;
      } else if (alpha >= 0.35) {
        this.bin1[count1++] = idx;
      } else {
        this.bin0[count0++] = idx;
      }
    }

    if (isLowTier) {
      // Low quality tier: fast rect drawing for burst sparks
      for (let i = 0; i < count2; i++) {
        const idx = this.bin2[i];
        const half = this.size[idx] * 0.5;
        ctx.fillStyle = COLOR_ALPHA_LUT[this.colorId[idx]][20];
        ctx.fillRect(this.x[idx] - half, this.y[idx] - half, this.size[idx], this.size[idx]);
      }
      for (let i = 0; i < count1; i++) {
        const idx = this.bin1[i];
        const half = this.size[idx] * 0.5;
        ctx.fillStyle = COLOR_ALPHA_LUT[this.colorId[idx]][12];
        ctx.fillRect(this.x[idx] - half, this.y[idx] - half, this.size[idx], this.size[idx]);
      }
      for (let i = 0; i < count0; i++) {
        const idx = this.bin0[i];
        const half = this.size[idx] * 0.5;
        ctx.fillStyle = COLOR_ALPHA_LUT[this.colorId[idx]][5];
        ctx.fillRect(this.x[idx] - half, this.y[idx] - half, this.size[idx], this.size[idx]);
      }
    } else {
      // High and Medium tiers: glow sprite with batched alpha bins (only 3 state changes total)
      ctx.globalAlpha = 1.0;
      for (let i = 0; i < count2; i++) {
        const idx = this.bin2[i];
        const sprite = PALETTE_SPRITES[this.colorId[idx]] || PALETTE_SPRITES[0];
        const sz = this.size[idx] * 3.0;
        const half = sz * 0.5;
        ctx.drawImage(sprite, this.x[idx] - half, this.y[idx] - half, sz, sz);
      }

      ctx.globalAlpha = 0.62;
      for (let i = 0; i < count1; i++) {
        const idx = this.bin1[i];
        const sprite = PALETTE_SPRITES[this.colorId[idx]] || PALETTE_SPRITES[0];
        const sz = this.size[idx] * 2.7;
        const half = sz * 0.5;
        ctx.drawImage(sprite, this.x[idx] - half, this.y[idx] - half, sz, sz);
      }

      ctx.globalAlpha = 0.30;
      for (let i = 0; i < count0; i++) {
        const idx = this.bin0[i];
        const sprite = PALETTE_SPRITES[this.colorId[idx]] || PALETTE_SPRITES[0];
        const sz = this.size[idx] * 2.3;
        const half = sz * 0.5;
        ctx.drawImage(sprite, this.x[idx] - half, this.y[idx] - half, sz, sz);
      }
    }

    ctx.restore();
  }

  getActiveCount() {
    return this.activeCount;
  }

  clear() {
    this.activeCount = 0;
  }
}
