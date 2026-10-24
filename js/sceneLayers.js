// sceneLayers.js - Static pre-rendered offscreen canvases for City, Gopuram, and Rooftop Ledge

export const SCENE_COLORS = {
  layerFar: '#1E293B',
  layerMid: '#0F172A',
  layerNear: '#020617',
  mist: 'rgba(203, 213, 225, 0.06)',
  dimLayer: 'rgba(2, 6, 23, 0.6)',
  sparkGold: '#FCD34D',
  sparkAmber: '#FBBF24',
  sparkEmerald: '#34D399',
  sparkTeal: '#2DD4BF',
  sparkMint: '#A7F3D0'
};

/**
 * Creates the far city silhouette offscreen canvas (40px wider for parallax)
 */
export function createFarCityCanvas(width, height, dpr) {
  const layerWidth = width + 40;
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(layerWidth * dpr);
  canvas.height = Math.floor(height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const maxCityH = height * 0.18;
  const baseY = height - 16;
  const windows = [];

  ctx.fillStyle = SCENE_COLORS.layerFar;
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, baseY - 20);

  // Generate building skyline across layerWidth
  let curX = 0;
  while (curX < layerWidth) {
    const bWidth = 24 + Math.random() * 38;
    const bHeight = maxCityH * (0.35 + Math.random() * 0.60);
    const topY = baseY - bHeight;

    ctx.lineTo(curX, topY);
    ctx.lineTo(curX + bWidth, topY);

    // Seed windows for this building
    const cols = Math.floor(bWidth / 9);
    const rows = Math.floor(bHeight / 11);
    for (let r = 1; r < rows; r++) {
      for (let c = 1; c < cols; c++) {
        if (Math.random() < 0.28) {
          const wx = curX + c * 9;
          const wy = topY + r * 11;
          const baseAlpha = 0.30 + Math.random() * 0.30;
          windows.push({
            x: wx,
            y: wy,
            baseAlpha,
            flickerSpeed: 0.5 + Math.random() * 1.5,
            phase: Math.random() * Math.PI * 2
          });
        }
      }
    }

    curX += bWidth;
  }

  ctx.lineTo(layerWidth, baseY - 20);
  ctx.lineTo(layerWidth, height);
  ctx.closePath();
  ctx.fill();

  // Pre-render lit windows onto the canvas
  ctx.fillStyle = SCENE_COLORS.sparkGold;
  for (let i = 0; i < windows.length; i++) {
    const w = windows[i];
    ctx.globalAlpha = w.baseAlpha;
    ctx.fillRect(w.x, w.y, 1.8, 1.8);
  }
  ctx.globalAlpha = 1.0;

  return { canvas, windows, layerWidth };
}

/**
 * Creates the mid-ground temple gopuram and flanking houses offscreen canvas
 */
export function createMidGopuramCanvas(width, height, dpr) {
  const layerWidth = width + 40;
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(layerWidth * dpr);
  canvas.height = Math.floor(height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const isPhone = width < 600;
  const centerX = layerWidth * 0.5;
  const baseY = height - 20;

  // Gopuram dimensions: top must stay strictly below 62% screen height
  const maxTopY = height * 0.63;
  const towerHeight = Math.min(height * 0.32, baseY - maxTopY);
  const topY = baseY - towerHeight;

  const baseW = isPhone ? 116 : 170;
  const topW = isPhone ? 48 : 72;

  const festivalLights = [];
  const catenaryLights = [];
  const rimPoints = [];

  ctx.fillStyle = SCENE_COLORS.layerMid;

  // 1. Flanking flat-roof houses on left and right
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, baseY - 48);

  // Left houses
  const leftEnd = centerX - (baseW * 0.5) - 10;
  let hx = 0;
  const houseRooftops = [];

  while (hx < leftEnd) {
    const hw = 30 + Math.random() * 45;
    const hh = 38 + Math.random() * 32;
    const hy = baseY - hh;
    ctx.lineTo(hx, hy);
    ctx.lineTo(Math.min(hx + hw, leftEnd), hy);
    houseRooftops.push({ x1: hx, x2: Math.min(hx + hw, leftEnd), y: hy });
    hx += hw;
  }

  // 2. Gopuram tower silhouette (7 stacked tiers with niches, barrel top & 5 kalasams)
  const tierCount = 7;
  const tierH = (baseY - topY - 26) / tierCount;

  ctx.lineTo(centerX - baseW * 0.5, baseY);

  // Left edge of tiers ascending
  for (let t = 0; t < tierCount; t++) {
    const prog = t / tierCount;
    const nextProg = (t + 1) / tierCount;
    const curW = baseW - (baseW - topW) * prog;
    const nextW = baseW - (baseW - topW) * nextProg;

    const yBottom = baseY - t * tierH;
    const yTop = baseY - (t + 1) * tierH;

    const xL1 = centerX - curW * 0.5;
    const xL2 = centerX - nextW * 0.5;

    ctx.lineTo(xL1, yBottom);
    ctx.lineTo(xL1 + 3, yBottom - 2); // tier ledge cornice
    ctx.lineTo(xL2, yTop);

    rimPoints.push({ x: xL2, y: yTop });

    // Festival lights along tier cornice and edge
    festivalLights.push({ x: xL1, y: yBottom, phase: t * 0.8 });
    festivalLights.push({ x: xL2, y: yTop, phase: t * 0.8 + 0.4 });
    festivalLights.push({ x: centerX - curW * 0.25, y: yBottom - 2, phase: t * 0.5 });
  }

  // Barrel-shaped top roof (sala dome)
  const barrelW = topW * 1.08;
  const barrelTopY = topY + 10;
  ctx.lineTo(centerX - barrelW * 0.5, barrelTopY + 12);
  ctx.bezierCurveTo(
    centerX - barrelW * 0.5, barrelTopY,
    centerX - barrelW * 0.2, topY,
    centerX, topY
  );
  ctx.bezierCurveTo(
    centerX + barrelW * 0.2, topY,
    centerX + barrelW * 0.5, barrelTopY,
    centerX + barrelW * 0.5, barrelTopY + 12
  );

  rimPoints.push({ x: centerX, y: topY });

  // Right edge of tiers descending
  for (let t = tierCount - 1; t >= 0; t--) {
    const prog = (t + 1) / tierCount;
    const prevProg = t / tierCount;
    const curW = baseW - (baseW - topW) * prog;
    const nextW = baseW - (baseW - topW) * prevProg;

    const yTop = baseY - (t + 1) * tierH;
    const yBottom = baseY - t * tierH;

    const xR1 = centerX + curW * 0.5;
    const xR2 = centerX + nextW * 0.5;

    ctx.lineTo(xR1, yTop);
    ctx.lineTo(xR2 - 3, yBottom - 2);
    ctx.lineTo(xR2, yBottom);

    rimPoints.push({ x: xR1, y: yTop });

    festivalLights.push({ x: xR1, y: yTop, phase: t * 0.8 + 0.6 });
    festivalLights.push({ x: xR2, y: yBottom, phase: t * 0.8 + 0.2 });
    festivalLights.push({ x: centerX + nextW * 0.25, y: yBottom - 2, phase: t * 0.5 + 0.3 });
  }

  // Right houses
  const rightStart = centerX + (baseW * 0.5) + 10;
  ctx.lineTo(rightStart, baseY);
  hx = rightStart;

  while (hx < layerWidth) {
    const hw = 30 + Math.random() * 45;
    const hh = 36 + Math.random() * 32;
    const hy = baseY - hh;
    ctx.lineTo(hx, hy);
    ctx.lineTo(Math.min(hx + hw, layerWidth), hy);
    houseRooftops.push({ x1: hx, x2: Math.min(hx + hw, layerWidth), y: hy });
    hx += hw;
  }

  ctx.lineTo(layerWidth, height);
  ctx.closePath();
  ctx.fill();

  // 3. 5 Kalasam finials (pots) atop the barrel roof
  const kalasamCount = 5;
  const kalasamSpacing = (barrelW * 0.68) / (kalasamCount - 1);
  const kalasamStartX = centerX - (barrelW * 0.34);

  for (let k = 0; k < kalasamCount; k++) {
    const kx = kalasamStartX + k * kalasamSpacing;
    const isCenter = k === 2;
    const kh = isCenter ? 12 : 9;
    const kw = isCenter ? 4 : 3;

    ctx.beginPath();
    ctx.arc(kx, topY - kh * 0.5, kw, 0, Math.PI * 2);
    ctx.fill();

    // Tiny spire tip
    ctx.beginPath();
    ctx.moveTo(kx - 1, topY - kh * 0.5);
    ctx.lineTo(kx, topY - kh - 2);
    ctx.lineTo(kx + 1, topY - kh * 0.5);
    ctx.fill();

    festivalLights.push({ x: kx, y: topY - kh - 2, phase: k * 0.6, isApex: true });
  }

  // 4. Strings of festive lights (catenary curves) linking house rooftops
  for (let i = 0; i < houseRooftops.length - 1; i++) {
    const r1 = houseRooftops[i];
    const r2 = houseRooftops[i + 1];
    if (r2.x1 - r1.x2 > 60) continue; // skip gopuram gap

    const bulbCount = Math.floor((r2.x1 - r1.x2 + 20) / 8);
    for (let b = 0; b <= bulbCount; b++) {
      const u = b / Math.max(1, bulbCount);
      const bx = r1.x2 + (r2.x1 - r1.x2) * u;
      const sag = Math.sin(u * Math.PI) * 7;
      const by = (r1.y + (r2.y - r1.y) * u) + sag;
      const isGold = b % 2 === 0;
      catenaryLights.push({
        x: bx,
        y: by,
        colorHex: isGold ? SCENE_COLORS.sparkGold : SCENE_COLORS.sparkEmerald,
        phase: (i * 3 + b) * 0.4
      });
    }
  }

  // Pre-render festival lights onto gopuram canvas
  ctx.fillStyle = SCENE_COLORS.sparkGold;
  ctx.globalAlpha = 0.85;
  for (let i = 0; i < festivalLights.length; i++) {
    const fl = festivalLights[i];
    ctx.fillRect(fl.x - 1, fl.y - 1, fl.isApex ? 3 : 2, fl.isApex ? 3 : 2);
  }

  // Pre-render catenary lights linking rooftops
  for (let i = 0; i < catenaryLights.length; i++) {
    const cl = catenaryLights[i];
    ctx.fillStyle = cl.colorHex;
    ctx.globalAlpha = 0.90;
    ctx.fillRect(cl.x - 1, cl.y - 1, 2, 2);
  }
  ctx.globalAlpha = 1.0;

  return { canvas, festivalLights, catenaryLights, rimPoints, layerWidth };
}

/**
 * Creates the dark rooftop ledge offscreen canvas with clay diyas
 */
export function createFrontLedgeCanvas(width, height, dpr) {
  const layerWidth = width + 40;
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(layerWidth * dpr);
  canvas.height = Math.floor(height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const ledgeH = 38;
  const ledgeY = height - ledgeH;

  // Dark rooftop wall in --layer-near (#020617)
  ctx.fillStyle = SCENE_COLORS.layerNear;
  ctx.fillRect(0, ledgeY, layerWidth, ledgeH);

  // Subtle top lip/bevel highlight
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, ledgeY, layerWidth, 2);

  return { canvas, ledgeY, layerWidth };
}

/**
 * Creates 3 blurred horizontal mist bands for soft atmospheric drift
 */
export function createMistCanvases(width, height) {
  const bands = [];
  const bandHeights = [46, 58, 68];

  for (let i = 0; i < 3; i++) {
    const bh = bandHeights[i];
    const bw = width + 120;
    const canvas = document.createElement('canvas');
    canvas.width = bw;
    canvas.height = bh;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, bh);
    grad.addColorStop(0, 'rgba(203, 213, 225, 0)');
    grad.addColorStop(0.5, 'rgba(203, 213, 225, 0.07)');
    grad.addColorStop(1, 'rgba(203, 213, 225, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(bw * 0.5, bh * 0.5, bw * 0.5, bh * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();

    bands.push(canvas);
  }

  return bands;
}
