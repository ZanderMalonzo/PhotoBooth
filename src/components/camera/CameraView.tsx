import React from 'react';
import { Camera, AlertCircle, RefreshCw } from 'lucide-react';
import { AspectRatio, EffectType, FilterConfig } from '../../types';
import { useEffectsCanvas } from '../../hooks/useEffectsCanvas';
import { CountdownOverlay } from './CountdownOverlay';
import { FlashOverlay } from './FlashOverlay';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  aspectRatio: AspectRatio;
  isMirrored: boolean;
  currentFilter: FilterConfig;
  filterIntensity: number;
  activeEffects: EffectType[];
  isComparingOriginal: boolean;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean | null;
  onRetry: () => void;
  // Session overlay props
  isSessionActive: boolean;
  currentPhotoIndex: number;
  totalPhotos: number;
  countdownNumber: number | null;
  isFlashing: boolean;
}

export const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  aspectRatio,
  isMirrored,
  currentFilter,
  filterIntensity,
  activeEffects,
  isComparingOriginal,
  isLoading,
  error,
  onRetry,
  isSessionActive,
  currentPhotoIndex,
  totalPhotos,
  countdownNumber,
  isFlashing,
}) => {
  const { canvasRef: effectsCanvasRef } = useEffectsCanvas(activeEffects);

  // Aspect ratio class calculation
  const getAspectClass = () => {
    switch (aspectRatio) {
      case '1:1':
        return 'aspect-square max-h-[70vh]';
      case '4:3':
        return 'aspect-[4/3] max-h-[70vh]';
      case '3:4':
        return 'aspect-[3/4] max-h-[70vh]';
      case '16:9':
        return 'aspect-[16/9] max-h-[70vh]';
      case '9:16':
        return 'aspect-[9/16] max-h-[75vh]';
      default:
        return 'aspect-[4/3] max-h-[70vh]';
    }
  };

  // Compute live CSS filter string
  const activeCssFilter =
    isComparingOriginal || currentFilter.id === 'original' || filterIntensity === 0
      ? 'none'
      : currentFilter.cssFilter;

  return (
    <div className="relative w-full flex justify-center items-center select-none">
      <div
        className={`relative w-full max-w-3xl overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center transition-all ${getAspectClass()}`}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full border-4 border-pink-500/30 border-t-pink-500 animate-spin" />
            <span className="text-sm font-medium text-slate-300">Initializing camera feed...</span>
          </div>
        )}

        {/* Error Fallback */}
        {error && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-slate-950/90 backdrop-blur-md">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Camera Access Required</h3>
            <p className="text-sm text-slate-400 max-w-md mb-6">{error}</p>
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-pink-500/25 hover:opacity-90 active:scale-95 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Camera</span>
            </button>
          </div>
        )}

        {/* Live Video Feed */}
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          className={`w-full h-full object-cover transition-transform duration-200 ${
            isMirrored ? '-scale-x-100' : ''
          }`}
          style={{
            filter: activeCssFilter,
          }}
        />

        {/* Color Tint Overlay for Vintage/Aesthetic/Glow Filters */}
        {!isComparingOriginal && currentFilter.overlayColor && filterIntensity > 0 && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity"
            style={{
              backgroundColor: currentFilter.overlayColor,
              mixBlendMode: currentFilter.blendMode || 'soft-light',
              opacity: filterIntensity / 100,
            }}
          />
        )}

        {/* Live Particle Effects Canvas Overlay */}
        <canvas
          ref={effectsCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Multi-Shot Session Status Badge */}
        {isSessionActive && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-pink-500/40 shadow-lg animate-pulse-glow">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
            <span className="text-xs font-bold tracking-wider text-pink-300 uppercase">
              Photo {currentPhotoIndex + 1} / {totalPhotos}
            </span>
          </div>
        )}

        {/* Comparing Original Indicator */}
        {isComparingOriginal && (
          <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
            Original (Before)
          </div>
        )}

        {/* Aspect Ratio Badge */}
        {!isSessionActive && (
          <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-slate-300 text-xs font-medium">
            {aspectRatio}
          </div>
        )}

        {/* Animated Countdown Overlay */}
        <CountdownOverlay number={countdownNumber} />

        {/* Camera Flash Screen Animation */}
        <FlashOverlay isFlashing={isFlashing} />
      </div>
    </div>
  );
};
