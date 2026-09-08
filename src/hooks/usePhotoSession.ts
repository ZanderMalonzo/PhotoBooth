import { useCallback, useEffect, useRef, useState } from 'react';
import { CapturedPhoto, CountdownDuration, EffectType, FilterConfig } from '../types';
import { soundManager } from '../utils/audio';

interface UsePhotoSessionOptions {
  totalPhotos?: number;
  countdownSeconds?: CountdownDuration;
  onSessionComplete?: (photos: CapturedPhoto[]) => void;
}

export function usePhotoSession(options: UsePhotoSessionOptions = {}) {
  const [totalPhotos, setTotalPhotos] = useState<number>(options.totalPhotos || 4);
  const [countdownDuration, setCountdownDuration] = useState<CountdownDuration>(
    options.countdownSeconds !== undefined ? options.countdownSeconds : 3
  );

  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0); // 0-based: 0 -> 1st photo
  const [countdownNumber, setCountdownNumber] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers
  const clearSessionTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearSessionTimers();
  }, [clearSessionTimers]);

  // Start Photo Booth Session
  const startSession = useCallback(
    (
      captureFn: (filter?: FilterConfig, intensity?: number) => string | null,
      currentFilter: FilterConfig,
      filterIntensity: number,
      activeEffects: EffectType[]
    ) => {
      clearSessionTimers();
      setIsSessionActive(true);
      setCurrentPhotoIndex(0);
      setCapturedPhotos([]);
      setIsFinished(false);

      const runShot = (index: number, accumulatedPhotos: CapturedPhoto[]) => {
        setCurrentPhotoIndex(index);

        if (countdownDuration === 0) {
          // Instant capture
          executeShot(index, accumulatedPhotos);
          return;
        }

        let remaining = countdownDuration;
        setCountdownNumber(remaining);
        soundManager.playCountdownBeep(false);

        timerRef.current = setInterval(() => {
          remaining -= 1;
          if (remaining > 0) {
            setCountdownNumber(remaining);
            soundManager.playCountdownBeep(remaining === 1);
          } else {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            setCountdownNumber(0); // 📸 icon
            executeShot(index, accumulatedPhotos);
          }
        }, 1000);
      };

      const executeShot = (index: number, accumulatedPhotos: CapturedPhoto[]) => {
        // Flash animation & shutter audio
        setIsFlashing(true);
        soundManager.playShutterSound();

        const dataUrl = captureFn(currentFilter, filterIntensity);
        const newPhoto: CapturedPhoto = {
          id: `photo-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
          dataUrl: dataUrl || '',
          timestamp: Date.now(),
          filterId: currentFilter.id,
          filterIntensity,
          effects: [...activeEffects],
        };

        const updated = [...accumulatedPhotos, newPhoto];
        setCapturedPhotos(updated);

        setTimeout(() => {
          setIsFlashing(false);
          setCountdownNumber(null);

          const nextIndex = index + 1;
          if (nextIndex < totalPhotos) {
            // Short 1.5s interval between photos to pose
            setTimeout(() => {
              runShot(nextIndex, updated);
            }, 1200);
          } else {
            // All photos completed!
            setIsSessionActive(false);
            setIsFinished(true);
            soundManager.playSuccessFanfare();
            if (options.onSessionComplete) {
              options.onSessionComplete(updated);
            }
          }
        }, 500);
      };

      runShot(0, []);
    },
    [clearSessionTimers, countdownDuration, options, totalPhotos]
  );

  const cancelSession = useCallback(() => {
    clearSessionTimers();
    setIsSessionActive(false);
    setCountdownNumber(null);
    setIsFlashing(false);
  }, [clearSessionTimers]);

  return {
    isSessionActive,
    currentPhotoIndex,
    totalPhotos,
    setTotalPhotos,
    countdownDuration,
    setCountdownDuration,
    countdownNumber,
    isFlashing,
    capturedPhotos,
    setCapturedPhotos,
    isFinished,
    setIsFinished,
    startSession,
    cancelSession,
  };
}
