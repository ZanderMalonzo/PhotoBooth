import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Key,
  X,
  Check,
  AlertCircle,
  Wand2,
  ExternalLink,
  Type,
  Smile,
  Sliders,
} from 'lucide-react';
import {
  analyzeAndEnhanceWithGemini,
  getStoredGeminiApiKey,
  saveStoredGeminiApiKey,
  removeStoredGeminiApiKey,
  GeminiEnhanceResult,
} from '../../utils/gemini';
import { FilterConfig, PhotoAdjustments, PlacedSticker, PlacedText } from '../../types';
import { FILTERS } from '../../config/filters';

interface GeminiEnhanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoDataUrl: string;
  onApplyFilter?: (filter: FilterConfig) => void;
  onApplyAdjustments?: (adj: PhotoAdjustments) => void;
  onAddCaption?: (caption: string) => void;
  onAddSticker?: (emoji: string) => void;
}

export const GeminiEnhanceModal: React.FC<GeminiEnhanceModalProps> = ({
  isOpen,
  onClose,
  currentPhotoDataUrl,
  onApplyFilter,
  onApplyAdjustments,
  onAddCaption,
  onAddSticker,
}) => {
  const [apiKey, setApiKey] = useState<string>(getStoredGeminiApiKey());
  const [isKeySaved, setIsKeySaved] = useState<boolean>(!!getStoredGeminiApiKey());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeminiEnhanceResult | null>(null);
  const [appliedActions, setAppliedActions] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    if (!apiKey.trim()) return;
    saveStoredGeminiApiKey(apiKey.trim());
    setIsKeySaved(true);
  };

  const handleClearKey = () => {
    removeStoredGeminiApiKey();
    setApiKey('');
    setIsKeySaved(false);
  };

  const handleRunEnhance = async () => {
    if (!apiKey.trim()) {
      setError('Please provide a Google Gemini API key first.');
      return;
    }
    if (!currentPhotoDataUrl) {
      setError('No photo available to analyze. Please take a photo first!');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setAppliedActions([]);

    try {
      saveStoredGeminiApiKey(apiKey.trim());
      setIsKeySaved(true);
      const res = await analyzeAndEnhanceWithGemini(currentPhotoDataUrl, apiKey.trim());
      setResult(res);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'Failed to connect to Gemini API. Check your key and network.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyAll = () => {
    if (!result) return;
    if (onApplyAdjustments) {
      onApplyAdjustments(result.adjustments);
    }
    if (onApplyFilter) {
      const matched = FILTERS.find((f) => f.id === result.recommendedFilterId);
      if (matched) onApplyFilter(matched);
    }
    if (onAddCaption && result.captions.length) {
      onAddCaption(result.captions[0]);
    }
    setAppliedActions(['all']);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-pop-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto thin-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">Gemini AI Studio</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300 border border-pink-500/30">
                  Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multimodal AI analyzes your photo lighting, mood, and color palette
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* API Key Section */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-yellow-400" />
              <span>Gemini API Key</span>
            </label>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Get Free Key at Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your Gemini API key (AIzaSy...)"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-indigo-500 font-mono"
            />
            {apiKey && (
              <button
                onClick={handleSaveKey}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold"
              >
                Save
              </button>
            )}
            {isKeySaved && (
              <button
                onClick={handleClearKey}
                title="Remove saved key"
                className="px-2 py-2 text-xs text-rose-400 hover:text-rose-300"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-500">
            🔒 Your API key is stored safely in your browser's local storage and is never uploaded anywhere.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Trigger */}
        {!result && (
          <button
            onClick={handleRunEnhance}
            disabled={isLoading || !apiKey.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/30 hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Gemini Analyzing Photo & Lighting...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Run Gemini AI Photo Enhance</span>
              </>
            )}
          </button>
        )}

        {/* Results Card */}
        {result && (
          <div className="flex flex-col gap-4 animate-pop-in">
            {/* AI Observation */}
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-indigo-300 block mb-0.5">
                  AI Insight:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">{result.analysis}</p>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Filter Recommendation */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Recommended Filter
                  </span>
                  <span className="text-sm font-bold text-pink-300 capitalize">
                    {result.recommendedFilterId.replace('-', ' ')}
                  </span>
                </div>
                {onApplyFilter && (
                  <button
                    onClick={() => {
                      const f = FILTERS.find((x) => x.id === result.recommendedFilterId);
                      if (f) onApplyFilter(f);
                      setAppliedActions((prev) => [...prev, 'filter']);
                    }}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition ${
                      appliedActions.includes('filter') || appliedActions.includes('all')
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-pink-500 text-white hover:bg-pink-600 shadow-md'
                    }`}
                  >
                    {appliedActions.includes('filter') || appliedActions.includes('all')
                      ? '✓ Filter Applied'
                      : 'Apply Filter'}
                  </button>
                )}
              </div>

              {/* Adjustments Recommendation */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Smart Sliders Tuning
                  </span>
                  <span className="text-xs text-slate-300">
                    Bright +{result.adjustments.brightness}, Sat +{result.adjustments.saturation}, Warmth +{result.adjustments.temperature}
                  </span>
                </div>
                {onApplyAdjustments && (
                  <button
                    onClick={() => {
                      onApplyAdjustments(result.adjustments);
                      setAppliedActions((prev) => [...prev, 'adj']);
                    }}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition ${
                      appliedActions.includes('adj') || appliedActions.includes('all')
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-purple-600 text-white hover:bg-purple-500 shadow-md'
                    }`}
                  >
                    {appliedActions.includes('adj') || appliedActions.includes('all')
                      ? '✓ Tuning Applied'
                      : 'Apply Smart Tuning'}
                  </button>
                )}
              </div>
            </div>

            {/* Generated Captions */}
            {onAddCaption && result.captions.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-pink-400" />
                  <span>AI Generated Photobooth Captions</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.captions.map((cap, i) => (
                    <button
                      key={i}
                      onClick={() => onAddCaption(cap)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-pink-500 text-xs font-semibold text-slate-200 hover:text-white transition active:scale-95"
                    >
                      + "{cap}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Stickers */}
            {onAddSticker && result.suggestedStickers.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Matching Stickers:</span>
                </span>
                <div className="flex items-center gap-2">
                  {result.suggestedStickers.map((em, i) => (
                    <button
                      key={i}
                      onClick={() => onAddSticker(em)}
                      className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 hover:border-yellow-400 text-lg flex items-center justify-center hover:scale-110 active:scale-95 transition"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Everything CTA */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleApplyAll}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs shadow-xl shadow-pink-500/25 hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Apply All AI Enhancements</span>
              </button>

              <button
                onClick={handleRunEnhance}
                disabled={isLoading}
                className="px-4 py-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition"
              >
                Re-Analyze
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
