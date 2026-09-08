# 📸 PhotoBooth by Zander

A modern, fun, responsive **PhotoBooth Web Application** built with React, TypeScript, Vite, Tailwind CSS, and HTML5 Canvas & MediaDevices APIs.

---

## ✨ Features

- **Live Camera Experience**: Full webcam stream with front/back camera switching, mirror mode toggle, aspect ratio controls (1:1, 4:3, 3:4, 16:9, 9:16), animated countdown (3 → 2 → 1 → 📸), and screen flash.
- **Synthesized Sound Effects**: In-browser Web Audio API sound generator for countdown ticks, mechanical SLR shutter snap, and victory fanfare with mute controls.
- **70+ Filter Library**: Basic, Vintage, Black & White, Cute / Aesthetic, Glow Effects, Cinematic, Social Media, and Fun Warps (Big Head, Small Face, Fish Eye, Mirror, Kaleidoscope, Pixelate, Cartoon).
- **Extra Filter Features**: 🎲 *Surprise Me*, ❤️ *Favorites*, 🕒 *Recently Used*, 👁️ *Before/After Hold to Compare*, ✨ *Auto Enhance*, and 0–100% *Intensity Slider*.
- **Layered Particle Effects**: Real-time canvas overlay particles: floating hearts, stars, sparkles, confetti, sakura petals, snow, rain, fireplace embers, iridescent bubbles, autumn leaves, neon particles, lens flare, light leaks, film grain, and VHS noise.
- **Photo Booth Session Flow**: Automated 4-shot sequence with live counter (`PHOTO 1 / 4`), flash, audio cues, and celebration confetti.
- **Layout Studio**: Vertical strips (2–6 photos), grids (2x2, 3x3, 4x4), and creative templates (Polaroid, 35mm film negative with sprocket holes, Magazine cover, Scrapbook, Postcard, Square, 9:16 Story) with photo re-ordering.
- **Frames & Backgrounds**: Classic, Polaroid, 35mm Film, Retro, Neon glow, Heart, Floral, Birthday, Wedding, Christmas, Halloween + solid colors, pastels, gradients, and custom hex color picker.
- **Stickers & Typography**: 50+ categorized stickers with drag-and-drop, scale, rotation, and deletion. 6 typography styles (Modern, Handwritten, Retro, Bubble, Elegant, Pixel) with shadow, outline, alignment, and color picker.
- **Photo Editor**: Fine-tuning adjustments for brightness, contrast, saturation, warmth, blur, vignette, and grain.
- **300-DPI Export & Sharing**: PNG, JPG, WebP downloads, Web Share API, Clipboard Copy, 2x6" Print styling, QR Code mobile transfer, and client-side IndexedDB Photo Vault.
- **100% On-Device Privacy**: All photos are processed client-side. Nothing is uploaded to external servers.

---

## 🚀 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build Locally
```bash
npm run preview
```

---

## 🌐 Deployment Options

> [!IMPORTANT]
> **HTTPS Requirement**: The WebRTC Camera API (`navigator.mediaDevices.getUserMedia`) requires an **HTTPS** secure context in production. Vercel automatically provides free global SSL certificates on all deployments.

---

## 🌐 Deploy to Vercel

The project includes [`vercel.json`](file:///c:/Users/zander/OneDrive/ZanderIT/OneDrive/IT/Photobooth%20by%20Zander/vercel.json) pre-configured with SPA rewrites and `Permissions-Policy: camera=*` headers so camera access works out of the box.

### Method A: Deploy via GitHub (Recommended)
1. Push your code to your repository:
   ```bash
   git push -u origin main
   ```
2. Go to **[vercel.com/new](https://vercel.com/new)**.
3. Import **`ZanderMalonzo/PhotoBooth`**.
4. Click **Deploy**.

### Method B: Deploy via Vercel CLI
1. Run deployment:
   ```bash
   npx vercel
   ```
2. To deploy directly to production:
   ```bash
   npx vercel --prod
   ```

