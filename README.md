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
> **HTTPS Requirement**: The WebRTC Camera API (`navigator.mediaDevices.getUserMedia`) requires an **HTTPS** secure context in production. All cloud platforms below (Vercel, Netlify, Firebase, Cloudflare, GitHub Pages) provide free automatic SSL certificates.

---

### Option 1: Vercel (Recommended - Easiest & Fastest)

Vercel provides zero-configuration deployment with free global SSL.

#### Method A: Using Vercel CLI
1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```
2. Run deployment from the project directory:
   ```bash
   vercel
   ```
3. To deploy to production:
   ```bash
   vercel --prod
   ```

#### Method B: Using GitHub & Vercel Dashboard
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Initial PhotoBooth commit"
   git push origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. Framework Preset will automatically detect **Vite**.
5. Click **Deploy**. The `vercel.json` included in this repository handles SPA rewrites and camera permission policies.

---

### Option 2: Netlify

Netlify includes drag-and-drop or Git-based deployment.

#### Method A: Using Netlify CLI
1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Deploy:
   ```bash
   netlify deploy --prod --dir=dist
   ```

#### Method B: Drag & Drop
1. Run `npm run build` to generate the `dist` folder.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the `dist` folder into the upload area.

---

### Option 3: GitHub Pages

The repository includes a ready-to-use GitHub Actions workflow at `.github/workflows/deploy.yml`.

1. Push code to your GitHub repository.
2. In your repository on GitHub, go to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. The workflow will automatically trigger on push and publish your site!

---

### Option 4: Firebase Hosting

The repository includes `firebase.json` pre-configured.

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Login to Firebase:
   ```bash
   firebase login
   ```
3. Initialize hosting (or link to existing project):
   ```bash
   firebase init hosting
   ```
   *(Select `dist` as public directory and configure as single-page app).*
4. Build and deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

---

### Option 5: Docker Container (Self-Hosting / VPS / Railway / Render)

The repository includes a multi-stage `Dockerfile` and `nginx.conf`.

1. Build the Docker image:
   ```bash
   docker build -t photobooth .
   ```
2. Run the container on port 80:
   ```bash
   docker run -d -p 80:80 --name photobooth-app photobooth
   ```
3. Open `http://localhost` in your browser.
