// sprites.js - Pre-rendered glow sprites for realistic firework sparks and smooth name gradients

export const SPRITE_SIZE = 64;
const HALF_SIZE = SPRITE_SIZE / 2;

// Section 5 palette definitions
export const PALETTE_RGB = [
  { r: 52,  g: 211, b: 153, hex: '#34D399' }, // 0: emerald
  { r: 45,  g: 212, b: 191, hex: '#2DD4BF' }, // 1: teal
  { r: 34,  g: 211, b: 238, hex: '#22D3EE' }, // 2: cyan
  { r: 167, g: 243, b: 208, hex: '#A7F3D0' }, // 3: mint
  { r: 252, g: 211, b: 77,  hex: '#FCD34D' }, // 4: gold
  { r: 251, g: 191, b: 36,  hex: '#FBBF24' }, // 5: amber
  { r: 248, g: 250, b: 252, hex: '#F8FAFC' }  // 6: white
];

// Helper to render one 64x64 glow sprite onto an offscreen canvas
function createGlowSprite(r, g, b) {
  const canvas = document.createElement('canvas');
  canvas.width = SPRITE_SIZE;
  canvas.height = SPRITE_SIZE;
  const ctx = canvas.getContext('2d');

  // Radial gradient:
  // Center: --spark-white at full strength
  // Middle (~30% out, r = 9.6px): the spark color
  // Edge (100%, r = 32px): fully transparent
  const grad = ctx.createRadialGradient(
    HALF_SIZE, HALF_SIZE, 0,
    HALF_SIZE, HALF_SIZE, HALF_SIZE
  );

  grad.addColorStop(0.00, 'rgba(248, 250, 252, 1.0)');
  grad.addColorStop(0.18, `rgba(${r}, ${g}, ${b}, 1.0)`);
  grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, 0.85)`);
  grad.addColorStop(0.70, `rgba(${r}, ${g}, ${b}, 0.25)`);
  grad.addColorStop(1.00, `rgba(${r}, ${g}, ${b}, 0.0)`);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

  return canvas;
}

// 1. Palette glow sprites (one per color ID 0..6)
export const PALETTE_SPRITES = PALETTE_RGB.map(c => createGlowSprite(c.r, c.g, c.b));

// 2. Smooth name gradient: 16 sprites blending from emerald (#34D399) to teal (#2DD4BF) to cyan (#22D3EE)
export const NAME_GRADIENT_STEPS = 16;
export const NAME_GRADIENT_SPRITES = [];

for (let i = 0; i < NAME_GRADIENT_STEPS; i++) {
  const u = i / (NAME_GRADIENT_STEPS - 1);
  let r, g, b;

  if (u < 0.5) {
    // Emerald to Teal
    const t = u / 0.5;
    r = Math.round(52 + (45 - 52) * t);
    g = Math.round(211 + (212 - 211) * t);
    b = Math.round(153 + (191 - 153) * t);
  } else {
    // Teal to Cyan
    const t = (u - 0.5) / 0.5;
    r = Math.round(45 + (34 - 45) * t);
    g = Math.round(212 + (211 - 212) * t);
    b = Math.round(191 + (238 - 191) * t);
  }

  NAME_GRADIENT_SPRITES.push(createGlowSprite(r, g, b));
}

// Gold glint sprite (spark-gold)
export const GLINT_SPRITE = PALETTE_SPRITES[4];

/**
 * Returns the glow sprite for a palette color ID
 * @param {number} colorId
 * @returns {HTMLCanvasElement}
 */
export function getPaletteSprite(colorId) {
  return PALETTE_SPRITES[colorId] || PALETTE_SPRITES[0];
}

/**
 * Returns the interpolated name gradient sprite for u in [0, 1]
 * @param {number} u
 * @returns {HTMLCanvasElement}
 */
export function getNameGradientSprite(u) {
  const clampedU = Math.min(1.0, Math.max(0.0, u));
  const idx = Math.min(NAME_GRADIENT_STEPS - 1, Math.floor(clampedU * NAME_GRADIENT_STEPS));
  return NAME_GRADIENT_SPRITES[idx];
}
