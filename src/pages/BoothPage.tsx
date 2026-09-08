import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CameraView } from '../components/camera/CameraView';
import { CameraControls } from '../components/camera/CameraControls';
import { FilterBar } from '../components/filters/FilterBar';
import { EffectsSelector } from '../components/filters/EffectsSelector';
import { useCamera } from '../hooks/useCamera';
import { usePhotoSession } from '../hooks/usePhotoSession';
import { CapturedPhoto, EffectType, FilterConfig } from '../types';
import { FILTERS } from '../config/filters';
import {
  getFavoriteFilters,
  toggleFavoriteFilter,
  addRecentFilter,
} from '../utils/storage';
import { ArrowRight, Sparkles } from 'lucide-react';
import { GeminiEnhanceModal } from '../components/common/GeminiEnhanceModal';

interface BoothPageProps {
  onSessionComplete: (photos: CapturedPhoto[]) => void;
  onOpenStudio: () => void;
  capturedPhotosCount: number;
}

export const BoothPage: React.FC<BoothPageProps> = ({
  onSessionComplete,
  onOpenStudio,
}) => {
  // Filter & Effect State
  const [currentFilter, setCurrentFilter] = useState<FilterConfig>(FILTERS[0]);
  const [filterIntensity, setFilterIntensity] = useState<number>(100);
  const [activeEffects, setActiveEffects] = useState<EffectType[]>(['sparkles']);
  const [isComparingOriginal, setIsComparingOriginal] = useState<boolean>(false);
  const [favoriteFilterIds, setFavoriteFilterIds] = useState<string[]>(getFavoriteFilters());
  const [isGeminiOpen, setIsGeminiOpen] = useState<boolean>(false);
  const [geminiSnapshotUrl, setGeminiSnapshotUrl] = useState<string>('');

  // Camera Hook
  const {
    videoRef,
    aspectRatio,
    setAspectRatio,
    isMirrored,
    toggleMirror,
    facingMode,
    switchFacingMode,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    isLoading,
    error,
    hasPermission,
    startCamera,
    capturePhoto,
  } = useCamera({ isMirrored: true, aspectRatio: '4:3' });

  // Photo Session Hook
  const {
    isSessionActive,
    currentPhotoIndex,
    totalPhotos,
    countdownDuration,
    setCountdownDuration,
    countdownNumber,
    isFlashing,
    capturedPhotos,
    startSession,
    cancelSession,
    isFinished,
    setIsFinished,
  } = usePhotoSession({
    totalPhotos: 4,
    countdownSeconds: 3,
    onSessionComplete: (photos) => {
      // Fire celebration confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#a855f7', '#3b82f6', '#fde047'],
      });
      onSessionComplete(photos);
    },
  });

  // Filter Selection Handler
  const handleSelectFilter = (filter: FilterConfig) => {
    setCurrentFilter(filter);
    addRecentFilter(filter.id);
  };

  // Toggle Favorite Handler
  const handleToggleFavorite = (id: string) => {
    const updated = toggleFavoriteFilter(id);
    setFavoriteFilterIds(updated);
  };

  // Auto Enhance Handler
  const handleAutoEnhance = () => {
    const vibrantFilter = FILTERS.find((f) => f.id === 'vibrant') || FILTERS[1];
    setCurrentFilter(vibrantFilter);
    setFilterIntensity(90);
  };

  // Single Photo Capture Handler
  const handleSingleCapture = () => {
    const dataUrl = capturePhoto(currentFilter, filterIntensity);
    if (!dataUrl) return;

    const singlePhoto: CapturedPhoto = {
      id: `photo-${Date.now()}`,
      dataUrl,
      timestamp: Date.now(),
      filterId: currentFilter.id,
      filterIntensity,
      effects: [...activeEffects],
    };

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
    });

    onSessionComplete([singlePhoto]);
  };

  // Start Multi-Shot Session
  const handleStartSession = () => {
    startSession(capturePhoto, currentFilter, filterIntensity, activeEffects);
  };

  // Toggle effect
  const handleToggleEffect = (eff: EffectType) => {
    setActiveEffects((prev) =>
      prev.includes(eff) ? prev.filter((e) => e !== eff) : [...prev, eff]
    );
  };

  const handleClearEffects = () => {
    setActiveEffects([]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col items-center gap-5 select-none">
      {/* Session Finish Notification Banner */}
      {isFinished && (
        <div className="w-full max-w-3xl p-4 rounded-3xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 border border-pink-500/40 backdrop-blur-md flex items-center justify-between animate-pop-in shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                Your Photo Strip is Ready! 🎉
              </h3>
              <p className="text-xs text-slate-300">
                4 photos captured. Customize frames, stickers, and text in the studio.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenStudio}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs sm:text-sm hover:bg-pink-600 transition shadow-lg shadow-pink-500/25"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Camera Viewport */}
      <CameraView
        videoRef={videoRef}
        aspectRatio={aspectRatio}
        isMirrored={isMirrored}
        currentFilter={currentFilter}
        filterIntensity={filterIntensity}
        activeEffects={activeEffects}
        isComparingOriginal={isComparingOriginal}
        isLoading={isLoading}
        error={error}
        hasPermission={hasPermission}
        onRetry={startCamera}
        isSessionActive={isSessionActive}
        currentPhotoIndex={currentPhotoIndex}
        totalPhotos={totalPhotos}
        countdownNumber={countdownNumber}
        isFlashing={isFlashing}
      />

      {/* Camera Controls Toolbar */}
      <CameraControls
        onCaptureSingle={handleSingleCapture}
        onStartSession={handleStartSession}
        isSessionActive={isSessionActive}
        onCancelSession={cancelSession}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        countdownDuration={countdownDuration}
        setCountdownDuration={setCountdownDuration}
        isMirrored={isMirrored}
        toggleMirror={toggleMirror}
        switchFacingMode={switchFacingMode}
        devices={devices}
        selectedDeviceId={selectedDeviceId}
        setSelectedDeviceId={setSelectedDeviceId}
      />

      {/* Real-time Effects Selector */}
      <EffectsSelector
        activeEffects={activeEffects}
        onToggleEffect={handleToggleEffect}
        onClearEffects={handleClearEffects}
      />

      {/* Filter Library Toolbar */}
      <FilterBar
        currentFilter={currentFilter}
        onSelectFilter={handleSelectFilter}
        filterIntensity={filterIntensity}
        setFilterIntensity={setFilterIntensity}
        isComparingOriginal={isComparingOriginal}
        setIsComparingOriginal={setIsComparingOriginal}
        favoriteFilterIds={favoriteFilterIds}
        onToggleFavorite={handleToggleFavorite}
        onAutoEnhance={handleAutoEnhance}
        onOpenGeminiAI={() => {
          const snap = capturePhoto(currentFilter, filterIntensity);
          if (snap) {
            setGeminiSnapshotUrl(snap);
            setIsGeminiOpen(true);
          }
        }}
      />

      {/* Gemini Multimodal AI Modal */}
      <GeminiEnhanceModal
        isOpen={isGeminiOpen}
        onClose={() => setIsGeminiOpen(false)}
        currentPhotoDataUrl={geminiSnapshotUrl}
        onApplyFilter={(f) => {
          setCurrentFilter(f);
          setFilterIntensity(100);
        }}
      />
    </div>
  );
};
