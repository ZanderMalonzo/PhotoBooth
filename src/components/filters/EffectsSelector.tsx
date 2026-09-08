import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { EffectType } from '../../types';
import { EFFECTS } from '../../config/effects';

interface EffectsSelectorProps {
  activeEffects: EffectType[];
  onToggleEffect: (effect: EffectType) => void;
  onClearEffects: () => void;
}

export const EffectsSelector: React.FC<EffectsSelectorProps> = ({
  activeEffects,
  onToggleEffect,
  onClearEffects,
}) => {
  return (
    <div className="w-full max-w-4xl flex flex-col gap-2 select-none">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>Real-time Effects Layer ({activeEffects.length})</span>
        </div>

        {activeEffects.length > 0 && (
          <button
            onClick={onClearEffects}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition"
          >
            <X className="w-3 h-3" />
            <span>Clear Effects</span>
          </button>
        )}
      </div>

      {/* Effects Chips Horizontal Scroll */}
      <div className="w-full overflow-x-auto thin-scrollbar pb-1 flex items-center gap-2">
        {EFFECTS.map((effect) => {
          const isActive = activeEffects.includes(effect.id);

          return (
            <button
              key={effect.id}
              onClick={() => onToggleEffect(effect.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20 scale-105'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{effect.icon}</span>
              <span>{effect.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
