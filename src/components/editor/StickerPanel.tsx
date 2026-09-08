import React, { useState } from 'react';
import { PlacedSticker, StickerItem } from '../../types';
import { STICKERS } from '../../config/stickers';
import { Smile, Trash2, RotateCw, ZoomIn, X } from 'lucide-react';

interface StickerPanelProps {
  placedStickers: PlacedSticker[];
  onAddSticker: (item: StickerItem) => void;
  selectedStickerUid: string | null;
  onSelectStickerUid: (uid: string | null) => void;
  onUpdateSticker: (uid: string, updates: Partial<PlacedSticker>) => void;
  onRemoveSticker: (uid: string) => void;
  onClearAllStickers: () => void;
}

export const StickerPanel: React.FC<StickerPanelProps> = ({
  placedStickers,
  onAddSticker,
  selectedStickerUid,
  onSelectStickerUid,
  onUpdateSticker,
  onRemoveSticker,
  onClearAllStickers,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All', icon: '✨' },
    { id: 'hearts', label: 'Hearts', icon: '💖' },
    { id: 'accessories', label: 'Dress Up', icon: '👑' },
    { id: 'stars', label: 'Stars', icon: '⭐' },
    { id: 'celebration', label: 'Party', icon: '🎉' },
    { id: 'emojis', label: 'Cute', icon: '🫰' },
    { id: 'food', label: 'Food', icon: '🍦' },
    { id: 'holiday', label: 'Holiday', icon: '🎅' },
  ];

  const filteredStickers =
    activeCategory === 'all'
      ? STICKERS
      : STICKERS.filter((s) => s.category === activeCategory);

  const selectedSticker = placedStickers.find((s) => s.uid === selectedStickerUid);

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* Category selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeCategory === c.id
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Sticker Library Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-44 overflow-y-auto thin-scrollbar p-1">
        {filteredStickers.map((item) => (
          <button
            key={item.id}
            onClick={() => onAddSticker(item)}
            title={`Add ${item.name}`}
            className="aspect-square rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-pink-500/50 flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition shadow-sm"
          >
            <span>{item.content}</span>
          </button>
        ))}
      </div>

      {/* Selected Sticker Manipulator Controls */}
      {selectedSticker && (
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-pink-500/40 shadow-lg flex flex-col gap-3 animate-pop-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedSticker.content}</span>
              <span className="text-xs font-bold text-pink-300 uppercase">Selected Sticker</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onRemoveSticker(selectedSticker.uid)}
                className="p-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 text-xs font-semibold transition"
                title="Delete Sticker"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onSelectStickerUid(null)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scale & Rotate Sliders */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <ZoomIn className="w-3 h-3" /> Size
                </span>
                <span className="font-mono">{selectedSticker.scale.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={selectedSticker.scale}
                onChange={(e) =>
                  onUpdateSticker(selectedSticker.uid, { scale: parseFloat(e.target.value) })
                }
                className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <RotateCw className="w-3 h-3" /> Rotation
                </span>
                <span className="font-mono">{selectedSticker.rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={selectedSticker.rotation}
                onChange={(e) =>
                  onUpdateSticker(selectedSticker.uid, { rotation: parseInt(e.target.value, 10) })
                }
                className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Placed Stickers Count & Clear */}
      {placedStickers.length > 0 && !selectedSticker && (
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>{placedStickers.length} stickers placed (drag stickers on the photo)</span>
          <button
            onClick={onClearAllStickers}
            className="text-rose-400 hover:text-rose-300 font-semibold"
          >
            Clear Stickers
          </button>
        </div>
      )}
    </div>
  );
};
