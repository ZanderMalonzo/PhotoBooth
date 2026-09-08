import React, { useEffect, useState } from 'react';
import { SavedPhotoStrip } from '../types';
import { getAllPhotoStrips, deletePhotoStrip } from '../utils/storage';
import { Download, Trash2, Camera, Sparkles, Image as ImageIcon } from 'lucide-react';

interface GalleryPageProps {
  onStartBooth: () => void;
  onRefreshCount: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onStartBooth,
  onRefreshCount,
}) => {
  const [strips, setStrips] = useState<SavedPhotoStrip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadStrips = async () => {
    setIsLoading(true);
    const data = await getAllPhotoStrips();
    setStrips(data);
    setIsLoading(false);
    onRefreshCount();
  };

  useEffect(() => {
    loadStrips();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this photo strip?')) {
      await deletePhotoStrip(id);
      await loadStrips();
    }
  };

  const handleDownload = (dataUrl: string, layoutId: string, timestamp: number) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `photobooth-${layoutId}-${new Date(timestamp).toISOString().slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6 select-none">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-pink-400" />
            <span>Local Photo Vault</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            All your captured photo strips saved securely on your device.
          </p>
        </div>

        <button
          onClick={onStartBooth}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-pink-500/20 hover:opacity-90 active:scale-95 transition"
        >
          <Camera className="w-4 h-4" />
          <span>New Booth Session</span>
        </button>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-pink-500/30 border-t-pink-500 animate-spin" />
          <span className="text-xs text-slate-400">Loading your photo vault...</span>
        </div>
      ) : strips.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
          <div className="w-16 h-16 rounded-3xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Your Vault is Empty</h3>
          <p className="text-sm text-slate-400 max-w-sm mb-6">
            Take fun photos with the live booth and your finished creations will be preserved right here!
          </p>
          <button
            onClick={onStartBooth}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-pink-500 text-white font-bold text-sm shadow-xl shadow-pink-500/25 hover:bg-pink-600 transition"
          >
            <Camera className="w-4 h-4" />
            <span>Snap Your First Photo</span>
          </button>
        </div>
      ) : (
        /* Strips Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {strips.map((strip) => (
            <div
              key={strip.id}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-pink-500/50 shadow-xl transition-all flex flex-col justify-between"
            >
              {/* Image Preview */}
              <div className="relative w-full aspect-[1/1.6] bg-slate-950 flex items-center justify-center p-2 overflow-hidden">
                <img
                  src={strip.thumbnailUrl}
                  alt="Saved Photo Strip"
                  className="max-h-full object-contain rounded shadow group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Card Footer */}
              <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-300 block uppercase">
                    {strip.layoutId}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(strip.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDownload(strip.dataUrl, strip.layoutId, strip.timestamp)}
                    title="Download Photo"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-pink-500 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(strip.id)}
                    title="Delete Photo"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
