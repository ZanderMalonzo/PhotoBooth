import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Share2,
  Printer,
  Copy,
  Check,
  QrCode,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import { generateQrCodeDataUrl } from '../../utils/qr';
import { savePhotoStrip } from '../../utils/storage';
import { LayoutId } from '../../types';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  getCanvasBlob: (
    format: 'image/png' | 'image/jpeg' | 'image/webp',
    quality?: number
  ) => Promise<Blob | null>;
  layoutId: LayoutId;
  photoCount: number;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  getCanvasBlob,
  layoutId,
  photoCount,
}) => {
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState<number>(0.95);
  const [isCopied, setIsCopied] = useState(false);
  const [isSavedToVault, setIsSavedToVault] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsCopied(false);
      setIsSavedToVault(false);
      generatePreview();
    } else {
      if (previewBlobUrl) {
        URL.revokeObjectURL(previewBlobUrl);
        setPreviewBlobUrl(null);
      }
      setQrDataUrl(null);
    }
  }, [isOpen]);

  const generatePreview = async () => {
    setIsGenerating(true);
    const mimeType = format === 'png' ? 'image/png' : format === 'jpeg' ? 'image/jpeg' : 'image/webp';
    const blob = await getCanvasBlob(mimeType, quality);
    if (blob) {
      const url = URL.createObjectURL(blob);
      setPreviewBlobUrl(url);

      // Auto-save to local IndexedDB vault
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        await savePhotoStrip({
          id: `strip-${Date.now()}`,
          timestamp: Date.now(),
          dataUrl: base64,
          thumbnailUrl: base64,
          layoutId,
          photoCount,
        });
        setIsSavedToVault(true);
      };
      reader.readAsDataURL(blob);

      // Generate QR Code with current origin + viewer hash
      const qrCode = await generateQrCodeDataUrl(window.location.href);
      setQrDataUrl(qrCode);
    }
    setIsGenerating(false);
  };

  if (!isOpen) return null;

  // Handle Download
  const handleDownload = async () => {
    setIsGenerating(true);
    const mimeType = format === 'png' ? 'image/png' : format === 'jpeg' ? 'image/jpeg' : 'image/webp';
    const blob = await getCanvasBlob(mimeType, quality);
    if (!blob) return;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.download = `photobooth-${layoutId}-${dateStr}.${format === 'jpeg' ? 'jpg' : format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsGenerating(false);
  };

  // Handle Native Web Share
  const handleShare = async () => {
    if (!navigator.share) {
      alert('Native Web Share is not supported on this browser. Use Download or Copy to Clipboard instead!');
      return;
    }
    const blob = await getCanvasBlob('image/png', 1);
    if (!blob) return;

    try {
      const file = new File([blob], `photobooth-${Date.now()}.png`, { type: 'image/png' });
      await navigator.share({
        title: 'Photobooth by Zander',
        text: 'Look at my photo booth strip! 📸✨',
        files: [file],
      });
    } catch {
      // User cancelled share
    }
  };

  // Handle Copy to Clipboard
  const handleCopyClipboard = async () => {
    try {
      const blob = await getCanvasBlob('image/png', 1);
      if (!blob) return;
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      alert('Could not copy image to clipboard. Try downloading directly!');
    }
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-pop-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto thin-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Your Creation is Ready!</h2>
              <p className="text-xs text-slate-400">Download, print, or share your photo strip</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thumbnail Preview & Details */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
          {previewBlobUrl ? (
            <img
              src={previewBlobUrl}
              alt="Photo Strip Preview"
              className="w-32 max-h-48 object-contain rounded-xl shadow-lg border border-slate-700 bg-slate-900"
            />
          ) : (
            <div className="w-32 h-44 rounded-xl bg-slate-900 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-slate-600 animate-pulse" />
            </div>
          )}

          <div className="flex-1 flex flex-col gap-2.5 text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Format:
              </span>
              <div className="flex items-center gap-1">
                {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => {
                      setFormat(fmt);
                      generatePreview();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition ${
                      format === fmt
                        ? 'bg-pink-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {isSavedToVault && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>Saved automatically to your Local Vault</span>
              </div>
            )}

            <p className="text-xs text-slate-400">
              High resolution 300-DPI render. Safe & private: image generated directly on your device.
            </p>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:opacity-95 active:scale-95 transition"
          >
            <Download className="w-5 h-5" />
            <span>Download</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-300 font-bold text-xs hover:bg-purple-600/30 active:scale-95 transition"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>

          {/* Copy to Clipboard */}
          <button
            onClick={handleCopyClipboard}
            className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 font-bold text-xs hover:bg-indigo-600/30 active:scale-95 transition"
          >
            {isCopied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            <span>{isCopied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 active:scale-95 transition"
          >
            <Printer className="w-5 h-5" />
            <span>Print 2x6"</span>
          </button>
        </div>

        {/* QR Code Section */}
        {qrDataUrl && (
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="w-14 h-14 rounded-lg bg-white p-1 shadow"
              />
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <QrCode className="w-3.5 h-3.5 text-pink-400" />
                  <span>Scan with Phone</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Open your camera to access PhotoBooth on mobile
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
