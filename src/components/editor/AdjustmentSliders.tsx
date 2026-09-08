import React from 'react';
import { PhotoAdjustments } from '../../types';
import { RotateCcw, Sun, Contrast, Droplets, Thermometer, Eye, Sparkles } from 'lucide-react';

interface AdjustmentSlidersProps {
  adjustments: PhotoAdjustments;
  onChange: (adj: PhotoAdjustments) => void;
  onReset: () => void;
}

export const AdjustmentSliders: React.FC<AdjustmentSlidersProps> = ({
  adjustments,
  onChange,
  onReset,
}) => {
  const update = (key: keyof PhotoAdjustments, value: number) => {
    onChange({
      ...adjustments,
      [key]: value,
    });
  };

  const sliders: {
    key: keyof PhotoAdjustments;
    label: string;
    icon: React.ReactNode;
    min: number;
    max: number;
    unit?: string;
  }[] = [
    { key: 'brightness', label: 'Brightness', icon: <Sun className="w-3.5 h-3.5 text-amber-400" />, min: -100, max: 100 },
    { key: 'contrast', label: 'Contrast', icon: <Contrast className="w-3.5 h-3.5 text-blue-400" />, min: -100, max: 100 },
    { key: 'saturation', label: 'Saturation', icon: <Droplets className="w-3.5 h-3.5 text-rose-400" />, min: -100, max: 100 },
    { key: 'temperature', label: 'Warmth', icon: <Thermometer className="w-3.5 h-3.5 text-orange-400" />, min: -100, max: 100 },
    { key: 'vignette', label: 'Vignette', icon: <Eye className="w-3.5 h-3.5 text-purple-400" />, min: 0, max: 100, unit: '%' },
    { key: 'grain', label: 'Film Grain', icon: <Sparkles className="w-3.5 h-3.5 text-yellow-400" />, min: 0, max: 100, unit: '%' },
    { key: 'blur', label: 'Soft Blur', icon: <Droplets className="w-3.5 h-3.5 text-cyan-400" />, min: 0, max: 10, unit: 'px' },
  ];

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Fine-Tuning Controls
        </span>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {sliders.map((s) => (
          <div key={s.key} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <div className="flex items-center gap-1.5">
                {s.icon}
                <span>{s.label}</span>
              </div>
              <span className="font-mono text-[11px] text-pink-400 font-bold">
                {adjustments[s.key]}
                {s.unit || ''}
              </span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              value={adjustments[s.key]}
              onChange={(e) => update(s.key, Number(e.target.value))}
              className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
