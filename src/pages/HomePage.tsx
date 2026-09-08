import React from 'react';
import { Camera, Sparkles, Wand2, Shield, Heart, Download, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onStartBooth: () => void;
  onExploreFilters: () => void;
  onCreateStrip: () => void;
  savedCount: number;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartBooth,
  onExploreFilters,
  onCreateStrip,
}) => {
  return (
    <div className="w-full flex flex-col items-center select-none pb-16">
      {/* Hero Section */}
      <section className="relative w-full max-w-6xl mx-auto pt-10 sm:pt-16 pb-12 px-4 sm:px-6 flex flex-col items-center text-center">
        {/* Glow ambient backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[450px] bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-bold text-pink-400 mb-6 shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
          <span>Next-Gen Web Photo Booth Studio</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          Capture the moment.{' '}
          <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
            Make it yours.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          A modern, fun, studio-grade photobooth in your browser. Snap live photos with 60+ real-time filters,
          layered particle effects, classic Korean photo strips, stickers, and instant print & share.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14">
          <button
            onClick={onStartBooth}
            className="group flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-extrabold text-base shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.03] active:scale-95 transition-all duration-300"
          >
            <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Start Photo Booth</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreFilters}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 font-bold text-base hover:bg-slate-800 hover:border-slate-700 active:scale-95 transition shadow-lg"
          >
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span>Explore Filters</span>
          </button>

          <button
            onClick={onCreateStrip}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 font-bold text-base hover:bg-slate-800 hover:border-slate-700 active:scale-95 transition shadow-lg"
          >
            <Wand2 className="w-5 h-5 text-purple-400" />
            <span>Create Photo Strip</span>
          </button>
        </div>

        {/* Interactive Visual Strips Showcase */}
        <div className="relative w-full max-w-4xl py-6 flex items-center justify-center gap-4 sm:gap-6 overflow-hidden">
          {/* Sample Strip 1: Pastel Pink Aesthetic */}
          <div className="w-36 sm:w-44 p-2 rounded-2xl bg-[#fce7f3] border-2 border-white shadow-2xl rotate-[-4deg] hover:rotate-0 hover:scale-105 transition-all duration-300">
            <div className="flex flex-col gap-1.5">
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-tr from-pink-400 to-rose-300 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                ✨ Glow
              </div>
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-tr from-purple-400 to-pink-300 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                💖 Sweet
              </div>
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-tr from-rose-400 to-amber-200 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                🫰 Smile
              </div>
            </div>
            <p className="text-[10px] font-bold text-pink-700 text-center mt-2 tracking-tight">
              PHOTOBOOTH • SEOUL
            </p>
          </div>

          {/* Sample Strip 2: 35mm Vintage Film Strip */}
          <div className="w-38 sm:w-48 p-2.5 px-4 rounded-2xl bg-black border-2 border-zinc-700 shadow-2xl rotate-[2deg] hover:rotate-0 hover:scale-105 transition-all duration-300 z-10">
            <div className="flex flex-col gap-2">
              <div className="aspect-[4/3] rounded-sm bg-gradient-to-br from-amber-700 to-yellow-900 flex items-center justify-center text-amber-200 text-xs font-mono">
                KODAK 400
              </div>
              <div className="aspect-[4/3] rounded-sm bg-gradient-to-br from-stone-800 to-zinc-900 flex items-center justify-center text-zinc-300 text-xs font-mono">
                B&W NOIR
              </div>
              <div className="aspect-[4/3] rounded-sm bg-gradient-to-br from-orange-800 to-rose-900 flex items-center justify-center text-orange-200 text-xs font-mono">
                RETRO 80S
              </div>
            </div>
            <p className="text-[10px] font-mono text-zinc-400 text-center mt-2.5">
              35MM FILM • #04
            </p>
          </div>

          {/* Sample Strip 3: Cyberpunk Neon Strip */}
          <div className="hidden sm:block w-44 p-2 rounded-2xl bg-slate-950 border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)] rotate-[6deg] hover:rotate-0 hover:scale-105 transition-all duration-300">
            <div className="flex flex-col gap-1.5">
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                ⚡ Cyber
              </div>
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                🔮 Neon
              </div>
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-tr from-fuchsia-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                🪩 Party
              </div>
            </div>
            <p className="text-[10px] font-bold text-cyan-300 text-center mt-2">
              NEON NIGHTS
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-3 text-left">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/15 text-pink-400 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Live Camera Booth</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automated 4-shot photo booth countdown sessions with realistic mechanical shutter audio and screen flash animations.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-3 text-left">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">60+ Filters & Live Effects</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Vintage films, aesthetic pastel glow, cinematic noir, and real-time floating sparkles, hearts, confetti, and snow.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-3 text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">100% Device Privacy</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your camera feed and captured images never touch an external server. Everything is processed and stored locally.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
