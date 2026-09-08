import React, { useState, useMemo } from 'react';
import { Sparkles, Dices, Eye, Heart, Sliders, Wand2 } from 'lucide-react';
import { FilterCategory, FilterConfig } from '../../types';
import { FILTERS } from '../../config/filters';

interface FilterBarProps {
  currentFilter: FilterConfig;
  onSelectFilter: (filter: FilterConfig) => void;
  filterIntensity: number;
  setFilterIntensity: (val: number) => void;
  isComparingOriginal: boolean;
  setIsComparingOriginal: (comparing: boolean) => void;
  favoriteFilterIds: string[];
  onToggleFavorite: (id: string) => void;
  onAutoEnhance: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onSelectFilter,
  filterIntensity,
  setFilterIntensity,
  setIsComparingOriginal,
  favoriteFilterIds,
  onToggleFavorite,
  onAutoEnhance,
}) => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [showIntensity, setShowIntensity] = useState(false);

  const categories: { id: FilterCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '🌟' },
    { id: 'basic', label: 'Basic', icon: '🌈' },
    { id: 'vintage', label: 'Vintage', icon: '🎞️' },
    { id: 'bw', label: 'B & W', icon: '🖤' },
    { id: 'aesthetic', label: 'Aesthetic', icon: '💕' },
    { id: 'glow', label: 'Glow', icon: '✨' },
    { id: 'cinematic', label: 'Cinematic', icon: '🎬' },
    { id: 'social', label: 'Social', icon: '📱' },
    { id: 'fun', label: 'Fun Warps', icon: '😂' },
  ];

  // Filter list by category
  const filteredList = useMemo(() => {
    if (activeCategory === 'all') return FILTERS;
    return FILTERS.filter((f) => f.category === activeCategory);
  }, [activeCategory]);

  // Surprise Me - Random Filter
  const handleSurpriseMe = () => {
    const candidates = FILTERS.filter((f) => f.id !== 'original' && f.id !== currentFilter.id);
    const random = candidates[Math.floor(Math.random() * candidates.length)];
    if (random) {
      onSelectFilter(random);
    }
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-3 select-none">
      {/* Action Row: Category Tabs & Utility Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        {/* Horizontal Category Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Feature Buttons: Surprise Me, Auto Enhance, Intensity, Before/After */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Surprise Me 🎲 */}
          <button
            onClick={handleSurpriseMe}
            title="Surprise Me (Random Filter)"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 text-xs font-semibold transition"
          >
            <Dices className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Surprise Me</span>
          </button>

          {/* Auto Enhance ✨ */}
          <button
            onClick={onAutoEnhance}
            title="Auto Enhance Photo"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold transition"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auto Enhance</span>
          </button>

          {/* Intensity Toggle */}
          <button
            onClick={() => setShowIntensity(!showIntensity)}
            title="Filter Intensity"
            className={`p-1.5 rounded-xl text-xs font-semibold transition ${
              showIntensity
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* Before / After (Hold to Compare) */}
          <button
            onMouseDown={() => setIsComparingOriginal(true)}
            onMouseUp={() => setIsComparingOriginal(false)}
            onTouchStart={() => setIsComparingOriginal(true)}
            onTouchEnd={() => setIsComparingOriginal(false)}
            onMouseLeave={() => setIsComparingOriginal(false)}
            title="Hold to show original image"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold active:bg-pink-500 active:text-white transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compare</span>
          </button>
        </div>
      </div>

      {/* Intensity Slider Drawer (Collapsible) */}
      {showIntensity && (
        <div className="w-full px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md flex items-center gap-4 animate-pop-in">
          <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">Intensity</span>
          <input
            type="range"
            min="0"
            max="100"
            value={filterIntensity}
            onChange={(e) => setFilterIntensity(Number(e.target.value))}
            className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-pink-400 w-10 text-right">
            {filterIntensity}%
          </span>
        </div>
      )}

      {/* Filter Thumbnails Horizontal Slider */}
      <div className="w-full overflow-x-auto thin-scrollbar pb-2 pt-1 flex items-center gap-3">
        {filteredList.map((filter) => {
          const isSelected = currentFilter.id === filter.id;
          const isFavorite = favoriteFilterIds.includes(filter.id);

          return (
            <div
              key={filter.id}
              className="relative flex-shrink-0 group flex flex-col items-center"
            >
              {/* Card Container */}
              <button
                onClick={() => onSelectFilter(filter)}
                className={`relative w-20 sm:w-22 h-24 sm:h-26 rounded-2xl p-1.5 flex flex-col items-center justify-between text-left transition-all duration-200 overflow-hidden ${
                  isSelected
                    ? 'ring-2 ring-pink-500 shadow-lg shadow-pink-500/25 scale-105 bg-slate-900'
                    : 'bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Visual Thumbnail */}
                <div
                  className="w-full h-14 rounded-xl flex items-center justify-center relative overflow-hidden shadow-inner"
                  style={{ background: filter.previewGradient }}
                >
                  {filter.funEffect && (
                    <span className="absolute bottom-1 right-1 text-[10px] bg-black/60 px-1 rounded text-yellow-300 font-bold">
                      WARP
                    </span>
                  )}
                  {isSelected && (
                    <Sparkles className="w-4 h-4 text-white drop-shadow animate-pulse" />
                  )}
                </div>

                {/* Filter Name */}
                <span
                  className={`text-[11px] font-semibold tracking-tight truncate w-full text-center mt-1 ${
                    isSelected ? 'text-pink-300' : 'text-slate-300 group-hover:text-white'
                  }`}
                >
                  {filter.name}
                </span>
              </button>

              {/* Favorite Heart Button */}
              {filter.id !== 'original' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(filter.id);
                  }}
                  title={isFavorite ? 'Remove Favorite' : 'Save Favorite'}
                  className={`absolute top-1 right-1 p-1 rounded-full backdrop-blur-md transition ${
                    isFavorite
                      ? 'text-pink-400 opacity-100'
                      : 'text-slate-500 opacity-0 group-hover:opacity-100 hover:text-pink-300'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${isFavorite ? 'fill-pink-500' : ''}`} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
