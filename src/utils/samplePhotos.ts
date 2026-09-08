import { CapturedPhoto } from '../types';

// Creates SVG-based colorful sample portrait cards for immediate playground editing
function createSampleSvgDataUrl(bgGrad: string, label: string, emoji: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          ${bgGrad}
        </linearGradient>
      </defs>
      <rect width="600" height="800" fill="url(#grad)" />
      <circle cx="300" cy="360" r="140" fill="rgba(255,255,255,0.2)" />
      <text x="300" y="390" font-size="110" text-anchor="middle" font-family="sans-serif">${emoji}</text>
      <rect x="180" y="550" width="240" height="48" rx="24" fill="rgba(0,0,0,0.3)" />
      <text x="300" y="580" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="sans-serif" letter-spacing="2">${label}</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_PHOTOS: CapturedPhoto[] = [
  {
    id: 'sample-1',
    timestamp: Date.now() - 3000,
    dataUrl: createSampleSvgDataUrl(
      '<stop offset="0%" stop-color="#f472b6" /><stop offset="100%" stop-color="#fb7185" />',
      'PHOTO 01',
      '✨'
    ),
    filterId: 'pink-glow',
    filterIntensity: 100,
    effects: ['sparkles'],
  },
  {
    id: 'sample-2',
    timestamp: Date.now() - 2000,
    dataUrl: createSampleSvgDataUrl(
      '<stop offset="0%" stop-color="#a855f7" /><stop offset="100%" stop-color="#6366f1" />',
      'PHOTO 02',
      '💖'
    ),
    filterId: 'dreamy',
    filterIntensity: 100,
    effects: ['hearts'],
  },
  {
    id: 'sample-3',
    timestamp: Date.now() - 1000,
    dataUrl: createSampleSvgDataUrl(
      '<stop offset="0%" stop-color="#06b6d4" /><stop offset="100%" stop-color="#3b82f6" />',
      'PHOTO 03',
      '😎'
    ),
    filterId: 'retro',
    filterIntensity: 100,
    effects: ['stars'],
  },
  {
    id: 'sample-4',
    timestamp: Date.now(),
    dataUrl: createSampleSvgDataUrl(
      '<stop offset="0%" stop-color="#f59e0b" /><stop offset="100%" stop-color="#ea580c" />',
      'PHOTO 04',
      '🎉'
    ),
    filterId: 'golden-glow',
    filterIntensity: 100,
    effects: ['confetti'],
  },
];
