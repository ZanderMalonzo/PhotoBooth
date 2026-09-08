import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { HomePage } from './pages/HomePage';
import { BoothPage } from './pages/BoothPage';
import { EditorPage } from './pages/EditorPage';
import { GalleryPage } from './pages/GalleryPage';
import { CapturedPhoto } from './types';
import { getAllPhotoStrips } from './utils/storage';
import { SAMPLE_PHOTOS } from './utils/samplePhotos';
import { Camera, Sparkles, Shield, Heart } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'booth' | 'editor' | 'gallery'>('home');
  const [photos, setPhotos] = useState<CapturedPhoto[]>(SAMPLE_PHOTOS);
  const [savedCount, setSavedCount] = useState<number>(0);

  const refreshVaultCount = async () => {
    try {
      const strips = await getAllPhotoStrips();
      setSavedCount(strips.length);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    refreshVaultCount();
  }, []);

  // When a booth session completes or user captures photo
  const handleSessionComplete = (captured: CapturedPhoto[]) => {
    setPhotos(captured);
    refreshVaultCount();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-pink-500 selection:text-white">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        savedCount={savedCount}
      />

      {/* Main Page Content */}
      <main className="flex-1 w-full flex flex-col items-center">
        {currentTab === 'home' && (
          <HomePage
            onStartBooth={() => setCurrentTab('booth')}
            onExploreFilters={() => setCurrentTab('booth')}
            onCreateStrip={() => setCurrentTab('editor')}
            savedCount={savedCount}
          />
        )}

        {currentTab === 'booth' && (
          <BoothPage
            onSessionComplete={handleSessionComplete}
            onOpenStudio={() => setCurrentTab('editor')}
            capturedPhotosCount={photos.length}
          />
        )}

        {currentTab === 'editor' && (
          <EditorPage
            photos={photos}
            onRetake={() => setCurrentTab('booth')}
            onUpdatePhotos={(updated) => setPhotos(updated)}
          />
        )}

        {currentTab === 'gallery' && (
          <GalleryPage
            onStartBooth={() => setCurrentTab('booth')}
            onRefreshCount={refreshVaultCount}
          />
        )}
      </main>

      {/* Modern Responsive Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-6 px-4 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Camera className="w-3 h-3" />
            </div>
            <span className="font-bold text-slate-300">PhotoBooth by Zander</span>
            <span>• Studio Grade Web Photo Experience</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>100% Private — Your photos stay on your device</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for creative memories</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
