import { BackgroundOption, CapturedPhoto, FrameStyle, LayoutConfig, PhotoAdjustments, PlacedSticker, PlacedText } from '../types';
import { FONTS } from '../config/fonts';

export interface RenderOptions {
  photos: CapturedPhoto[];
  layout: LayoutConfig;
  frame: FrameStyle;
  background: BackgroundOption;
  customBgColor?: string;
  stickers: PlacedSticker[];
  texts: PlacedText[];
  adjustments: PhotoAdjustments;
  showDate?: boolean;
  dateText?: string;
  signatureText?: string;
  showSignature?: boolean;
  scale?: number; // default 2 or 3 for 300-DPI high res print
}

// Helper to load image as HTMLImageElement
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

export async function renderPhotoStripCanvas(options: RenderOptions): Promise<HTMLCanvasElement> {
  const {
    photos,
    layout,
    frame,
    background,
    customBgColor,
    stickers,
    texts,
    adjustments,
    showDate = true,
    dateText = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    signatureText = 'Photobooth by Zander',
    showSignature = true,
    scale = 2,
  } = options;

  // Pre-load all photo images
  const loadedImages: HTMLImageElement[] = await Promise.all(
    photos.map((p) => loadImage(p.dataUrl))
  );

  // Canvas dimensions based on layout type
  let baseWidth = 600;
  let baseHeight = 1800;

  if (layout.id === 'strip-4') {
    baseWidth = 500;
    baseHeight = 1750;
  } else if (layout.id === 'strip-3') {
    baseWidth = 500;
    baseHeight = 1350;
  } else if (layout.id === 'strip-2') {
    baseWidth = 500;
    baseHeight = 950;
  } else if (layout.id === 'strip-5') {
    baseWidth = 500;
    baseHeight = 2100;
  } else if (layout.id === 'strip-6') {
    baseWidth = 500;
    baseHeight = 2450;
  } else if (layout.id === 'grid-2x2') {
    baseWidth = 900;
    baseHeight = 960;
  } else if (layout.id === 'grid-3x3') {
    baseWidth = 900;
    baseHeight = 960;
  } else if (layout.id === 'grid-4x4') {
    baseWidth = 960;
    baseHeight = 1000;
  } else if (layout.id === 'polaroid') {
    baseWidth = 700;
    baseHeight = 860;
  } else if (layout.id === 'film') {
    baseWidth = 500;
    baseHeight = 1680;
  } else if (layout.id === 'magazine') {
    baseWidth = 750;
    baseHeight = 1000;
  } else if (layout.id === 'scrapbook') {
    baseWidth = 800;
    baseHeight = 1000;
  } else if (layout.id === 'postcard') {
    baseWidth = 1000;
    baseHeight = 680;
  } else if (layout.id === 'collage') {
    baseWidth = 800;
    baseHeight = 1000;
  } else if (layout.id === 'square') {
    baseWidth = 800;
    baseHeight = 800;
  } else if (layout.id === 'story') {
    baseWidth = 675;
    baseHeight = 1200;
  }

  const canvas = document.createElement('canvas');
  canvas.width = baseWidth * scale;
  canvas.height = baseHeight * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context could not be created');

  ctx.scale(scale, scale);

  // 1. Draw Background
  if (customBgColor) {
    ctx.fillStyle = customBgColor;
    ctx.fillRect(0, 0, baseWidth, baseHeight);
  } else if (background.type === 'solid') {
    ctx.fillStyle = background.value;
    ctx.fillRect(0, 0, baseWidth, baseHeight);
  } else if (background.type === 'gradient') {
    const grad = ctx.createLinearGradient(0, 0, baseWidth, baseHeight);
    if (background.id === 'grad-sunset') {
      grad.addColorStop(0, '#f43f5e');
      grad.addColorStop(1, '#fb923c');
    } else if (background.id === 'grad-cyber') {
      grad.addColorStop(0, '#06b6d4');
      grad.addColorStop(1, '#a855f7');
    } else if (background.id === 'grad-cotton-candy') {
      grad.addColorStop(0, '#fbcfe8');
      grad.addColorStop(1, '#c7d2fe');
    } else if (background.id === 'grad-aurora') {
      grad.addColorStop(0, '#10b981');
      grad.addColorStop(1, '#06b6d4');
    } else if (background.id === 'grad-dark-luxury') {
      grad.addColorStop(0, '#18181b');
      grad.addColorStop(0.5, '#27272a');
      grad.addColorStop(1, '#854d0e');
    } else {
      grad.addColorStop(0, '#ec4899');
      grad.addColorStop(1, '#f43f5e');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, baseWidth, baseHeight);
  } else if (background.type === 'pattern') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, baseWidth, baseHeight);
    // Polka dots
    ctx.fillStyle = 'rgba(236, 72, 153, 0.15)';
    const spacing = 24;
    for (let x = 12; x < baseWidth; x += spacing) {
      for (let y = 12; y < baseHeight; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Draw 35mm film perforations if film style
  if (frame.styleName === 'film') {
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    // Draw sprocket holes on left and right
    ctx.fillStyle = '#1e1e24';
    const holeW = 18;
    const holeH = 26;
    const holeRadius = 4;
    const holeSpacing = 38;

    for (let y = 20; y < baseHeight - 30; y += holeSpacing) {
      // Left sprocket
      drawRoundedRect(ctx, 10, y, holeW, holeH, holeRadius);
      ctx.fill();
      // Right sprocket
      drawRoundedRect(ctx, baseWidth - 28, y, holeW, holeH, holeRadius);
      ctx.fill();
    }
  }

  // Draw Neon Glow if neon frame
  if (frame.styleName === 'neon') {
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 6;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 18;
    ctx.strokeRect(12, 12, baseWidth - 24, baseHeight - 24);
    ctx.shadowBlur = 0; // reset
  }

  // Draw Holiday or Birthday special decals
  if (frame.styleName === 'birthday') {
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 8;
    ctx.strokeRect(12, 12, baseWidth - 24, baseHeight - 24);
  }

  // 2. Compute Photo Slot Rectangles
  const slots = getLayoutSlots(layout.id, baseWidth, baseHeight, frame);

  // Apply Adjustments CSS Filter string
  const adjFilterStr = computeAdjustmentsCssFilter(adjustments);

  // 3. Draw Photos in Slots
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const img = loadedImages[i % loadedImages.length];
    if (!img) continue;

    ctx.save();

    // Clip to rounded rectangle
    drawRoundedRect(ctx, slot.x, slot.y, slot.w, slot.h, slot.borderRadius);
    ctx.clip();

    // Set filter adjustments
    if (adjFilterStr && adjFilterStr !== 'none') {
      ctx.filter = adjFilterStr;
    }

    // Cover scale drawing (center crop)
    drawImageProp(ctx, img, slot.x, slot.y, slot.w, slot.h, 0.5, 0.5);

    ctx.filter = 'none';

    // Apply Vignette if adjustment > 0
    if (adjustments.vignette > 0) {
      const vGrad = ctx.createRadialGradient(
        slot.x + slot.w / 2,
        slot.y + slot.h / 2,
        Math.min(slot.w, slot.h) * 0.35,
        slot.x + slot.w / 2,
        slot.y + slot.h / 2,
        Math.hypot(slot.w / 2, slot.h / 2)
      );
      vGrad.addColorStop(0, 'rgba(0,0,0,0)');
      vGrad.addColorStop(1, `rgba(0,0,0,${(adjustments.vignette / 100) * 0.75})`);
      ctx.fillStyle = vGrad;
      ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
    }

    // Apply Film Grain if adjustment > 0
    if (adjustments.grain > 0) {
      drawGrainOverlay(ctx, slot.x, slot.y, slot.w, slot.h, adjustments.grain);
    }

    ctx.restore();

    // Slot border / stroke
    if (slot.strokeColor && slot.strokeWidth) {
      ctx.save();
      ctx.strokeStyle = slot.strokeColor;
      ctx.lineWidth = slot.strokeWidth;
      drawRoundedRect(ctx, slot.x, slot.y, slot.w, slot.h, slot.borderRadius);
      ctx.stroke();
      ctx.restore();
    }
  }

  // 4. Draw Header & Footer Text / Date / Signature
  ctx.save();
  if (layout.category === 'strip' || layout.id === 'polaroid' || layout.id === 'film') {
    const footerY = baseHeight - 34;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Footer signature
    if (showSignature && signatureText) {
      ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = frame.styleName === 'film' ? '#e2e8f0' : '#475569';
      ctx.fillText(signatureText, baseWidth / 2, footerY - 14);
    }

    // Date Text
    if (showDate && dateText) {
      ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = frame.styleName === 'film' ? '#94a3b8' : '#94a3b8';
      ctx.fillText(dateText, baseWidth / 2, footerY + 8);
    }
  } else if (layout.id === 'magazine') {
    // Top Magazine Banner
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 48px "Bebas Neue", sans-serif';
    ctx.fillText('PHOTOBOOTH', baseWidth / 2, 60);

    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.fillText('ISSUE #01 • SPECIAL EDITION', baseWidth / 2, 85);
  }
  ctx.restore();

  // 5. Draw Placed Custom Texts
  for (const t of texts) {
    ctx.save();
    const fontDef = FONTS.find((f) => f.id === t.fontId);
    const family = fontDef ? fontDef.cssFamily : 'sans-serif';
    const fontStyle = t.isItalic ? 'italic ' : '';
    const fontWeight = t.isBold ? '700 ' : '500 ';
    ctx.font = `${fontStyle}${fontWeight}${t.fontSize}px ${family}`;

    const posX = (t.x / 100) * baseWidth;
    const posY = (t.y / 100) * baseHeight;

    ctx.translate(posX, posY);
    if (t.rotation) {
      ctx.rotate((t.rotation * Math.PI) / 180);
    }
    ctx.textAlign = t.align;
    ctx.textBaseline = 'middle';

    if (t.hasShadow) {
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
    }

    if (t.hasOutline) {
      ctx.strokeStyle = t.outlineColor || '#000000';
      ctx.lineWidth = Math.max(3, Math.floor(t.fontSize / 8));
      ctx.strokeText(t.text, 0, 0);
    }

    ctx.fillStyle = t.color;
    ctx.fillText(t.text, 0, 0);

    ctx.restore();
  }

  // 6. Draw Placed Stickers
  for (const s of stickers) {
    ctx.save();
    const posX = (s.x / 100) * baseWidth;
    const posY = (s.y / 100) * baseHeight;

    ctx.translate(posX, posY);
    if (s.rotation) {
      ctx.rotate((s.rotation * Math.PI) / 180);
    }

    const baseStickerSize = 56;
    const size = baseStickerSize * s.scale;

    if (s.isEmoji) {
      ctx.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.content, 0, 0);
    }
    ctx.restore();
  }

  return canvas;
}

// Compute CSS filter string for 2D adjustments
function computeAdjustmentsCssFilter(adj: PhotoAdjustments): string {
  const parts: string[] = [];
  if (adj.brightness !== 0) parts.push(`brightness(${1 + adj.brightness / 100})`);
  if (adj.contrast !== 0) parts.push(`contrast(${1 + adj.contrast / 100})`);
  if (adj.saturation !== 0) parts.push(`saturate(${1 + adj.saturation / 100})`);
  if (adj.temperature !== 0) {
    if (adj.temperature > 0) {
      parts.push(`sepia(${adj.temperature * 0.4}%) hue-rotate(-${adj.temperature * 0.2}deg)`);
    } else {
      parts.push(`hue-rotate(${Math.abs(adj.temperature) * 0.3}deg)`);
    }
  }
  if (adj.blur > 0) parts.push(`blur(${adj.blur}px)`);
  return parts.length ? parts.join(' ') : 'none';
}

interface SlotRect {
  x: number;
  y: number;
  w: number;
  h: number;
  borderRadius: number;
  strokeColor?: string;
  strokeWidth?: number;
}

// Layout slot geometry calculation
function getLayoutSlots(layoutId: string, W: number, H: number, frame: FrameStyle): SlotRect[] {
  const slots: SlotRect[] = [];
  const bRadius = frame.borderRadius;
  const sColor = frame.styleName === 'neon' ? '#06b6d4' : undefined;
  const sWidth = frame.styleName === 'neon' ? 2 : undefined;

  if (layoutId.startsWith('strip-')) {
    const count = parseInt(layoutId.split('-')[1], 10) || 4;
    const sideMargin = frame.styleName === 'film' ? 44 : 26;
    const topMargin = frame.styleName === 'film' ? 34 : 28;
    const bottomMargin = 76; // room for logo & date footer
    const gap = frame.styleName === 'film' ? 18 : 16;

    const availableH = H - topMargin - bottomMargin - gap * (count - 1);
    const slotH = availableH / count;
    const slotW = W - sideMargin * 2;

    for (let i = 0; i < count; i++) {
      slots.push({
        x: sideMargin,
        y: topMargin + i * (slotH + gap),
        w: slotW,
        h: slotH,
        borderRadius: bRadius,
        strokeColor: sColor,
        strokeWidth: sWidth,
      });
    }
  } else if (layoutId === 'grid-2x2') {
    const margin = 32;
    const bottomMargin = 80;
    const gap = 16;
    const slotW = (W - margin * 2 - gap) / 2;
    const slotH = (H - margin - bottomMargin - gap) / 2;

    slots.push(
      { x: margin, y: margin, w: slotW, h: slotH, borderRadius: bRadius },
      { x: margin + slotW + gap, y: margin, w: slotW, h: slotH, borderRadius: bRadius },
      { x: margin, y: margin + slotH + gap, w: slotW, h: slotH, borderRadius: bRadius },
      { x: margin + slotW + gap, y: margin + slotH + gap, w: slotW, h: slotH, borderRadius: bRadius }
    );
  } else if (layoutId === 'grid-3x3') {
    const margin = 24;
    const bottomMargin = 70;
    const gap = 12;
    const slotW = (W - margin * 2 - gap * 2) / 3;
    const slotH = (H - margin - bottomMargin - gap * 2) / 3;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        slots.push({
          x: margin + c * (slotW + gap),
          y: margin + r * (slotH + gap),
          w: slotW,
          h: slotH,
          borderRadius: bRadius,
        });
      }
    }
  } else if (layoutId === 'grid-4x4') {
    const margin = 20;
    const bottomMargin = 60;
    const gap = 8;
    const slotW = (W - margin * 2 - gap * 3) / 4;
    const slotH = (H - margin - bottomMargin - gap * 3) / 4;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        slots.push({
          x: margin + c * (slotW + gap),
          y: margin + r * (slotH + gap),
          w: slotW,
          h: slotH,
          borderRadius: bRadius,
        });
      }
    }
  } else if (layoutId === 'polaroid') {
    const margin = 36;
    const topMargin = 36;
    const bottomChin = 140; // classic thick polaroid bottom
    const slotW = W - margin * 2;
    const slotH = H - topMargin - bottomChin;
    slots.push({
      x: margin,
      y: topMargin,
      w: slotW,
      h: slotH,
      borderRadius: 2,
    });
  } else if (layoutId === 'film') {
    const count = 4;
    const sideMargin = 46;
    const topMargin = 38;
    const bottomMargin = 72;
    const gap = 20;
    const availableH = H - topMargin - bottomMargin - gap * (count - 1);
    const slotH = availableH / count;
    const slotW = W - sideMargin * 2;
    for (let i = 0; i < count; i++) {
      slots.push({
        x: sideMargin,
        y: topMargin + i * (slotH + gap),
        w: slotW,
        h: slotH,
        borderRadius: 4,
      });
    }
  } else if (layoutId === 'magazine') {
    const topBanner = 100;
    const margin = 28;
    const bottomMargin = 32;
    const gap = 16;
    const mainW = (W - margin * 2 - gap) * 0.6;
    const sideW = W - margin * 2 - gap - mainW;
    const mainH = H - topBanner - bottomMargin;
    const sideH = (mainH - gap) / 2;

    slots.push(
      { x: margin, y: topBanner, w: mainW, h: mainH, borderRadius: 8 },
      { x: margin + mainW + gap, y: topBanner, w: sideW, h: sideH, borderRadius: 8 },
      { x: margin + mainW + gap, y: topBanner + sideH + gap, w: sideW, h: sideH, borderRadius: 8 }
    );
  } else if (layoutId === 'postcard') {
    const margin = 32;
    const gap = 20;
    const slotW = (W - margin * 2 - gap) / 2;
    const slotH = H - margin * 2;
    slots.push(
      { x: margin, y: margin, w: slotW, h: slotH, borderRadius: 6 },
      { x: margin + slotW + gap, y: margin, w: slotW, h: slotH, borderRadius: 6 }
    );
  } else if (layoutId === 'collage') {
    const margin = 24;
    const gap = 16;
    const leftW = (W - margin * 2 - gap) * 0.55;
    const rightW = W - margin * 2 - gap - leftW;
    const fullH = H - margin * 2;
    const rightH = (fullH - gap * 2) / 3;

    slots.push(
      { x: margin, y: margin, w: leftW, h: fullH, borderRadius: 8 },
      { x: margin + leftW + gap, y: margin, w: rightW, h: rightH, borderRadius: 8 },
      { x: margin + leftW + gap, y: margin + rightH + gap, w: rightW, h: rightH, borderRadius: 8 },
      { x: margin + leftW + gap, y: margin + (rightH + gap) * 2, w: rightW, h: rightH, borderRadius: 8 }
    );
  } else {
    // Default single / square / story
    const margin = 32;
    const bottomMargin = 60;
    slots.push({
      x: margin,
      y: margin,
      w: W - margin * 2,
      h: H - margin - bottomMargin,
      borderRadius: bRadius,
    });
  }

  return slots;
}

// Rounded rectangle path helper
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Proportional image crop / cover helper
function drawImageProp(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  offsetX: number = 0.5,
  offsetY: number = 0.5
) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const r = Math.min(w / iw, h / ih);
  let nw = iw * r;
  let nh = ih * r;
  let cx = 1;
  let cy = 1;
  let cw = 1;
  let ch = 1;
  let ar = 1;

  // Decide which gap to fill
  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
  nw *= ar;
  nh *= ar;

  // Source clipping
  cw = iw / (nw / w);
  ch = ih / (nh / h);
  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

// Film grain noise pattern
function drawGrainOverlay(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  intensity: number
) {
  const grainCanvas = document.createElement('canvas');
  grainCanvas.width = 120;
  grainCanvas.height = 120;
  const gCtx = grainCanvas.getContext('2d');
  if (!gCtx) return;

  const imgData = gCtx.createImageData(120, 120);
  const data = imgData.data;
  const alpha = Math.floor((intensity / 100) * 80);

  for (let i = 0; i < data.length; i += 4) {
    const val = Math.random() * 255;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = alpha;
  }
  gCtx.putImageData(imgData, 0, 0);

  ctx.save();
  ctx.fillStyle = ctx.createPattern(grainCanvas, 'repeat')!;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}
