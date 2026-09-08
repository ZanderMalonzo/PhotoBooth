import React from 'react';
import { Camera } from 'lucide-react';

interface CountdownOverlayProps {
  number: number | null;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ number }) => {
  if (number === null) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none bg-black/20 backdrop-blur-[2px]">
      <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-slate-900/85 border-4 border-pink-500/80 shadow-2xl shadow-pink-500/50 flex items-center justify-center animate-pop-in">
        {number > 0 ? (
          <span className="text-7xl sm:text-8xl font-black bg-gradient-to-br from-pink-300 via-pink-400 to-rose-500 bg-clip-text text-transparent drop-shadow-md">
            {number}
          </span>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Camera className="w-16 h-16 sm:w-20 sm:h-20 text-pink-400 animate-bounce" />
            <span className="text-sm font-extrabold uppercase tracking-widest text-pink-300">Smile!</span>
          </div>
        )}
      </div>
    </div>
  );
};
