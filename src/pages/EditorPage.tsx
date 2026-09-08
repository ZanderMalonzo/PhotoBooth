import React, { useState } from 'react';
import {
  BackgroundOption,
  CapturedPhoto,
  FrameStyle,
  LayoutConfig,
  PhotoAdjustments,
  PlacedSticker,
  PlacedText,
  StickerItem,
} from '../types';
import { LAYOUTS } from '../config/layouts';
import { FRAMES, BACKGROUNDS } from '../config/frames';
import { LayoutSelector } from '../components/editor/LayoutSelector';
import { FrameSelector } from '../components/editor/FrameSelector';
import { StickerPanel } from '../components/editor/StickerPanel';
import { TextEditor } from '../components/editor/TextEditor';
import { AdjustmentSliders } from '../components/editor/AdjustmentSliders';
import { PhotoStripPreview } from '../components/editor/PhotoStripPreview';
import { DownloadModal } from '../components/share/DownloadModal';
import { renderPhotoStripCanvas } from '../utils/canvasRenderer';
import {
  Download,
  Camera,
  Layers,
  Frame,
  Smile,
  Type,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface EditorPageProps {
  photos: CapturedPhoto[];
  onRetake: () => void;
  onUpdatePhotos: (photos: CapturedPhoto[]) => void;
}

const DEFAULT_ADJUSTMENTS: PhotoAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  temperature: 0,
  blur: 0,
  sharpness: 0,
  vignette: 0,
  grain: 0,
};

export const EditorPage: React.FC<EditorPageProps> = ({
  photos,
  onRetake,
  onUpdatePhotos,
}) => {
  // Active Studio Tab
  const [activeTab, setActiveTab] = useState<'layout' | 'frame' | 'stickers' | 'text' | 'adjust'>('layout');

  // Customization State
  const [currentLayout, setCurrentLayout] = useState<LayoutConfig>(LAYOUTS[0]); // strip-4
  const [currentFrame, setCurrentFrame] = useState<FrameStyle>(FRAMES[0]); // classic
  const [currentBackground, setCurrentBackground] = useState<BackgroundOption>(BACKGROUNDS[0]); // white
  const [customBgColor, setCustomBgColor] = useState<string>('');

  const [showDate, setShowDate] = useState<boolean>(true);
  const [dateText, setDateText] = useState<string>(
    new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  );
  const [showSignature, setShowSignature] = useState<boolean>(true);
  const [signatureText, setSignatureText] = useState<string>('Photobooth by Zander');

  // Stickers & Text
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const [selectedStickerUid, setSelectedStickerUid] = useState<string | null>(null);

  const [placedTexts, setPlacedTexts] = useState<PlacedText[]>([]);
  const [selectedTextUid, setSelectedTextUid] = useState<string | null>(null);

  // Manual Adjustments
  const [adjustments, setAdjustments] = useState<PhotoAdjustments>(DEFAULT_ADJUSTMENTS);

  // Download Modal State
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);

  // Sticker Handlers
  const handleAddSticker = (item: StickerItem) => {
    const newSticker: PlacedSticker = {
      uid: `sticker-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      stickerId: item.id,
      content: item.content,
      isEmoji: item.isEmoji,
      x: 50,
      y: 50,
      scale: 1.2,
      rotation: 0,
    };
    setPlacedStickers((prev) => [...prev, newSticker]);
    setSelectedStickerUid(newSticker.uid);
  };

  const handleUpdateSticker = (uid: string, updates: Partial<PlacedSticker>) => {
    setPlacedStickers((prev) =>
      prev.map((s) => (s.uid === uid ? { ...s, ...updates } : s))
    );
  };

  const handleRemoveSticker = (uid: string) => {
    setPlacedStickers((prev) => prev.filter((s) => s.uid !== uid));
    if (selectedStickerUid === uid) setSelectedStickerUid(null);
  };

  const handleClearAllStickers = () => {
    setPlacedStickers([]);
    setSelectedStickerUid(null);
  };

  // Text Handlers
  const handleAddText = () => {
    const newText: PlacedText = {
      uid: `text-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text: 'Good Vibes Only',
      x: 50,
      y: 80,
      fontId: 'bubble',
      fontSize: 24,
      color: '#ffffff',
      isBold: true,
      isItalic: false,
      align: 'center',
      hasShadow: true,
      hasOutline: true,
      outlineColor: '#000000',
      rotation: 0,
    };
    setPlacedTexts((prev) => [...prev, newText]);
    setSelectedTextUid(newText.uid);
  };

  const handleUpdateText = (uid: string, updates: Partial<PlacedText>) => {
    setPlacedTexts((prev) =>
      prev.map((t) => (t.uid === uid ? { ...t, ...updates } : t))
    );
  };

  const handleRemoveText = (uid: string) => {
    setPlacedTexts((prev) => prev.filter((t) => t.uid !== uid));
    if (selectedTextUid === uid) setSelectedTextUid(null);
  };

  // Photo Rearrangement Handlers
  const handleMovePhotoUp = (index: number) => {
    if (index === 0) return;
    const copy = [...photos];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    onUpdatePhotos(copy);
  };

  const handleMovePhotoDown = (index: number) => {
    if (index === photos.length - 1) return;
    const copy = [...photos];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    onUpdatePhotos(copy);
  };

  const handleRemovePhoto = (index: number) => {
    if (photos.length <= 1) return;
    onUpdatePhotos(photos.filter((_, i) => i !== index));
  };

  // High-Resolution Export Blob Function
  const getCanvasBlob = async (
    format: 'image/png' | 'image/jpeg' | 'image/webp',
    quality: number = 0.95
  ): Promise<Blob | null> => {
    const canvas = await renderPhotoStripCanvas({
      photos,
      layout: currentLayout,
      frame: currentFrame,
      background: currentBackground,
      customBgColor,
      stickers: placedStickers,
      texts: placedTexts,
      adjustments,
      showDate,
      dateText,
      showSignature,
      signatureText,
      scale: 2,
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), format, quality);
    });
  };

  // If user has no photos yet, show placeholder notice
  const hasPhotos = photos.length > 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 select-none">
      {/* Top Studio Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onRetake}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition"
          >
            <Camera className="w-4 h-4 text-pink-400" />
            <span>Take More Photos</span>
          </button>
          <span className="text-xs text-slate-500">
            {photos.length} photo{photos.length !== 1 ? 's' : ''} captured
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Download & Share Button */}
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-pink-500/25 hover:opacity-95 active:scale-95 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download & Share</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid (Left: Preview, Right: Customizer Tabs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Interactive Strip Preview */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 sm:p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm min-h-[500px]">
          <div className="text-center mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Live Interactive Canvas
            </span>
          </div>

          <PhotoStripPreview
            photos={photos}
            layout={currentLayout}
            frame={currentFrame}
            background={currentBackground}
            customBgColor={customBgColor}
            stickers={placedStickers}
            texts={placedTexts}
            adjustments={adjustments}
            showDate={showDate}
            dateText={dateText}
            showSignature={showSignature}
            signatureText={signatureText}
            selectedStickerUid={selectedStickerUid}
            onSelectStickerUid={setSelectedStickerUid}
            onUpdateSticker={handleUpdateSticker}
            selectedTextUid={selectedTextUid}
            onSelectTextUid={setSelectedTextUid}
            onUpdateText={handleUpdateText}
          />
        </div>

        {/* Right Column: Customization Tabs & Tool Panels */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Studio Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
            {[
              { id: 'layout', label: 'Layout', icon: <Layers className="w-4 h-4" /> },
              { id: 'frame', label: 'Frame & Theme', icon: <Frame className="w-4 h-4" /> },
              { id: 'stickers', label: 'Stickers', icon: <Smile className="w-4 h-4" /> },
              { id: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
              { id: 'adjust', label: 'Fine-Tune', icon: <Sliders className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Panel Content */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
            {activeTab === 'layout' && (
              <LayoutSelector
                currentLayout={currentLayout}
                onSelectLayout={setCurrentLayout}
                photoCount={photos.length}
                photos={photos}
                onMovePhotoUp={handleMovePhotoUp}
                onMovePhotoDown={handleMovePhotoDown}
                onRemovePhoto={handleRemovePhoto}
              />
            )}

            {activeTab === 'frame' && (
              <FrameSelector
                currentFrame={currentFrame}
                onSelectFrame={setCurrentFrame}
                currentBackground={currentBackground}
                onSelectBackground={setCurrentBackground}
                customBgColor={customBgColor}
                setCustomBgColor={setCustomBgColor}
                showDate={showDate}
                setShowDate={setShowDate}
                dateText={dateText}
                setDateText={setDateText}
                showSignature={showSignature}
                setShowSignature={setShowSignature}
                signatureText={signatureText}
                setSignatureText={setSignatureText}
              />
            )}

            {activeTab === 'stickers' && (
              <StickerPanel
                placedStickers={placedStickers}
                onAddSticker={handleAddSticker}
                selectedStickerUid={selectedStickerUid}
                onSelectStickerUid={setSelectedStickerUid}
                onUpdateSticker={handleUpdateSticker}
                onRemoveSticker={handleRemoveSticker}
                onClearAllStickers={handleClearAllStickers}
              />
            )}

            {activeTab === 'text' && (
              <TextEditor
                placedTexts={placedTexts}
                onAddText={handleAddText}
                selectedTextUid={selectedTextUid}
                onSelectTextUid={setSelectedTextUid}
                onUpdateText={handleUpdateText}
                onRemoveText={handleRemoveText}
              />
            )}

            {activeTab === 'adjust' && (
              <AdjustmentSliders
                adjustments={adjustments}
                onChange={setAdjustments}
                onReset={() => setAdjustments(DEFAULT_ADJUSTMENTS)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Export & Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        getCanvasBlob={getCanvasBlob}
        layoutId={currentLayout.id}
        photoCount={photos.length}
      />
    </div>
  );
};
