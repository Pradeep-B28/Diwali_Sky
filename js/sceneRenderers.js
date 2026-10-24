// sceneRenderers.js - Dynamic rendering passes for Atmosphere, Lanterns, Burst Lights, Diyas, and Embers

import { SCENE_COLORS } from './sceneLayers.js';

// Pre-rendered offscreen lantern sprite (32x40)
const lanternCanvas = document.createElement('canvas');
lanternCanvas.width = 32;
lanternCanvas.height = 40;
const lctx = lanternCanvas.getContext('2d');
const lgrad = lctx.createLinearGradient(0, 0, 0, 40);
lgrad.addColorStop(0.0, SCENE_COLORS.sparkAmber);
lgrad.addColorStop(1.0, SCENE_COLORS.sparkGold);
lctx.fillStyle = lgrad;
lctx.beginPath();
lctx.roundRect(0, 0, 32, 40, 5);
lctx.fill();
lctx.fillStyle = '#FFFFFF';
lctx.globalAlpha = 0.85;
lctx.beginPath();
lctx.ellipse(16, 24, 7, 7, 0, 0, Math.PI * 2);
lctx.fill();

// Pre-rendered 256x256 radial glow canvases for burst lighting
const BURST_LIGHT_CANVASES = [
  '#34D399', '#2DD4BF', '#22D3EE', '#A7F3D0', '#FCD34D', '#FBBF24', '#F8FAFC'
].map(hex => {
  const cnv = document.createElement('canvas');
  cnv.width = 256;
  cnv.height = 256;
  const cctx = cnv.getContext('2d');
  const g = cctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0.0, hex);
  g.addColorStop(0.35, hex);
  g.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  cctx.fillStyle = g;
  cctx.fillRect(0, 0, 256, 256);
  return cnv;
});

export function createStars(width, height) {
  const count = width < 600 ? 120 : 200;
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * (height * 0.82),
      r: 0.6 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      speed: 0.7 + Math.random() * 1.5
    });
  }
  return stars;
}

export function createMilkyWayStars(width, height) {
  const count = width < 600 ? 140 : 260;
  const stars = [];
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    const spread = (Math.random() - 0.5) * (width * 0.22);
    stars.push({
      x: t * width + spread,
      y: (1.0 - t) * (height * 0.75) + spread * 0.5,
      r: 0.4 + Math.random() * 0.5,
      alpha: 0.08 + Math.random() * 0.14
    });
  }
  return stars;
}

export function createDiyas(width, height) {
  let count = 5;
  if (width >= 800) count = 9;
  else if (width >= 480) count = 7;

  const margin = Math.max(30, width * 0.08);
  const spacing = count > 1 ? (width - margin * 2) / (count - 1) : 0;
  const baseY = height - 28;

  const diyas = [];
  for (let i = 0; i < count; i++) {
    diyas.push({
      x: count === 1 ? width / 2 : margin + i * spacing,
      y: baseY,
      bowlW: 36,
      bowlH: 18,
      flameW: 13,
      flameH: 24,
      phase: i * 1.4
    });
  }
  return diyas;
}

export function createLanternItem(width, height, isReducedMotion, randomY = false) {
  const depth = Math.random();
  return {
    x: width * (0.05 + Math.random() * 0.90),
    y: randomY ? height * (0.15 + Math.random() * 0.85) : height + 20 + Math.random() * 80,
    w: 12 + depth * 14,
    h: 16 + depth * 18,
    speedY: (14 + depth * 18) * (isReducedMotion ? 0.5 : 1.0),
    swaySpeed: 1.0 + Math.random() * 1.4,
    swayAmp: 10 + depth * 14,
    phase: Math.random() * Math.PI * 2,
    depth,
    alpha: 0.55 + depth * 0.45
  };
}

export function createEmberItem(diyas, randomY = false) {
  if (!diyas || !diyas.length) return null;
  const diya = diyas[Math.floor(Math.random() * diyas.length)];
  return {
    x: diya.x + (Math.random() - 0.5) * 16,
    y: randomY ? diya.y - Math.random() * 100 : diya.y - 10,
    vx: (Math.random() - 0.5) * 14,
    vy: -(16 + Math.random() * 26),
    life: randomY ? Math.random() * 2.5 : 0,
    maxLife: 2.0 + Math.random() * 1.5,
    r: 0.8 + Math.random() * 0.8
  };
}

export function drawSkyAtmosphere(ctx, scene, time) {
  // Stars twinkling
  ctx.save();
  ctx.fillStyle = '#E2E8F0';
  for (let i = 0; i < scene.stars.length; i++) {
    const s = scene.stars[i];
    const a = 0.35 + 0.45 * Math.sin(s.phase + time * s.speed);
    ctx.globalAlpha = Math.max(0.1, a);
    ctx.fillRect(s.x, s.y, s.r, s.r);
  }
  ctx.restore();

  // Shooting star
  if (scene.shootingStar) {
    const ss = scene.shootingStar;
    const sx = ss.startX + ss.vx * (ss.progress * ss.duration);
    const sy = ss.startY + ss.vy * (ss.progress * ss.duration);
    ctx.save();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(sx - (ss.vx * 0.07), sy - (ss.vy * 0.07));
    ctx.lineTo(sx, sy);
    ctx.stroke();
    ctx.restore();
  }
}

export function drawLanterns(ctx, lanterns, isHold, nameBounds) {
  ctx.save();
  for (let i = 0; i < lanterns.length; i++) {
    const l = lanterns[i];
    const sway = Math.sin(l.phase) * l.swayAmp;
    const lx = l.x + sway;
    const ly = l.y;

    let alpha = l.alpha;
    // Dodge name area during hold
    if (isHold && nameBounds) {
      if (ly > nameBounds.minY - 24 && ly < nameBounds.maxY + 24 &&
          lx > nameBounds.minX - 24 && lx < nameBounds.maxX + 24) {
        alpha *= 0.12;
      }
    }

    ctx.globalAlpha = alpha;
    ctx.drawImage(lanternCanvas, lx - l.w * 0.5, ly - l.h * 0.5, l.w, l.h);
  }
  ctx.restore();
}

export function drawBurstLighting(ctx, activeLights, width, midGopuram, midShift) {
  if (activeLights.length === 0) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  for (let i = 0; i < activeLights.length; i++) {
    const l = activeLights[i];
    const rad = Math.max(340, width * 0.45);
    const cnv = BURST_LIGHT_CANVASES[l.colorId] || BURST_LIGHT_CANVASES[0];
    ctx.globalAlpha = l.strength * 0.22;
    ctx.drawImage(cnv, l.x - rad, l.y - rad, rad * 2, rad * 2);
  }

  // Thin rim light in --spark-teal (up to 30% strength)
  if (midGopuram && midGopuram.rimPoints.length > 0) {
    const totalStrength = activeLights.reduce((acc, l) => acc + l.strength, 0);
    const rimAlpha = Math.min(0.30, totalStrength * 0.15);
    if (rimAlpha > 0.02) {
      ctx.strokeStyle = SCENE_COLORS.sparkTeal;
      ctx.lineWidth = 1.8;
      ctx.globalAlpha = rimAlpha;
      ctx.beginPath();
      for (let p = 0; p < midGopuram.rimPoints.length; p++) {
        const pt = midGopuram.rimPoints[p];
        const px = -20 + midShift + pt.x;
        if (p === 0) ctx.moveTo(px, pt.y);
        else ctx.lineTo(px, pt.y);
      }
      ctx.stroke();
    }
  }
  ctx.restore();
}

export function drawDiyas(ctx, diyas, frontShift, time) {
  ctx.save();
  for (let i = 0; i < diyas.length; i++) {
    const d = diyas[i];
    const dx = d.x + frontShift;
    const dy = d.y;

    // Warm reflection on rooftop ledge
    ctx.fillStyle = 'rgba(251, 191, 36, 0.22)';
    ctx.beginPath();
    ctx.ellipse(dx, dy + 6, 24, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Clay bowl (rounded bottom)
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.ellipse(dx, dy, d.bowlW * 0.5, d.bowlH * 0.5, 0, 0, Math.PI);
    ctx.fill();

    // Emerald rim
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(dx, dy, d.bowlW * 0.5, 3, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Flickering flame
    const flick = Math.sin(time * 7 + d.phase) * 1.5;
    const flameH = d.flameH + flick;
    const flameW = d.flameW + Math.cos(time * 6 + d.phase) * 1.0;

    // Flame glow
    ctx.fillStyle = 'rgba(252, 211, 77, 0.25)';
    ctx.beginPath();
    ctx.arc(dx, dy - flameH * 0.5, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = SCENE_COLORS.sparkGold;
    ctx.beginPath();
    ctx.moveTo(dx - flameW * 0.5, dy);
    ctx.bezierCurveTo(dx - flameW * 0.5, dy - flameH * 0.5, dx, dy - flameH * 0.8, dx, dy - flameH);
    ctx.bezierCurveTo(dx, dy - flameH * 0.8, dx + flameW * 0.5, dy - flameH * 0.5, dx + flameW * 0.5, dy);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}
