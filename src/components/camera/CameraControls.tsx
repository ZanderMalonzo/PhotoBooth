import React, { useState } from 'react';
import {
  Camera,
  SwitchCamera,
  FlipHorizontal,
  Timer,
  Maximize2,
  Sparkles,
  Settings,
  X,
} from 'lucide-react';
import { AspectRatio, CameraDevice, CountdownDuration } from '../../types';

interface CameraControlsProps {
  onCaptureSingle: () => void;
  onStartSession: () => void;
  isSessionActive: boolean;
  onCancelSession: () => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (r: AspectRatio) => void;
  countdownDuration: CountdownDuration;
  setCountdownDuration: (d: CountdownDuration) => void;
  isMirrored: boolean;
  toggleMirror: () => void;
  switchFacingMode: () => void;
  devices: CameraDevice[];
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  onCaptureSingle,
  onStartSession,
  isSessionActive,
  onCancelSession,
  aspectRatio,
  setAspectRatio,
  countdownDuration,
  setCountdownDuration,
  isMirrored,
  toggleMirror,
  switchFacingMode,
  devices,
  selectedDeviceId,
  setSelectedDeviceId,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const countdownOptions: { value: CountdownDuration; label: string }[] = [
    { value: 0, label: 'Off' },
    { value: 3, label: '3s' },
    { value: 5, label: '5s' },
    { value: 10, label: '10s' },
  ];

  const aspectOptions: AspectRatio[] = ['4:3', '1:1', '3:4', '16:9', '9:16'];

  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-4 select-none">
      {/* Top Quick Bar: Aspect Ratio, Countdown, Mirror, Camera Flip */}
      <div className="w-full flex items-center justify-between px-2 sm:px-4 py-2 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
        {/* Countdown Selector */}
        <div className="flex items-center gap-1">
          <Timer className="w-4 h-4 text-slate-400 ml-1 mr-0.5" />
          {countdownOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCountdownDuration(opt.value)}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
                countdownDuration === opt.value
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Aspect Ratio Buttons */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <Maximize2 className="w-3.5 h-3.5 text-slate-500 ml-1 mr-0.5" />
          {aspectOptions.map((ratio) => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition ${
                aspectRatio === ratio
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>

        {/* Utility Toggles: Mirror, Switch Cam, Settings */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleMirror}
            title={isMirrored ? 'Disable Mirror' : 'Enable Mirror'}
            className={`p-2 rounded-xl transition ${
              isMirrored
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={switchFacingMode}
            title="Switch Front / Back Camera"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <SwitchCamera className="w-4 h-4" />
          </button>

          {devices.length > 1 && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              title="Camera Settings"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Camera Device Dropdown Settings Modal */}
      {showSettings && (
        <div className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between animate-pop-in">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Device:</span>
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-pink-500"
            >
              <option value="">Default Automatic</option>
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="w-full flex items-center justify-center gap-4 sm:gap-6 pt-1">
        {isSessionActive ? (
          <button
            onClick={onCancelSession}
            className="px-6 py-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold hover:bg-rose-500/30 transition shadow-lg"
          >
            Cancel Session
          </button>
        ) : (
          <>
            {/* Start Photo Booth (4-Shot Strip Sequence) */}
            <button
              onClick={onStartSession}
              className="group relative flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
              <span>Start Photo Booth</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold ml-1">
                4 Shots
              </span>
            </button>

            {/* Instant Single Shot Shutter Button */}
            <button
              onClick={onCaptureSingle}
              title="Snap Single Photo"
              className="group relative w-16 h-16 sm:w-18 sm:h-18 rounded-full border-4 border-pink-500/60 p-1 flex items-center justify-center shadow-lg shadow-pink-500/20 hover:scale-105 active:scale-90 transition-all duration-200"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center shadow-inner group-hover:from-pink-400 group-hover:to-rose-300 transition">
                <Camera className="w-7 h-7 text-white" />
              </div>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
