import React, { useState } from 'react';
import { Camera, Volume2, VolumeX, Sparkles, Image as ImageIcon, Palette } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface HeaderProps {
  currentTab: 'home' | 'booth' | 'editor' | 'gallery';
  setCurrentTab: (tab: 'home' | 'booth' | 'editor' | 'gallery') => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, savedCount }) => {
  const [isMuted, setIsMuted] = useState(soundManager.getIsMuted());

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-2.5 text-left group transition"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform duration-300">
            <Camera className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              PHOTOBOOTH
            </span>
            <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider text-pink-400/90 ml-1.5 px-1.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20">
              PRO
            </span>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setCurrentTab('booth')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition ${
              currentTab === 'booth'
                ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30 shadow-sm shadow-pink-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden xs:inline">Booth</span>
          </button>

          <button
            onClick={() => setCurrentTab('editor')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition ${
              currentTab === 'editor'
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span className="hidden xs:inline">Studio</span>
          </button>

          <button
            onClick={() => setCurrentTab('gallery')}
            className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition ${
              currentTab === 'gallery'
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span className="hidden xs:inline">Vault</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-pink-500 text-white rounded-full text-xs font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Tools (Sound Toggle & Badges) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleToggleSound}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>100% On-Device Privacy</span>
          </div>
        </div>
      </div>
    </header>
  );
};
