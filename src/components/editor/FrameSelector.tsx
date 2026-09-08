import React from 'react';
import { FrameStyle, BackgroundOption } from '../../types';
import { FRAMES, BACKGROUNDS } from '../../config/frames';
import { Palette, Frame, Type } from 'lucide-react';

interface FrameSelectorProps {
  currentFrame: FrameStyle;
  onSelectFrame: (frame: FrameStyle) => void;
  currentBackground: BackgroundOption;
  onSelectBackground: (bg: BackgroundOption) => void;
  customBgColor: string;
  setCustomBgColor: (c: string) => void;
  showDate: boolean;
  setShowDate: (show: boolean) => void;
  dateText: string;
  setDateText: (t: string) => void;
  showSignature: boolean;
  setShowSignature: (show: boolean) => void;
  signatureText: string;
  setSignatureText: (t: string) => void;
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({
  currentFrame,
  onSelectFrame,
  currentBackground,
  onSelectBackground,
  customBgColor,
  setCustomBgColor,
  showDate,
  setShowDate,
  dateText,
  setDateText,
  showSignature,
  setShowSignature,
  signatureText,
  setSignatureText,
}) => {
  return (
    <div className="w-full flex flex-col gap-5 select-none">
      {/* 1. Frames Selection */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          <Frame className="w-3.5 h-3.5 text-pink-400" />
          <span>Frame Themes & Borders</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FRAMES.map((f) => {
            const isSelected = currentFrame.id === f.id;

            return (
              <button
                key={f.id}
                onClick={() => onSelectFrame(f)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-pink-500/20 border-pink-500 shadow-md shadow-pink-500/15'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: f.borderColor }}
                  />
                  <span
                    className={`text-xs font-semibold ${
                      isSelected ? 'text-pink-300' : 'text-slate-200'
                    }`}
                  >
                    {f.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Backgrounds Selection */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            <span>Background Colors & Gradients</span>
          </div>

          {/* Custom Hex Color Picker */}
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-slate-400 cursor-pointer">Custom:</label>
            <input
              type="color"
              value={customBgColor || '#ffffff'}
              onChange={(e) => setCustomBgColor(e.target.value)}
              className="w-6 h-6 rounded-md bg-transparent cursor-pointer border-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {BACKGROUNDS.map((bg) => {
            const isSelected = !customBgColor && currentBackground.id === bg.id;

            return (
              <button
                key={bg.id}
                onClick={() => {
                  setCustomBgColor('');
                  onSelectBackground(bg);
                }}
                title={bg.name}
                className={`relative w-full aspect-square rounded-xl transition-all overflow-hidden border ${
                  isSelected
                    ? 'ring-2 ring-pink-500 scale-105 border-white shadow-md'
                    : 'border-slate-800 hover:scale-102 hover:border-slate-600'
                }`}
                style={{
                  background: bg.value,
                  backgroundSize: bg.type === 'pattern' ? '12px 12px' : undefined,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* 3. Strip Footer Text & Date Stamp */}
      <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Type className="w-3.5 h-3.5 text-indigo-400" />
          <span>Footer Stamp & Date</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Signature / Booth Title */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-300">Signature Text</label>
              <input
                type="checkbox"
                checked={showSignature}
                onChange={(e) => setShowSignature(e.target.checked)}
                className="accent-pink-500 rounded"
              />
            </div>
            <input
              type="text"
              value={signatureText}
              onChange={(e) => setSignatureText(e.target.value)}
              placeholder="e.g. Photobooth by Zander"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-pink-500"
            />
          </div>

          {/* Date Stamp */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-300">Date Stamp</label>
              <input
                type="checkbox"
                checked={showDate}
                onChange={(e) => setShowDate(e.target.checked)}
                className="accent-pink-500 rounded"
              />
            </div>
            <input
              type="text"
              value={dateText}
              onChange={(e) => setDateText(e.target.value)}
              placeholder="e.g. Sep 7, 2026"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-pink-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
