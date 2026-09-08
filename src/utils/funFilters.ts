// Pixel & Canvas transformations for Fun Filters

export function applyFunFilterToCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  effectType: 'bighead' | 'smallface' | 'fisheye' | 'mirror' | 'kaleidoscope' | 'pixelate' | 'cartoon' | 'wave'
) {
  if (effectType === 'mirror') {
    // Horizontal left-half mirrored to right-half
    const halfWidth = Math.floor(width / 2);
    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(ctx.canvas, 0, 0, halfWidth, height, 0, 0, halfWidth, height);
    ctx.restore();
    return;
  }

  if (effectType === 'kaleidoscope') {
    // 4-way quadrant reflection
    const halfW = Math.floor(width / 2);
    const halfH = Math.floor(height / 2);

    // Save top-left quadrant
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = halfW;
    tempCanvas.height = halfH;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    tempCtx.drawImage(ctx.canvas, 0, 0, halfW, halfH, 0, 0, halfW, halfH);

    // Draw top-right (mirrored horizontally)
    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();

    // Draw bottom-left (mirrored vertically)
    ctx.save();
    ctx.translate(0, height);
    ctx.scale(1, -1);
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();

    // Draw bottom-right (mirrored both)
    ctx.save();
    ctx.translate(width, height);
    ctx.scale(-1, -1);
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();
    return;
  }

  // Pixel-level manipulations
  try {
    const srcData = ctx.getImageData(0, 0, width, height);
    const src = srcData.data;
    const outData = ctx.createImageData(width, height);
    const dst = outData.data;

    const cx = width / 2;
    const cy = height / 2;

    if (effectType === 'pixelate') {
      const pixelSize = Math.max(6, Math.floor(width / 60));
      for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
          const px = Math.min(x + Math.floor(pixelSize / 2), width - 1);
          const py = Math.min(y + Math.floor(pixelSize / 2), height - 1);
          const i = (py * width + px) * 4;
          const r = src[i];
          const g = src[i + 1];
          const b = src[i + 2];
          const a = src[i + 3];

          for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
            for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
              const di = ((y + dy) * width + (x + dx)) * 4;
              dst[di] = r;
              dst[di + 1] = g;
              dst[di + 2] = b;
              dst[di + 3] = a;
            }
          }
        }
      }
      ctx.putImageData(outData, 0, 0);
      return;
    }

    if (effectType === 'fisheye') {
      const maxR = Math.hypot(cx, cy);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - cx;
          const dy = y - cy;
          const r = Math.hypot(dx, dy);
          if (r === 0) {
            const idx = (y * width + x) * 4;
            dst[idx] = src[idx];
            dst[idx + 1] = src[idx + 1];
            dst[idx + 2] = src[idx + 2];
            dst[idx + 3] = src[idx + 3];
            continue;
          }

          const normR = r / maxR;
          const warpedR = Math.pow(normR, 1.8) * maxR;
          const factor = warpedR / r;
          const srcX = Math.round(cx + dx * factor);
          const srcY = Math.round(cy + dy * factor);

          const dstIdx = (y * width + x) * 4;
          if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
            const srcIdx = (srcY * width + srcX) * 4;
            dst[dstIdx] = src[srcIdx];
            dst[dstIdx + 1] = src[srcIdx + 1];
            dst[dstIdx + 2] = src[srcIdx + 2];
            dst[dstIdx + 3] = src[srcIdx + 3];
          }
        }
      }
      ctx.putImageData(outData, 0, 0);
      return;
    }

    if (effectType === 'bighead') {
      // Bulge upper-center (face/head area)
      const headCy = cy * 0.75;
      const radius = Math.min(width, height) * 0.45;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - cx;
          const dy = y - headCy;
          const dist = Math.hypot(dx, dy);

          const dstIdx = (y * width + x) * 4;
          if (dist < radius) {
            const norm = dist / radius;
            const factor = Math.sin((norm * Math.PI) / 2);
            const srcX = Math.round(cx + dx * factor * 0.7);
            const srcY = Math.round(headCy + dy * factor * 0.7);

            if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
              const srcIdx = (srcY * width + srcX) * 4;
              dst[dstIdx] = src[srcIdx];
              dst[dstIdx + 1] = src[srcIdx + 1];
              dst[dstIdx + 2] = src[srcIdx + 2];
              dst[dstIdx + 3] = src[srcIdx + 3];
              continue;
            }
          }
          const srcIdx = (y * width + x) * 4;
          dst[dstIdx] = src[srcIdx];
          dst[dstIdx + 1] = src[srcIdx + 1];
          dst[dstIdx + 2] = src[srcIdx + 2];
          dst[dstIdx + 3] = src[srcIdx + 3];
        }
      }
      ctx.putImageData(outData, 0, 0);
      return;
    }

    if (effectType === 'smallface') {
      // Pinch center
      const radius = Math.min(width, height) * 0.45;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.hypot(dx, dy);

          const dstIdx = (y * width + x) * 4;
          if (dist < radius) {
            const norm = dist / radius;
            const factor = Math.pow(norm, 0.6);
            const srcX = Math.round(cx + (dx / norm) * factor * radius);
            const srcY = Math.round(cy + (dy / norm) * factor * radius);

            if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
              const srcIdx = (srcY * width + srcX) * 4;
              dst[dstIdx] = src[srcIdx];
              dst[dstIdx + 1] = src[srcIdx + 1];
              dst[dstIdx + 2] = src[srcIdx + 2];
              dst[dstIdx + 3] = src[srcIdx + 3];
              continue;
            }
          }
          const srcIdx = (y * width + x) * 4;
          dst[dstIdx] = src[srcIdx];
          dst[dstIdx + 1] = src[srcIdx + 1];
          dst[dstIdx + 2] = src[srcIdx + 2];
          dst[dstIdx + 3] = src[srcIdx + 3];
        }
      }
      ctx.putImageData(outData, 0, 0);
      return;
    }

    if (effectType === 'wave') {
      // Sine wave distortion
      const waveFreq = 0.04;
      const waveAmp = 15;
      for (let y = 0; y < height; y++) {
        const offset = Math.sin(y * waveFreq) * waveAmp;
        for (let x = 0; x < width; x++) {
          const srcX = Math.round(x + offset);
          const dstIdx = (y * width + x) * 4;
          if (srcX >= 0 && srcX < width) {
            const srcIdx = (y * width + srcX) * 4;
            dst[dstIdx] = src[srcIdx];
            dst[dstIdx + 1] = src[srcIdx + 1];
            dst[dstIdx + 2] = src[srcIdx + 2];
            dst[dstIdx + 3] = src[srcIdx + 3];
          }
        }
      }
      ctx.putImageData(outData, 0, 0);
      return;
    }

    if (effectType === 'cartoon') {
      // Posterization / color banding
      const levels = 5;
      const step = 255 / (levels - 1);
      for (let i = 0; i < src.length; i += 4) {
        dst[i] = Math.round(src[i] / step) * step;
        dst[i + 1] = Math.round(src[i + 1] / step) * step;
        dst[i + 2] = Math.round(src[i + 2] / step) * step;
        dst[i + 3] = src[i + 3];
      }
      ctx.putImageData(outData, 0, 0);
      return;
    }
  } catch (e) {
    console.error('Fun filter processing error', e);
  }
}
