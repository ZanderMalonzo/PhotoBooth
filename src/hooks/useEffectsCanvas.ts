import { useEffect, useRef } from 'react';
import { EffectType } from '../types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  rotation: number;
  vRot: number;
  color?: string;
  char?: string;
  wobble?: number;
  wobbleSpeed?: number;
}

export function useEffectsCanvas(activeEffects: EffectType[]) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeEffects.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: { [key in EffectType]?: Particle[] } = {};

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles for active effects
    const initParticles = () => {
      particles = {};
      const W = canvas.width || 400;
      const H = canvas.height || 400;

      if (activeEffects.includes('hearts')) {
        particles.hearts = Array.from({ length: 18 }, () => ({
          x: Math.random() * W,
          y: H + Math.random() * 60,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(Math.random() * 2 + 1.5),
          size: Math.random() * 20 + 16,
          alpha: Math.random() * 0.7 + 0.3,
          rotation: (Math.random() - 0.5) * 0.4,
          vRot: (Math.random() - 0.5) * 0.02,
          char: ['💖', '💕', '💗', '🌸'][Math.floor(Math.random() * 4)],
        }));
      }

      if (activeEffects.includes('sparkles') || activeEffects.includes('glitter')) {
        const count = activeEffects.includes('glitter') ? 50 : 25;
        particles.sparkles = Array.from({ length: count }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(Math.random() * 0.8 + 0.2),
          size: Math.random() * 8 + 4,
          alpha: Math.random(),
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.1,
          color: ['#fef08a', '#fde047', '#ffffff', '#fed7aa'][Math.floor(Math.random() * 4)],
        }));
      }

      if (activeEffects.includes('stars')) {
        particles.stars = Array.from({ length: 24 }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -(Math.random() * 0.5 + 0.1),
          size: Math.random() * 16 + 12,
          alpha: Math.random() * 0.6 + 0.4,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.04,
          char: '⭐',
        }));
      }

      if (activeEffects.includes('confetti')) {
        particles.confetti = Array.from({ length: 45 }, () => ({
          x: Math.random() * W,
          y: -Math.random() * H * 0.5,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 3 + 2,
          size: Math.random() * 8 + 6,
          alpha: 1,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.15,
          color: ['#f43f5e', '#ec4899', '#3b82f6', '#10b981', '#facc15', '#a855f7'][Math.floor(Math.random() * 6)],
        }));
      }

      if (activeEffects.includes('petals')) {
        particles.petals = Array.from({ length: 22 }, () => ({
          x: Math.random() * W,
          y: -Math.random() * 40,
          vx: Math.random() * 2 - 0.5,
          vy: Math.random() * 1.8 + 1,
          size: Math.random() * 18 + 12,
          alpha: Math.random() * 0.6 + 0.4,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.03,
          char: '🌸',
        }));
      }

      if (activeEffects.includes('snow')) {
        particles.snow = Array.from({ length: 45 }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.8,
          vy: Math.random() * 2 + 1,
          size: Math.random() * 4 + 2,
          alpha: Math.random() * 0.7 + 0.3,
          rotation: 0,
          vRot: 0,
        }));
      }

      if (activeEffects.includes('rain')) {
        particles.rain = Array.from({ length: 70 }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: -1.5,
          vy: Math.random() * 12 + 16,
          size: Math.random() * 16 + 10,
          alpha: Math.random() * 0.4 + 0.2,
          rotation: 0,
          vRot: 0,
        }));
      }

      if (activeEffects.includes('fire')) {
        particles.fire = Array.from({ length: 35 }, () => ({
          x: W * 0.2 + Math.random() * W * 0.6,
          y: H + Math.random() * 20,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(Math.random() * 3 + 2),
          size: Math.random() * 14 + 6,
          alpha: Math.random() * 0.8 + 0.2,
          rotation: 0,
          vRot: 0,
          color: ['#ea580c', '#f97316', '#fbbf24', '#ef4444'][Math.floor(Math.random() * 4)],
        }));
      }

      if (activeEffects.includes('bubbles')) {
        particles.bubbles = Array.from({ length: 20 }, () => ({
          x: Math.random() * W,
          y: H + Math.random() * 40,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -(Math.random() * 1.6 + 1),
          size: Math.random() * 22 + 14,
          alpha: Math.random() * 0.5 + 0.3,
          rotation: 0,
          vRot: 0,
          char: '🫧',
        }));
      }

      if (activeEffects.includes('leaves')) {
        particles.leaves = Array.from({ length: 18 }, () => ({
          x: Math.random() * W,
          y: -Math.random() * 30,
          vx: Math.random() * 2,
          vy: Math.random() * 1.6 + 1.2,
          size: Math.random() * 18 + 14,
          alpha: Math.random() * 0.7 + 0.3,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.05,
          char: ['🍂', '🍁'][Math.floor(Math.random() * 2)],
        }));
      }

      if (activeEffects.includes('neon')) {
        particles.neon = Array.from({ length: 30 }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 5 + 2,
          alpha: Math.random() * 0.8 + 0.2,
          rotation: 0,
          vRot: 0,
          color: ['#06b6d4', '#ec4899', '#a855f7', '#10b981'][Math.floor(Math.random() * 4)],
        }));
      }

      if (activeEffects.includes('dust')) {
        particles.dust = Array.from({ length: 50 }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2.5 + 1,
          alpha: Math.random() * 0.4 + 0.1,
          rotation: 0,
          vRot: 0,
        }));
      }
    };

    initParticles();

    // Render loop
    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // 1. Full Screen Overlay Effects (Light leaks, VHS, Lens flare, Grain)
      if (activeEffects.includes('lightleak')) {
        const leakGrad = ctx.createLinearGradient(0, 0, W * 0.7, H * 0.8);
        leakGrad.addColorStop(0, 'rgba(251, 146, 60, 0.35)');
        leakGrad.addColorStop(0.4, 'rgba(244, 63, 94, 0.2)');
        leakGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = leakGrad;
        ctx.fillRect(0, 0, W, H);
      }

      if (activeEffects.includes('lensflare')) {
        // Anamorphic horizontal streak
        const flareY = H * 0.3;
        const flareGrad = ctx.createLinearGradient(0, flareY - 40, 0, flareY + 40);
        flareGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        flareGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.45)');
        flareGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = flareGrad;
        ctx.fillRect(0, flareY - 30, W, 60);

        ctx.beginPath();
        ctx.arc(W * 0.25, flareY, 60, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(253, 224, 71, 0.25)';
        ctx.fill();
      }

      if (activeEffects.includes('vhs')) {
        // Scanlines
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        for (let y = 0; y < H; y += 4) {
          ctx.fillRect(0, y, W, 1.5);
        }
        // Glitch flicker bar occasionally
        if (Math.random() < 0.15) {
          const barY = Math.random() * H;
          ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
          ctx.fillRect(0, barY, W, Math.random() * 12 + 4);
        }
      }

      if (activeEffects.includes('filmgrain')) {
        // Fast random film grain noise
        const imgData = ctx.createImageData(Math.min(W, 300), Math.min(H, 300));
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = Math.random() * 255;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = 22; // subtle alpha
        }
        ctx.save();
        ctx.globalAlpha = 0.5;
        // Tile or scale noise
        ctx.putImageData(imgData, 0, 0);
        ctx.restore();
      }

      // 2. Animated Particles Loop
      // Hearts
      if (particles.hearts) {
        ctx.font = '22px sans-serif';
        particles.hearts.forEach((p) => {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillText(p.char || '💖', -p.size / 2, -p.size / 2);
          ctx.restore();

          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vRot;
          if (p.y < -40) {
            p.y = H + 20;
            p.x = Math.random() * W;
          }
        });
      }

      // Sparkles / Glitter
      if (particles.sparkles) {
        particles.sparkles.forEach((p) => {
          ctx.save();
          ctx.globalAlpha = Math.abs(Math.sin(p.alpha * Math.PI));
          ctx.fillStyle = p.color || '#fef08a';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          p.alpha = (p.alpha + 0.03) % 1;
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < 0) p.y = H;
        });
      }

      // Stars
      if (particles.stars) {
        ctx.font = '20px sans-serif';
        particles.stars.forEach((p) => {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillText('⭐', -p.size / 2, -p.size / 2);
          ctx.restore();

          p.rotation += p.vRot;
          p.y += p.vy;
          if (p.y < -30) p.y = H + 20;
        });
      }

      // Confetti
      if (particles.confetti) {
        particles.confetti.forEach((p) => {
          ctx.save();
          ctx.fillStyle = p.color || '#f43f5e';
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();

          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vRot;
          if (p.y > H + 20) {
            p.y = -20;
            p.x = Math.random() * W;
          }
        });
      }

      // Petals
      if (particles.petals) {
        ctx.font = '20px sans-serif';
        particles.petals.forEach((p) => {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillText('🌸', 0, 0);
          ctx.restore();

          p.x += Math.sin(p.y * 0.02) * 1.2 + p.vx * 0.3;
          p.y += p.vy;
          p.rotation += p.vRot;
          if (p.y > H + 20) {
            p.y = -20;
            p.x = Math.random() * W;
          }
        });
      }

      // Snow
      if (particles.snow) {
        ctx.fillStyle = '#ffffff';
        particles.snow.forEach((p) => {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          p.x += Math.sin(p.y * 0.03) * 0.8;
          p.y += p.vy;
          if (p.y > H + 10) {
            p.y = -10;
            p.x = Math.random() * W;
          }
        });
      }

      // Rain
      if (particles.rain) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        particles.rain.forEach((p) => {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx, p.y + p.vy);
          ctx.stroke();
          ctx.restore();

          p.x += p.vx;
          p.y += p.vy;
          if (p.y > H + 20) {
            p.y = -20;
            p.x = Math.random() * W;
          }
        });
      }

      // Fire
      if (particles.fire) {
        particles.fire.forEach((p) => {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color || '#ea580c';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          p.x += p.vx;
          p.y += p.vy;
          p.size = Math.max(0.5, p.size - 0.15);
          p.alpha = Math.max(0, p.alpha - 0.015);
          if (p.alpha <= 0.05 || p.size <= 1) {
            p.x = W * 0.2 + Math.random() * W * 0.6;
            p.y = H + 10;
            p.size = Math.random() * 12 + 6;
            p.alpha = Math.random() * 0.8 + 0.2;
          }
        });
      }

      // Bubbles
      if (particles.bubbles) {
        ctx.font = '24px sans-serif';
        particles.bubbles.forEach((p) => {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.fillText('🫧', 0, 0);
          ctx.restore();

          p.x += Math.sin(p.y * 0.02) * 1.5;
          p.y += p.vy;
          if (p.y < -30) {
            p.y = H + 20;
            p.x = Math.random() * W;
          }
        });
      }

      // Leaves
      if (particles.leaves) {
        ctx.font = '20px sans-serif';
        particles.leaves.forEach((p) => {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillText(p.char || '🍂', 0, 0);
          ctx.restore();

          p.x += Math.sin(p.y * 0.01) * 2;
          p.y += p.vy;
          p.rotation += p.vRot;
          if (p.y > H + 20) {
            p.y = -20;
            p.x = Math.random() * W;
          }
        });
      }

      // Neon
      if (particles.neon) {
        particles.neon.forEach((p) => {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color || '#06b6d4';
          ctx.fillStyle = p.color || '#06b6d4';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        });
      }

      // Dust
      if (particles.dust) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        particles.dust.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [activeEffects]);

  return { canvasRef };
}
