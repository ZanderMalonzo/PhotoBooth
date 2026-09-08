# PhotoBooth Web Application - Walkthrough

A modern, responsive, client-side **PhotoBooth Web Application** built with React, TypeScript, Vite, Tailwind CSS v4, HTML5 MediaDevices & Canvas APIs, and Web Audio API.

---

## 📸 Key Features Delivered

### 1. Live Camera System
- **Real-Time Video Stream**: Directly connects to webcam with automatic device detection (`navigator.mediaDevices.enumerateDevices`).
- **Camera Switching**: Toggle between front (selfie) and rear (environment) cameras or pick specific camera input devices.
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

---

### 3. Layered Real-Time Particle Effects
- Multi-select particle overlays rendered using an optimized 60fps `requestAnimationFrame` canvas engine:
  - **Floating Hearts** 💖
  - **Stars & Sparkles** ⭐ ✨
  - **Falling Confetti** 🎉
  - **Sakura Petals** 🌸
  - **Gentle Snow** ❄️
  - **Rain Streaks** 🌧️
  - **Rising Fire Embers** 🔥
  - **Iridescent Bubbles** 🫧
  - **Falling Autumn Leaves** 🍂
  - **Neon Electric Particles** ⚡
  - **Glitter Dust** 💫
  - **Vintage Light Leaks & Lens Flare** 🏮 ☀️
  - **35mm Film Grain & VHS Static Noise** 🎞️ 📼
- Multiple effects can be enabled and combined simultaneously!

---

### 4. Photo Session Booth Mode
- Automated multi-shot booth sequence (e.g. 4 photos in sequence).
- Status counter: **PHOTO 1 / 4**, **PHOTO 2 / 4**, etc.
- 3... 2... 1... 📸 -> Flash -> Shutter sound -> Short pose interval -> Next shot.
- Celebratory confetti explosion on completion with sound fanfare: **"Your Photo Strip is Ready! 🎉"**.

---

### 5. Layout & Customization Studio
- **Layouts**:
  - Photo Strips: 2-Strip, 3-Strip, 4-Strip (classic Korean booth), 5-Strip, 6-Strip.
  - Grids: 2x2, 3x3, 4x4.
  - Creative & Social: Polaroid Instant, 35mm Film Negative with sprocket holes, Magazine Cover, Scrapbook, Postcard, Square, 9:16 Story.
  - Photo Reordering: Move photos up/down or remove individual shots.
- **Backgrounds**:
  - Solid colors (White, Cream, Black, Pastel Pink, Pastel Blue, Lavender, Mint, Peach).
  - Premium Gradients (Sunset, Cyberpunk, Cotton Candy, Aurora, Dark Gold, Bubblegum).
  - Patterns (Polka Dots, Checkered).
  - Custom Hex Color Picker.
- **Frames**:
  - Classic White, Polaroid Chin, 35mm Film Sprockets, Retro 80s, Glowing Cyber Neon, Sweet Heart, Floral Romance, Birthday Party, Wedding Elegance, Christmas, Halloween.
- **Stickers Library (50+ items)**:
  - Categories: Hearts, Stars, Dress-Up Accessories (Sunglasses, Party Hats, Crowns, Bows, Mustaches), Cute Emojis, Celebration, Food, Holiday.
  - Interactive manipulation: Drag directly on the preview card, scale slider (0.5x - 3.0x), rotate slider (-180° to +180°), delete sticker.
- **Typography & Text Studio**:
  - 6 distinctive font styles: Modern Clean (*Plus Jakarta Sans*), Handwritten (*Caveat*), Retro Bold (*Bebas Neue*), Bubble Cute (*Fredoka*), Elegant Serif (*Playfair Display*), 8-Bit Pixel (*Press Start 2P*).
  - Size slider, color picker + presets, Bold, Italic, Alignment (Left, Center, Right), Drop Shadow, Outline/Stroke, Rotation.
  - Draggable directly on the preview canvas.
- **Fine-Tuning Adjustments**:
  - Sliders for Brightness, Contrast, Saturation, Warmth/Temperature, Blur, Vignette, Film Grain.
  - "Reset All" button.

---

### 6. Export, Share, Print & QR Code
- **High-Resolution Canvas Compositor**: 300-DPI crystal clear rendering for print-grade photo booth strips.
- **Multi-Format Export**: PNG (lossless), JPG (compact), WebP (modern).
- **Web Share API**: Share directly to mobile share sheets.
- **Clipboard Copy**: Direct image copy to system clipboard.
- **Instant Print**: Print 2x6" standard strips with print CSS formatting.
- **QR Code Sharing**: Instant QR code generator for scanning and mobile pairing.
- **Local Vault (IndexedDB)**: Client-side photo vault allowing users to review, re-download, or delete saved photo strips anytime.

---

## 🔒 Privacy Guarantee
- Displayed prominently in header and footer:
  > **100% Private — Your photos stay on your device.**
  > No server uploads, no cookies, no tracking.

---

## 🛠️ Verification Results
- **TypeScript & Vite Build**: Passed with `tsc -b && vite build` (0 errors, 0 warnings).
- **Local Dev Server**: Active at `http://localhost:5174/`.
