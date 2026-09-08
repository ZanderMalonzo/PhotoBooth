// Types for PhotoBooth by Zander

export type CameraFacing = 'user' | 'environment';

export type AspectRatio = '1:1' | '4:3' | '16:9' | '9:16' | '3:4';

export type CountdownDuration = 0 | 3 | 5 | 10;

export interface CameraDevice {
  deviceId: string;
  label: string;
}

export type FilterCategory =
  | 'all'
  | 'basic'
  | 'vintage'
  | 'bw'
  | 'aesthetic'
  | 'glow'
  | 'cinematic'
  | 'social'
  | 'fun';

export interface FilterConfig {
  id: string;
  name: string;
  category: Exclude<FilterCategory, 'all'>;
  cssFilter: string;
  overlayColor?: string; // Optional color tint overlay e.g. rgba(255, 180, 200, 0.2)
  blendMode?: 'normal' | 'screen' | 'overlay' | 'multiply' | 'soft-light' | 'color-dodge';
  funEffect?: 'bighead' | 'smallface' | 'fisheye' | 'mirror' | 'kaleidoscope' | 'pixelate' | 'cartoon' | 'wave';
  previewGradient: string; // CSS gradient for thumbnail preview card
  intensity?: number; // default 100
}

export type EffectType =
  | 'hearts'
  | 'stars'
  | 'sparkles'
  | 'confetti'
  | 'snow'
  | 'rain'
  | 'fire'
  | 'bubbles'
  | 'glitter'
  | 'leaves'
  | 'petals'
  | 'neon'
  | 'lensflare'
  | 'lightleak'
  | 'filmgrain'
  | 'dust'
  | 'vhs';

export interface EffectConfig {
  id: EffectType;
  name: string;
  icon: string;
  description: string;
}

export type LayoutCategory = 'strip' | 'grid' | 'creative';

export type LayoutId =
  | 'strip-2'
  | 'strip-3'
  | 'strip-4'
  | 'strip-5'
  | 'strip-6'
  | 'grid-2x2'
  | 'grid-3x3'
  | 'grid-4x4'
  | 'polaroid'
  | 'film'
  | 'magazine'
  | 'scrapbook'
  | 'postcard'
  | 'collage'
  | 'square'
  | 'story';

export interface LayoutConfig {
  id: LayoutId;
  name: string;
  category: LayoutCategory;
  photoCount: number;
  aspectRatio: string;
  description: string;
  previewSvg: string;
}

export interface FrameStyle {
  id: string;
  name: string;
  borderWidth: number;
  padding: number;
  borderColor: string;
  borderRadius: number;
  styleName:
    | 'classic'
    | 'polaroid'
    | 'film'
    | 'retro'
    | 'neon'
    | 'heart'
    | 'flower'
    | 'minimal'
    | 'birthday'
    | 'wedding'
    | 'christmas'
    | 'halloween';
}

export interface BackgroundOption {
  id: string;
  name: string;
  type: 'solid' | 'gradient' | 'pattern';
  value: string;
}

export interface StickerItem {
  id: string;
  name: string;
  category: 'hearts' | 'stars' | 'accessories' | 'emojis' | 'celebration' | 'food' | 'holiday';
  content: string; // SVG data or emoji character
  isEmoji: boolean;
}

export interface PlacedSticker {
  uid: string;
  stickerId: string;
  content: string;
  isEmoji: boolean;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  scale: number; // 0.5 - 3
  rotation: number; // degrees
}

export type FontStyleId = 'modern' | 'handwritten' | 'retro' | 'bubble' | 'elegant' | 'pixel';

export interface PlacedText {
  uid: string;
  text: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  fontId: FontStyleId;
  fontSize: number;
  color: string;
  isBold: boolean;
  isItalic: boolean;
  align: 'left' | 'center' | 'right';
  hasShadow: boolean;
  hasOutline: boolean;
  outlineColor?: string;
  rotation: number; // degrees
}

export interface PhotoAdjustments {
  brightness: number; // -100 to 100, default 0
  contrast: number; // -100 to 100, default 0
  saturation: number; // -100 to 100, default 0
  exposure: number; // -100 to 100, default 0
  temperature: number; // -100 to 100 (warm/cool), default 0
  blur: number; // 0 to 20, default 0
  sharpness: number; // 0 to 100, default 0
  vignette: number; // 0 to 100, default 0
  grain: number; // 0 to 100, default 0
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
  filterId: string;
  filterIntensity: number;
  effects: EffectType[];
}

export interface SavedPhotoStrip {
  id: string;
  timestamp: number;
  dataUrl: string;
  thumbnailUrl: string;
  layoutId: LayoutId;
  photoCount: number;
}
