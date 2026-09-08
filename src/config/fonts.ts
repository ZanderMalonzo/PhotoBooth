import { FontStyleId } from '../types';

export interface FontOption {
  id: FontStyleId;
  name: string;
  className: string;
  cssFamily: string;
  sample: string;
}

export const FONTS: FontOption[] = [
  {
    id: 'modern',
    name: 'Modern Clean',
    className: 'font-modern',
    cssFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    sample: 'Modern Clean',
  },
  {
    id: 'handwritten',
    name: 'Handwritten',
    className: 'font-handwritten',
    cssFamily: "'Caveat', cursive",
    sample: 'Handwritten Vibe',
  },
  {
    id: 'retro',
    name: 'Retro Bold',
    className: 'font-retro',
    cssFamily: "'Bebas Neue', sans-serif",
    sample: 'RETRO 80S BOLD',
  },
  {
    id: 'bubble',
    name: 'Bubble Cute',
    className: 'font-bubble',
    cssFamily: "'Fredoka', cursive",
    sample: 'Bubble Cute',
  },
  {
    id: 'elegant',
    name: 'Elegant Serif',
    className: 'font-elegant',
    cssFamily: "'Playfair Display', serif",
    sample: 'Elegant Moments',
  },
  {
    id: 'pixel',
    name: '8-Bit Pixel',
    className: 'font-pixel',
    cssFamily: "'Press Start 2P', monospace",
    sample: 'PIXEL 8-BIT',
  },
];

export const PRESET_COLORS = [
  '#ffffff',
  '#000000',
  '#f43f5e', // rose
  '#ec4899', // pink
  '#a855f7', // purple
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#eab308', // yellow
  '#f97316', // orange
  '#fbcfe8', // pastel pink
  '#c7d2fe', // pastel indigo
];
