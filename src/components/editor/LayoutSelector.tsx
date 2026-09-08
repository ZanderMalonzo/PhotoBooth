import React, { useState } from 'react';
import { LayoutConfig, LayoutId } from '../../types';
import { LAYOUTS } from '../../config/layouts';
import { ArrowLeftRight, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface LayoutSelectorProps {
  currentLayout: LayoutConfig;
  onSelectLayout: (layout: LayoutConfig) => void;
  photoCount: number;
  onMovePhotoUp: (index: number) => void;
  onMovePhotoDown: (index: number) => void;
  onRemovePhoto: (index: number) => void;
  photos: { id: string; dataUrl: string }[];
}

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  currentLayout,
  onSelectLayout,
  onMovePhotoUp,
  onMovePhotoDown,
  onRemovePhoto,
  photos,
}) => {
  const [activeTab, setActiveTab] = useState<'strip' | 'grid' | 'creative'>('strip');

  const tabs: { id: 'strip' | 'grid' | 'creative'; label: string }[] = [
    { id: 'strip', label: 'Photo Strips' },
    { id: 'grid', label: 'Grids' },
    { id: 'creative', label: 'Creative & Social' },
  ];

  const currentLayouts = LAYOUTS.filter((l) => l.category === activeTab);

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* Category Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {currentLayouts.map((layout) => {
          const isSelected = currentLayout.id === layout.id;

          return (
            <button
              key={layout.id}
              onClick={() => onSelectLayout(layout)}
              className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                isSelected
                  ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/20'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-bold truncate ${
                    isSelected ? 'text-purple-300' : 'text-slate-200'
                  }`}
                >
                  {layout.name}
                </span>
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                  {layout.photoCount}P
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">{layout.description}</p>
            </button>
          );
        })}
      </div>

      {/* Photo Ordering & Rearrange Bar */}
      {photos.length > 1 && (
        <div className="mt-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            <ArrowLeftRight className="w-3.5 h-3.5 text-pink-400" />
            <span>Rearrange Photos</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto thin-scrollbar pb-1">
            {photos.map((p, idx) => (
              <div
                key={`${p.id}-${idx}`}
                className="relative flex-shrink-0 group w-18 h-18 rounded-xl overflow-hidden border border-slate-700 bg-slate-950"
              >
                <img src={p.dataUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                <span className="absolute top-1 left-1 bg-black/70 text-white text-[10px] font-bold px-1 rounded">
                  #{idx + 1}
                </span>

                {/* Move Left / Right Controls */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition">
                  {idx > 0 && (
                    <button
                      onClick={() => onMovePhotoUp(idx)}
                      title="Move backward"
                      className="p-1 rounded bg-slate-800 text-white hover:bg-pink-500"
                    >
                      <ArrowUp className="w-3 h-3 -rotate-90" />
                    </button>
                  )}
                  {idx < photos.length - 1 && (
                    <button
                      onClick={() => onMovePhotoDown(idx)}
                      title="Move forward"
                      className="p-1 rounded bg-slate-800 text-white hover:bg-pink-500"
                    >
                      <ArrowDown className="w-3 h-3 -rotate-90" />
                    </button>
                  )}
                  {photos.length > 1 && (
                    <button
                      onClick={() => onRemovePhoto(idx)}
                      title="Remove"
                      className="p-1 rounded bg-rose-900/80 text-rose-300 hover:bg-rose-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
