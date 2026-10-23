// nameText.js - Converts a name into target firework spark points

export function generateNamePoints(name, screenWidth, screenHeight) {
  const isPortrait = screenWidth < screenHeight;
  const isPhone = screenWidth < 600;

  // Target point budgets from brief Section 4C and Section 8 Check 1
  const minBudget = isPhone ? 650 : 1000;
  const maxBudget = isPhone ? 1750 : 2900;

  // Maximum bounding box (86% of width, 30% of height)
  const maxAllowedWidth = screenWidth * 0.86;
  const maxAllowedHeight = screenHeight * 0.30;

  // Vertical placement: upper middle (about 38% from top)
  const targetCenterY = screenHeight * 0.38;
  const targetCenterX = screenWidth * 0.50;

  // Split into two lines on portrait if name has a space and single line is wide
  let lines = [name.trim()];
  if (isPortrait && name.trim().includes(' ')) {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      // Find space nearest the middle
      let bestSplit = 1;
      let minDiff = Infinity;
      const fullLen = name.trim().length;

      let running = 0;
      for (let i = 0; i < words.length - 1; i++) {
        running += words[i].length;
        const diff = Math.abs(running - (fullLen / 2));
        if (diff < minDiff) {
          minDiff = diff;
          bestSplit = i + 1;
        }
        running += 1; // space
      }

      const line1 = words.slice(0, bestSplit).join(' ');
      const line2 = words.slice(bestSplit).join(' ');
      lines = [line1, line2];
    }
  }

  // Create offscreen sampling canvas
  const canvas = document.createElement('canvas');
  canvas.width = screenWidth;
  canvas.height = screenHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  const fontStack = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

  // Find optimal font size to fit within maxAllowedWidth and maxAllowedHeight
  let fontSize = isPhone ? 72 : 120;
  const minFontSize = 26;
  const maxFontSize = isPhone ? 96 : 140;

  for (let sz = maxFontSize; sz >= minFontSize; sz -= 2) {
    ctx.font = `800 ${sz}px ${fontStack}`;
    let fits = true;
    let totalTextHeight = lines.length * (sz * 1.15);

    if (totalTextHeight > maxAllowedHeight) {
      continue;
    }

    for (let l = 0; l < lines.length; l++) {
      const w = ctx.measureText(lines[l]).width;
      if (w > maxAllowedWidth) {
        fits = false;
        break;
      }
    }

    if (fits) {
      fontSize = sz;
      break;
    }
  }

  // Render text to offscreen canvas
  ctx.clearRect(0, 0, screenWidth, screenHeight);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 ${fontSize}px ${fontStack}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lineHeight = fontSize * 1.15;
  const totalH = lines.length * lineHeight;
  const startY = targetCenterY - (totalH * 0.5) + (lineHeight * 0.5);

  for (let l = 0; l < lines.length; l++) {
    ctx.fillText(lines[l], targetCenterX, startY + l * lineHeight);
  }

  // Read pixel buffer
  const imgData = ctx.getImageData(0, 0, screenWidth, screenHeight);
  const data = imgData.data;

  // First pass: locate bounding box of filled pixels
  let minX = screenWidth;
  let maxX = 0;
  let minY = screenHeight;
  let maxY = 0;
  let totalSolidPixels = 0;

  for (let y = 0; y < screenHeight; y += 2) {
    for (let x = 0; x < screenWidth; x += 2) {
      const alpha = data[(y * screenWidth + x) * 4 + 3];
      if (alpha > 120) {
        totalSolidPixels++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (totalSolidPixels === 0) {
    minX = targetCenterX - 50;
    maxX = targetCenterX + 50;
    minY = targetCenterY - 20;
    maxY = targetCenterY + 20;
  }

  // Calculate sampling step to target point budget
  const targetCount = isPhone ? 1100 : 2100;
  let step = Math.max(1, Math.round(Math.sqrt((totalSolidPixels * 4) / targetCount)));

  function samplePoints(currentStep) {
    const pts = [];
    const textWidth = Math.max(1, maxX - minX);

    for (let y = minY; y <= maxY; y += currentStep) {
      for (let x = minX; x <= maxX; x += currentStep) {
        const idx = (y * screenWidth + x) * 4;
        const alpha = data[idx + 3];

        if (alpha > 120) {
          const u = Math.min(1.0, Math.max(0.0, (x - minX) / textWidth));

          // Color assignment: Wrench Wise gradient across the name
          // Left: Emerald (#34D399, id 0), Mid: Teal (#2DD4BF, id 1), Right: Cyan (#22D3EE, id 2)
          // 1 in 10 is gold glint (#FCD34D, id 4)
          const isGlint = Math.random() < 0.10;
          let colorId = 0;

          if (isGlint) {
            colorId = 4; // Gold glint
          } else if (u < 0.38) {
            colorId = 0; // Emerald
          } else if (u < 0.68) {
            colorId = 1; // Teal
          } else {
            colorId = 2; // Cyan
          }

          pts.push({
            targetX: x,
            targetY: y,
            u,
            colorId,
            isGlint,
            size: isPhone ? (2.1 + Math.random() * 0.7) : (2.4 + Math.random() * 0.8)
          });
        }
      }
    }
    return pts;
  }

  let sampled = samplePoints(step);

  // If too few points (e.g. single short letter "A"), decrease step
  while (sampled.length < minBudget && step > 1) {
    step--;
    sampled = samplePoints(step);
  }

  // If still below minimum budget (e.g. single thin character "A" on laptop),
  // inject jittered sub-samples inside filled region
  if (sampled.length < minBudget) {
    const needed = minBudget - sampled.length;
    const existingLen = sampled.length;
    for (let k = 0; k < needed; k++) {
      const src = sampled[k % existingLen];
      const offsetX = (Math.random() - 0.5) * (step * 0.9);
      const offsetY = (Math.random() - 0.5) * (step * 0.9);
      sampled.push({
        targetX: src.targetX + offsetX,
        targetY: src.targetY + offsetY,
        u: src.u,
        colorId: Math.random() < 0.1 ? 4 : src.colorId,
        isGlint: Math.random() < 0.1,
        size: src.size
      });
    }
  }

  // If too many points (exceeds maximum budget), increase step or downsample
  if (sampled.length > maxBudget) {
    const keepRatio = maxBudget / sampled.length;
    sampled = sampled.filter(() => Math.random() < keepRatio);
  }

  // Verify all points are within screen bounds
  sampled = sampled.filter(p => p.targetX >= 0 && p.targetX < screenWidth && p.targetY >= 0 && p.targetY < screenHeight);

  return {
    name,
    points: sampled,
    count: sampled.length,
    fontSize,
    bounds: {
      minX,
      maxX,
      minY,
      maxY,
      centerX: (minX + maxX) * 0.5,
      centerY: (minY + maxY) * 0.5
    }
  };
}

export function sampleNamePoints(name, screenWidth, screenHeight) {
  const result = generateNamePoints(name, screenWidth, screenHeight);
  return result.points.map(p => ({
    x: p.targetX,
    y: p.targetY,
    u: p.u,
    colorId: p.colorId,
    isGlint: p.isGlint,
    size: p.size
  }));
}
