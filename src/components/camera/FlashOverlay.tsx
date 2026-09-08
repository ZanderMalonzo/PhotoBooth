import React from 'react';

interface FlashOverlayProps {
  isFlashing: boolean;
}

export const FlashOverlay: React.FC<FlashOverlayProps> = ({ isFlashing }) => {
  if (!isFlashing) return null;

  return (
    <div className="absolute inset-0 z-40 bg-white animate-camera-flash pointer-events-none" />
  );
};
