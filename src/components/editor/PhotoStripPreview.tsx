import React, { useRef, useState, useEffect } from 'react';
import {
  BackgroundOption,
  CapturedPhoto,
  FrameStyle,
  LayoutConfig,
  PhotoAdjustments,
  PlacedSticker,
  PlacedText,
} from '../../types';
import { FONTS } from '../../config/fonts';

interface PhotoStripPreviewProps {
  photos: CapturedPhoto[];
  layout: LayoutConfig;
  frame: FrameStyle;
  background: BackgroundOption;
  customBgColor: string;
  stickers: PlacedSticker[];
  texts: PlacedText[];
  adjustments: PhotoAdjustments;
  showDate: boolean;
  dateText: string;
  showSignature: boolean;
  signatureText: string;
  // Selection
  selectedStickerUid: string | null;
  onSelectStickerUid: (uid: string | null) => void;
  onUpdateSticker: (uid: string, updates: Partial<PlacedSticker>) => void;
  selectedTextUid: string | null;
  onSelectTextUid: (uid: string | null) => void;
  onUpdateText: (uid: string, updates: Partial<PlacedText>) => void;
}

export const PhotoStripPreview: React.FC<PhotoStripPreviewProps> = ({
  photos,
  layout,
  frame,
  background,
  customBgColor,
  stickers,
  texts,
  adjustments,
  showDate,
  dateText,
  showSignature,
  signatureText,
  selectedStickerUid,
  onSelectStickerUid,
  onUpdateSticker,
  selectedTextUid,
  onSelectTextUid,
  onUpdateText,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [draggingItem, setDraggingItem] = useState<{
    type: 'sticker' | 'text';
    uid: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  // Dragging support on preview card
  const handlePointerDown = (
    e: React.PointerEvent,
    type: 'sticker' | 'text',
    uid: string,
    curX: number,
    curY: number
  ) => {
    e.stopPropagation();
    if (type === 'sticker') {
      onSelectStickerUid(uid);
      onSelectTextUid(null);
    } else {
      onSelectTextUid(uid);
      onSelectStickerUid(null);
    }

    setDraggingItem({
      type,
      uid,
      startX: e.clientX,
      startY: e.clientY,
      origX: curX,
      origY: curY,
    });
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!draggingItem || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - draggingItem.startX) / rect.width) * 100;
      const deltaY = ((e.clientY - draggingItem.startY) / rect.height) * 100;

      const newX = Math.max(5, Math.min(95, draggingItem.origX + deltaX));
      const newY = Math.max(5, Math.min(95, draggingItem.origY + deltaY));

      if (draggingItem.type === 'sticker') {
        onUpdateSticker(draggingItem.uid, { x: newX, y: newY });
      } else {
        onUpdateText(draggingItem.uid, { x: newX, y: newY });
      }
    };

    const handlePointerUp = () => {
      setDraggingItem(null);
    };

    if (draggingItem) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingItem, onUpdateSticker, onUpdateText]);

  // CSS Filter string for adjustments
  const adjStyle: React.CSSProperties = {
    filter: `brightness(${1 + adjustments.brightness / 100}) contrast(${
      1 + adjustments.contrast / 100
    }) saturate(${1 + adjustments.saturation / 100}) blur(${adjustments.blur}px) ${
      adjustments.temperature > 0
        ? `sepia(${adjustments.temperature * 0.3}%)`
        : `hue-rotate(${Math.abs(adjustments.temperature) * 0.3}deg)`
    }`,
  };

  // Background styling
  const bgStyle: React.CSSProperties = {
    background: customBgColor
      ? customBgColor
      : background.type === 'solid' || background.type === 'gradient'
      ? background.value
      : undefined,
    backgroundColor: background.type === 'pattern' ? '#ffffff' : undefined,
    backgroundImage: background.type === 'pattern' ? background.value : undefined,
    backgroundSize: background.type === 'pattern' ? '12px 12px' : undefined,
  };

  // Border & Frame class
  const getFrameBorder = () => {
    if (frame.styleName === 'neon') return 'border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)]';
    if (frame.styleName === 'film') return 'border-4 border-black bg-zinc-950';
    if (frame.styleName === 'birthday') return 'border-4 border-yellow-400';
    if (frame.styleName === 'retro') return 'border-4 border-rose-400';
    if (frame.styleName === 'christmas') return 'border-4 border-red-600';
    return 'border-2 border-white/80 shadow-2xl';
  };

  // Number of photos to show
  const count = layout.photoCount;
  const displayPhotos = Array.from({ length: count }, (_, i) => {
    return photos[i % photos.length] || { dataUrl: '', id: `placeholder-${i}` };
  });

  return (
    <div className="w-full flex justify-center items-center select-none py-2">
      <div
        ref={containerRef}
        id="printable-photo-strip"
        className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${getFrameBorder()}`}
        style={{
          ...bgStyle,
          width: layout.category === 'strip' ? '280px' : layout.id === 'polaroid' ? '300px' : '340px',
        }}
        onClick={() => {
          onSelectStickerUid(null);
          onSelectTextUid(null);
        }}
      >
        {/* Film Negative Sprocket Holes */}
        {frame.styleName === 'film' && (
          <>
            <div className="absolute left-1.5 top-0 bottom-0 w-3 flex flex-col justify-around py-4 pointer-events-none z-10">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="w-2.5 h-3.5 bg-zinc-900 rounded-sm border border-zinc-800" />
              ))}
            </div>
            <div className="absolute right-1.5 top-0 bottom-0 w-3 flex flex-col justify-around py-4 pointer-events-none z-10">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="w-2.5 h-3.5 bg-zinc-900 rounded-sm border border-zinc-800" />
              ))}
            </div>
          </>
        )}

        {/* Magazine Top Banner */}
        {layout.id === 'magazine' && (
          <div className="text-center pt-3 pb-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-retro leading-none">
              PHOTOBOOTH
            </h1>
            <span className="text-[9px] tracking-widest text-yellow-300 font-bold uppercase">
              SPECIAL COLLECTOR EDITION
            </span>
          </div>
        )}

        {/* Photos Container */}
        <div
          className={`p-3.5 ${
            frame.styleName === 'film' ? 'px-6' : ''
          } ${
            layout.category === 'strip'
              ? 'flex flex-col gap-2.5'
              : layout.id === 'grid-2x2'
              ? 'grid grid-cols-2 gap-2'
              : layout.id === 'grid-3x3'
              ? 'grid grid-cols-3 gap-1.5'
              : layout.id === 'grid-4x4'
              ? 'grid grid-cols-4 gap-1'
              : layout.id === 'polaroid'
              ? 'p-4 pb-12'
              : 'grid grid-cols-2 gap-2'
          }`}
        >
          {displayPhotos.map((photo, idx) => (
            <div
              key={`${photo.id || 'photo'}-${idx}`}
              className={`relative overflow-hidden bg-slate-800 shadow-sm ${
                layout.id === 'polaroid' ? 'aspect-square rounded-sm' : 'aspect-[4/3] rounded-lg'
              }`}
            >
              {photo.dataUrl ? (
                <img
                  src={photo.dataUrl}
                  alt={`Shot ${idx + 1}`}
                  className="w-full h-full object-cover pointer-events-none"
                  style={adjStyle}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 font-bold">
                  Photo #{idx + 1}
                </div>
              )}

              {/* Vignette Overlay */}
              {adjustments.vignette > 0 && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, transparent 40%, rgba(0,0,0,${
                      (adjustments.vignette / 100) * 0.8
                    }) 100%)`,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer Signature & Date */}
        {(layout.category === 'strip' || layout.id === 'polaroid' || layout.id === 'film') && (
          <div className="pb-3 text-center pointer-events-none">
            {showSignature && signatureText && (
              <p
                className={`text-xs font-bold tracking-tight ${
                  frame.styleName === 'film' ? 'text-slate-200' : 'text-slate-700'
                }`}
              >
                {signatureText}
              </p>
            )}
            {showDate && dateText && (
              <p
                className={`text-[10px] font-medium tracking-wide ${
                  frame.styleName === 'film' ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {dateText}
              </p>
            )}
          </div>
        )}

        {/* Interactive Sticker Overlays */}
        {stickers.map((s) => {
          const isSelected = selectedStickerUid === s.uid;
          return (
            <div
              key={s.uid}
              onPointerDown={(e) => handlePointerDown(e, 'sticker', s.uid, s.x, s.y)}
              className={`absolute cursor-move select-none touch-none transition-transform ${
                isSelected ? 'ring-2 ring-pink-500 ring-offset-2 rounded-lg' : ''
              }`}
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                transform: `translate(-50%, -50%) rotate(${s.rotation}deg) scale(${s.scale})`,
                fontSize: '28px',
                zIndex: 30,
              }}
            >
              {s.content}
            </div>
          );
        })}

        {/* Interactive Typography Overlays */}
        {texts.map((t) => {
          const isSelected = selectedTextUid === t.uid;
          const fontDef = FONTS.find((f) => f.id === t.fontId);

          return (
            <div
              key={t.uid}
              onPointerDown={(e) => handlePointerDown(e, 'text', t.uid, t.x, t.y)}
              className={`absolute cursor-move select-none touch-none whitespace-nowrap leading-none ${
                fontDef ? fontDef.className : ''
              } ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2 px-1 rounded-md' : ''}`}
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                transform: `translate(-50%, -50%) rotate(${t.rotation}deg)`,
                fontSize: `${Math.round(t.fontSize * 0.7)}px`,
                color: t.color,
                fontWeight: t.isBold ? 700 : 500,
                fontStyle: t.isItalic ? 'italic' : 'normal',
                textAlign: t.align,
                textShadow: t.hasShadow ? '0 2px 6px rgba(0,0,0,0.6)' : undefined,
                WebkitTextStroke: t.hasOutline ? '1px black' : undefined,
                zIndex: 35,
              }}
            >
              {t.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};
