import React from 'react';
import { PlacedText, FontStyleId } from '../../types';
import { FONTS, PRESET_COLORS } from '../../config/fonts';
import {
  Type,
  Plus,
  Trash2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  RotateCw,
} from 'lucide-react';

interface TextEditorProps {
  placedTexts: PlacedText[];
  onAddText: () => void;
  selectedTextUid: string | null;
  onSelectTextUid: (uid: string | null) => void;
  onUpdateText: (uid: string, updates: Partial<PlacedText>) => void;
  onRemoveText: (uid: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  placedTexts,
  onAddText,
  selectedTextUid,
  onSelectTextUid,
  onUpdateText,
  onRemoveText,
}) => {
  const selectedText = placedTexts.find((t) => t.uid === selectedTextUid);

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* Add Text Button */}
      <button
        onClick={onAddText}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-pink-500/20 hover:opacity-90 active:scale-98 transition"
      >
        <Plus className="w-4 h-4" />
        <span>Add Custom Text</span>
      </button>

      {/* Selected Text Controls */}
      {selectedText ? (
        <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/40 shadow-xl flex flex-col gap-3.5 animate-pop-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              Edit Text
            </span>
            <button
              onClick={() => onRemoveText(selectedText.uid)}
              className="p-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 text-xs font-semibold transition"
              title="Delete Text"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={selectedText.text}
            onChange={(e) => onUpdateText(selectedText.uid, { text: e.target.value })}
            placeholder="Type your message..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-semibold outline-none focus:border-pink-500"
          />

          {/* Font Picker */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Typography Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {FONTS.map((font) => (
                <button
                  key={font.id}
                  onClick={() => onUpdateText(selectedText.uid, { fontId: font.id as FontStyleId })}
                  className={`py-1.5 px-2 rounded-xl text-xs border text-left truncate transition ${
                    selectedText.fontId === font.id
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  } ${font.className}`}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>

          {/* Formatting Toggles: Size, Bold, Italic, Align */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800">
            {/* Bold & Italic */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdateText(selectedText.uid, { isBold: !selectedText.isBold })}
                className={`p-2 rounded-xl transition ${
                  selectedText.isBold ? 'bg-pink-500 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateText(selectedText.uid, { isItalic: !selectedText.isItalic })}
                className={`p-2 rounded-xl transition ${
                  selectedText.isItalic ? 'bg-pink-500 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => onUpdateText(selectedText.uid, { align: 'left' })}
                className={`p-1.5 rounded-lg transition ${
                  selectedText.align === 'left' ? 'bg-purple-600 text-white' : 'text-slate-400'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateText(selectedText.uid, { align: 'center' })}
                className={`p-1.5 rounded-lg transition ${
                  selectedText.align === 'center' ? 'bg-purple-600 text-white' : 'text-slate-400'
                }`}
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateText(selectedText.uid, { align: 'right' })}
                className={`p-1.5 rounded-lg transition ${
                  selectedText.align === 'right' ? 'bg-purple-600 text-white' : 'text-slate-400'
                }`}
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Shadow & Outline */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateText(selectedText.uid, { hasShadow: !selectedText.hasShadow })}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedText.hasShadow
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Shadow
              </button>
              <button
                onClick={() => onUpdateText(selectedText.uid, { hasOutline: !selectedText.hasOutline })}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedText.hasOutline
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Outline
              </button>
            </div>
          </div>

          {/* Size & Rotation Sliders */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Font Size</span>
                <span className="font-mono">{selectedText.fontSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="72"
                value={selectedText.fontSize}
                onChange={(e) =>
                  onUpdateText(selectedText.uid, { fontSize: parseInt(e.target.value, 10) })
                }
                className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <RotateCw className="w-3 h-3" /> Angle
                </span>
                <span className="font-mono">{selectedText.rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={selectedText.rotation}
                onChange={(e) =>
                  onUpdateText(selectedText.uid, { rotation: parseInt(e.target.value, 10) })
                }
                className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Color
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => onUpdateText(selectedText.uid, { color: c })}
                  className={`w-6 h-6 rounded-full flex-shrink-0 border transition-transform ${
                    selectedText.color === c ? 'scale-125 border-white ring-2 ring-pink-500' : 'border-black/30'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={selectedText.color}
                onChange={(e) => onUpdateText(selectedText.uid, { color: e.target.value })}
                className="w-6 h-6 rounded-full bg-transparent cursor-pointer border-0 ml-1"
                title="Custom Color"
              />
            </div>
          </div>
        </div>
      ) : (
        /* List of placed text elements */
        placedTexts.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Active Text Elements (Click to edit)
            </span>
            {placedTexts.map((item) => (
              <div
                key={item.uid}
                onClick={() => onSelectTextUid(item.uid)}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500 flex items-center justify-between cursor-pointer transition"
              >
                <span className="text-xs font-semibold text-slate-200 truncate max-w-[200px]">
                  "{item.text}"
                </span>
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                  {item.fontId}
                </span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
