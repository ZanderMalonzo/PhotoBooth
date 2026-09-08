import { useCallback, useEffect, useRef, useState } from 'react';
import { AspectRatio, CameraDevice, CameraFacing, FilterConfig } from '../types';
import { applyFunFilterToCanvas } from '../utils/funFilters';

interface UseCameraOptions {
  facingMode?: CameraFacing;
  aspectRatio?: AspectRatio;
  isMirrored?: boolean;
}

export function useCamera(options: UseCameraOptions = {}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<CameraFacing>(options.facingMode || 'user');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(options.aspectRatio || '4:3');
  const [isMirrored, setIsMirrored] = useState<boolean>(options.isMirrored !== undefined ? options.isMirrored : true);
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Stop current active tracks
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
  }, []);

  // Refresh available camera devices
  const updateDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices
        .filter((d) => d.kind === 'videoinput')
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${index + 1}`,
        }));
      setDevices(videoInputs);
    } catch {
      // Ignore
    }
  }, []);

  // Initialize or switch camera
  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    stopStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera API is not supported on this browser or connection is not secure (HTTPS / localhost required).');
      setIsLoading(false);
      setHasPermission(false);
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: selectedDeviceId
          ? { deviceId: { exact: selectedDeviceId } }
          : {
              facingMode: facingMode,
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      await updateDevices();
      setIsLoading(false);
    } catch (err: unknown) {
      console.error('Camera error:', err);
      setIsLoading(false);
      const e = err as { name?: string; message?: string };
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        setError('Camera permission was denied. Please allow camera access in your browser settings.');
        setHasPermission(false);
      } else if (e.name === 'NotFoundError' || e.name === 'DevicesNotFoundError') {
        setError('No camera device found on this system.');
      } else if (e.name === 'NotReadableError' || e.name === 'TrackStartError') {
        setError('Camera is currently in use by another application.');
      } else {
        setError('Unable to start camera: ' + (e.message || 'Unknown error'));
      }
    }
  }, [facingMode, selectedDeviceId, stopStream, updateDevices]);

  // Restart camera when facing or device changes
  useEffect(() => {
    startCamera();
    return () => {
      stopStream();
    };
  }, [startCamera, stopStream]);

  // Toggle between front and back camera
  const switchFacingMode = useCallback(() => {
    setSelectedDeviceId(''); // clear exact device
    setFacingMode((prev) => {
      const next = prev === 'user' ? 'environment' : 'user';
      setIsMirrored(next === 'user');
      return next;
    });
  }, []);

  // Toggle mirror
  const toggleMirror = useCallback(() => {
    setIsMirrored((prev) => !prev);
  }, []);

  // Capture snapshot with filter, fun effect, intensity, and mirroring
  const capturePhoto = useCallback(
    (currentFilter?: FilterConfig, filterIntensity: number = 100): string | null => {
      const video = videoRef.current;
      if (!video || !streamRef.current || video.videoWidth === 0) return null;

      const vW = video.videoWidth;
      const vH = video.videoHeight;

      // Determine target resolution maintaining aspect ratio crop
      let targetW = vW;
      let targetH = vH;

      if (aspectRatio === '1:1') {
        const side = Math.min(vW, vH);
        targetW = side;
        targetH = side;
      } else if (aspectRatio === '4:3') {
        if (vW / vH > 4 / 3) {
          targetW = Math.round(vH * (4 / 3));
          targetH = vH;
        } else {
          targetW = vW;
          targetH = Math.round(vW * (3 / 4));
        }
      } else if (aspectRatio === '3:4') {
        if (vW / vH > 3 / 4) {
          targetW = Math.round(vH * (3 / 4));
          targetH = vH;
        } else {
          targetW = vW;
          targetH = Math.round(vW * (4 / 3));
        }
      } else if (aspectRatio === '16:9') {
        if (vW / vH > 16 / 9) {
          targetW = Math.round(vH * (16 / 9));
          targetH = vH;
        } else {
          targetW = vW;
          targetH = Math.round(vW * (9 / 16));
        }
      } else if (aspectRatio === '9:16') {
        if (vW / vH > 9 / 16) {
          targetW = Math.round(vH * (9 / 16));
          targetH = vH;
        } else {
          targetW = vW;
          targetH = Math.round(vW * (16 / 9));
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Handle mirroring
      ctx.save();
      if (isMirrored) {
        ctx.translate(targetW, 0);
        ctx.scale(-1, 1);
      }

      // Crop from center of source video
      const srcX = (vW - targetW) / 2;
      const srcY = (vH - targetH) / 2;

      // Apply CSS Filter if intensity > 0
      if (currentFilter && currentFilter.cssFilter !== 'none' && filterIntensity > 0) {
        if (filterIntensity === 100) {
          ctx.filter = currentFilter.cssFilter;
        } else {
          // Semi-intensity blend: draw original, then draw filtered with opacity
          ctx.filter = currentFilter.cssFilter;
        }
      }

      ctx.drawImage(video, srcX, srcY, targetW, targetH, 0, 0, targetW, targetH);
      ctx.restore();

      // Apply color overlay if specified
      if (currentFilter?.overlayColor && filterIntensity > 0) {
        ctx.save();
        if (currentFilter.blendMode && currentFilter.blendMode !== 'normal') {
          ctx.globalCompositeOperation = currentFilter.blendMode;
        }
        ctx.globalAlpha = (filterIntensity / 100);
        ctx.fillStyle = currentFilter.overlayColor;
        ctx.fillRect(0, 0, targetW, targetH);
        ctx.restore();
      }

      // Apply Fun canvas pixel distortions if present
      if (currentFilter?.funEffect) {
        applyFunFilterToCanvas(ctx, targetW, targetH, currentFilter.funEffect);
      }

      return canvas.toDataURL('image/jpeg', 0.95);
    },
    [aspectRatio, isMirrored]
  );

  return {
    videoRef,
    stream: streamRef.current,
    facingMode,
    switchFacingMode,
    isMirrored,
    toggleMirror,
    aspectRatio,
    setAspectRatio,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    isLoading,
    error,
    hasPermission,
    startCamera,
    capturePhoto,
  };
}
