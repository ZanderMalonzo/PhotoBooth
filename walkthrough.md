# PhotoBooth by Zander — Features & Deployment Guide

A modern, responsive, client-side **PhotoBooth Web Application** built with React, TypeScript, Vite, Tailwind CSS v4, HTML5 MediaDevices & Canvas APIs, Web Audio API, and **Google Gemini 2.5 Flash Multimodal AI**.

---

## 🤖 NEW: Google Gemini Multimodal AI Studio
Integrated directly into both the **Live Camera Booth** and the **Customization Studio**:

1. **Multimodal Photo Analysis (`gemini-2.5-flash`)**:
   - Inspects lighting conditions, facial expressions, and scene ambience.
   - Provides personalized AI observations (e.g., *"Natural warm daylight portrait with balanced lighting"*).
2. **Smart Sliders Auto-Tuning**:
   - Computes tailored adjustments for Brightness, Contrast, Saturation, Warmth, Vignette, and Film Grain.
   - 1-click **Apply Smart Tuning**.
3. **AI Style & Filter Matcher**:
   - Recommends the ideal filter from 70+ filters (e.g., *Golden Glow*, *Vintage 90s*, *Cyberpunk*, *Soft Pink*).
   - 1-click **Apply Filter**.
4. **AI Magic Captions**:
   - Generates 3 trendy, aesthetic photobooth captions with emojis.
   - 1-click to instantly stamp onto your photo strip in cute typography!
5. **Smart Sticker Matching**:
   - Suggests matching emojis and stickers based on photo mood.
6. **100% Client-Side API Key Storage**:
   - Enter your free Gemini API key once; it stays securely stored in your browser's `localStorage` and never leaves your device.

---

## 📸 Core PhotoBooth Features

### 1. Live Camera System
- **Real-Time Video Stream**: Directly connects to webcam with automatic device detection (`navigator.mediaDevices.enumerateDevices`).
- **Camera Switching**: Toggle between front (selfie) and rear (environment) cameras or select specific camera input devices.
- **Mirror Mode**: Instant horizontal flip toggle for authentic selfie booth experience.
- **Aspect Ratio Selector**: 4:3, 1:1 Square, 3:4 Portrait, 16:9 Landscape, 9:16 Mobile Story.
- **Countdowns**: 3s, 5s, 10s, or instant (Off).
- **Animated 3 -> 2 -> 1 -> 📸 Overlay**: High-impact pulsing animated countdown numbers with Web Audio API sound beeps.
- **Flash Animation**: High-intensity screen flash overlay mimicking a studio strobe.
- **Synthesized Audio Effects**: In-browser sound synthesis for countdown ticks, mechanical SLR shutter click, and celebration fanfare without needing external audio files.

---

### 2. Comprehensive Filter Library (70+ Filters Across 8 Categories)
1. **🌈 Basic Filters**: Original, Bright, Contrast, Saturation, Warm, Cool, Fade, Vibrant, Soft, Sharp, Matte, Crisp.
2. **🎞️ Vintage Filters**: Vintage, Retro, 90s, 80s, Film, Polaroid, Old Camera, Faded Film, Disposable Camera, VHS, Kodak-style, Sepia.
3. **🖤 Black & White Filters**: Classic B&W, High Contrast B&W, Soft B&W, Noir, Dramatic, Newspaper, Silver.
4. **💕 Cute / Aesthetic Filters**: Pink Glow, Dreamy, Soft Pink, Pastel, Peach, Lavender, Bubblegum, Sweet, Angel, Cloudy, Romantic, Kawaii.
5. **✨ Glow Effects**: Golden Glow, Sunset, Neon, Blue Glow, Purple Glow, Pink Glow, Rainbow, Sparkle, Dream Glow, Light Leak.
6. **🎬 Cinematic Filters**: Cinema, Hollywood, Dark Cinema, Teal & Orange, Moody, Dramatic Film, Movie Night, Cyberpunk.
7. **📱 Social Media Filters**: Instagram-style, TikTok-style, Selfie, Influencer, Clean, Aesthetic, Minimal, Trending.
8. **😂 Fun Warps & Distortions**: Big Head, Small Face, Funny Face, Cartoon/Posterize, Pixelate, Fish Eye, Horizontal Mirror, Kaleidoscope (4-way symmetry), Wave Distortion.
- **Surprise Me 🎲**: Automatically picks a random filter.
- **Favorite Filters ❤️**: Persistent favorite toggle with LocalStorage support.
- **Filter Intensity Slider 🎚️**: Smooth 0% to 100% blend slider.
- **Before / After 👁️**: Hold to compare button to temporarily view unfiltered preview.
- **Auto Enhance ✨**: Instant 1-click tone optimization.
- **Gemini AI 🤖**: Multimodal AI lighting and style analysis.

---

### 3. Layered Real-Time Particle Effects
- Multi-select particle overlays rendered using an optimized 60fps `requestAnimationFrame` canvas engine:
  - **Floating Hearts** 💖, **Stars & Sparkles** ⭐ ✨, **Falling Confetti** 🎉, **Sakura Petals** 🌸, **Gentle Snow** ❄️, **Rain Streaks** 🌧️, **Rising Fire Embers** 🔥, **Iridescent Bubbles** 🫧, **Falling Autumn Leaves** 🍂, **Neon Electric Particles** ⚡, **Glitter Dust** 💫, **Vintage Light Leaks & Lens Flare** 🏮 ☀️, **35mm Film Grain & VHS Static Noise** 🎞️ 📼.
- Multiple effects can be enabled and combined simultaneously!

---

### 4. Photo Session Booth Mode
- Automated multi-shot booth sequence (e.g. 4 photos in sequence).
- Status counter: **PHOTO 1 / 4**, **PHOTO 2 / 4**, etc.
- 3... 2... 1... 📸 -> Flash -> Shutter sound -> Short pose interval -> Next shot.
- Celebratory confetti explosion on completion with sound fanfare: **"Your Photo Strip is Ready! 🎉"**.

---

### 5. Layout & Customization Studio
- **Layouts**: Vertical strips (2, 3, 4, 5, 6), grids (2x2, 3x3, 4x4), and creative formats (Polaroid, 35mm film negative with sprocket holes, Magazine cover, Scrapbook, Postcard, Square, 9:16 Story) with photo re-ordering.
- **Backgrounds**: Solid colors, pastels, gradients, patterns, and custom hex color picker.
- **Frames**: Classic White, Polaroid, 35mm Film, Retro 80s, Glowing Cyber Neon, Sweet Heart, Floral, Birthday, Wedding, Christmas, Halloween.
- **Stickers**: 50+ categorized stickers with drag-and-drop, scale, rotation, and deletion.
- **Typography**: 6 distinct font styles (Modern, Handwritten, Retro Bold, Bubble Cute, Elegant Serif, Pixel 8-bit) with color, shadow, outline, alignment, and rotation controls.
- **Photo Editor**: Fine-tuning sliders for brightness, contrast, saturation, exposure, warmth, blur, vignette, and grain.

---

### 6. Export, Share, Print & QR Code
- Lossless PNG, JPG, and WebP downloads at 300-DPI print quality.
- Web Share API and native clipboard copy.
- Printable 2x6" photo strip formatting.
- Instant QR code generator for mobile scanning.
- Client-side Photo Vault (IndexedDB) with privacy protection: **"Your photos stay on your device."**

---

## 🚀 Push to GitHub & Deploy to Vercel

```powershell
git push -u origin main
```

Then go to [vercel.com/new](https://vercel.com/new), select `ZanderMalonzo/PhotoBooth`, and click **Deploy**!
