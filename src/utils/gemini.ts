import { GoogleGenAI } from '@google/genai';
import { PhotoAdjustments } from '../types';

const GEMINI_KEY_STORAGE = 'photobooth_gemini_api_key';

export function getStoredGeminiApiKey(): string {
  try {
    return localStorage.getItem(GEMINI_KEY_STORAGE) || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
  } catch {
    return '';
  }
}

export function saveStoredGeminiApiKey(key: string): void {
  try {
    localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
  } catch {
    // Ignore
  }
}

export function removeStoredGeminiApiKey(): void {
  try {
    localStorage.removeItem(GEMINI_KEY_STORAGE);
  } catch {
    // Ignore
  }
}

export interface GeminiEnhanceResult {
  analysis: string;
  recommendedFilterId: string;
  adjustments: PhotoAdjustments;
  captions: string[];
  suggestedStickers: string[];
}

export async function analyzeAndEnhanceWithGemini(
  dataUrl: string,
  userApiKey?: string
): Promise<GeminiEnhanceResult> {
  const apiKey = userApiKey || getStoredGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key is required. Please provide a valid key.');
  }

  // Extract base64 without prefix
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0]?.match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const base64Data = parts[1] || parts[0];

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
You are an expert professional photo booth stylist and color grader.
Analyze this photo taken in a photobooth.
Provide:
1. "analysis": A short 1-2 sentence friendly observation about the photo lighting, subject mood, and aesthetic vibe.
2. "recommendedFilterId": Choose exactly ONE best matching filter from this list:
   ['bright', 'warm', 'cool', 'vibrant', 'vintage', 'retro', '90s', 'film', 'polaroid', 'kodak-style', 'classic-bw', 'noir', 'pink-glow', 'dreamy', 'pastel', 'peach', 'golden-glow', 'sunset', 'neon', 'teal-orange', 'moody', 'cyberpunk', 'instagram-style', 'selfie', 'influencer', 'clean']
3. "adjustments": Fine-tuning slider values to make this photo look stunning:
   - brightness: integer from -40 to 40 (0 is neutral)
   - contrast: integer from -30 to 40
   - saturation: integer from -30 to 45
   - temperature: integer from -40 (cooler/blue) to 40 (warmer/golden)
   - vignette: integer from 0 to 40 (edge shading)
   - grain: integer from 0 to 30 (analog film feel)
   - blur: 0
   - exposure: 0
   - sharpness: 0
4. "captions": An array of 3 fun, short, trendy photobooth captions suitable for stamping on a Korean/classic photo strip (under 30 characters each, with emojis).
5. "suggestedStickers": An array of 2-3 emoji suggestions that match this photo vibe.

Return ONLY valid JSON matching this structure with no markdown backticks:
{
  "analysis": "...",
  "recommendedFilterId": "...",
  "adjustments": {
    "brightness": 10,
    "contrast": 15,
    "saturation": 20,
    "temperature": 8,
    "vignette": 10,
    "grain": 12,
    "blur": 0,
    "exposure": 0,
    "sharpness": 0
  },
  "captions": ["Cute Moments ✨", "Best Vibes 💖", "Caught in 4K 📸"],
  "suggestedStickers": ["✨", "💖", "😎"]
}
`;

  const modelsToTry = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.5-flash-lite'];
  let responseText = '';
  let lastError: unknown = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType,
            },
          },
          prompt,
        ],
      });
      if (response.text) {
        responseText = response.text.trim();
        break;
      }
    } catch (err: unknown) {
      lastError = err;
      console.warn(`Model ${model} failed, attempting fallback...`, err);
    }
  }

  if (!responseText && lastError) {
    throw lastError;
  }

  const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim();

  try {
    const parsed = JSON.parse(cleanJson);
    return {
      analysis: parsed.analysis || 'Great portrait with balanced natural lighting!',
      recommendedFilterId: parsed.recommendedFilterId || 'vibrant',
      adjustments: {
        brightness: parsed.adjustments?.brightness ?? 10,
        contrast: parsed.adjustments?.contrast ?? 12,
        saturation: parsed.adjustments?.saturation ?? 15,
        temperature: parsed.adjustments?.temperature ?? 5,
        vignette: parsed.adjustments?.vignette ?? 10,
        grain: parsed.adjustments?.grain ?? 8,
        blur: 0,
        exposure: 0,
        sharpness: 0,
      },
      captions: Array.isArray(parsed.captions) && parsed.captions.length ? parsed.captions : ['Captured with Love ✨', 'Good Vibes Only 💖'],
      suggestedStickers: Array.isArray(parsed.suggestedStickers) && parsed.suggestedStickers.length ? parsed.suggestedStickers : ['✨', '💖'],
    };
  } catch {
    // Fallback if parsing fails
    return {
      analysis: 'Photo analyzed! Enhanced with vibrant color and gentle warmth.',
      recommendedFilterId: 'vibrant',
      adjustments: {
        brightness: 12,
        contrast: 15,
        saturation: 18,
        temperature: 6,
        vignette: 12,
        grain: 10,
        blur: 0,
        exposure: 0,
        sharpness: 0,
      },
      captions: ['Magic Moments ✨', 'Golden Hour Vibe 🌟'],
      suggestedStickers: ['✨', '📸'],
    };
  }
}

function getDefaultSmartResult(): GeminiEnhanceResult {
  return {
    analysis: 'Smart Analysis: Balanced lighting and enhanced portrait vibrance.',
    recommendedFilterId: 'pink-glow',
    adjustments: {
      brightness: 12,
      contrast: 15,
      saturation: 18,
      temperature: 8,
      vignette: 12,
      grain: 8,
      blur: 0,
      exposure: 0,
      sharpness: 0,
    },
    captions: ['Good Vibes Only ✨', 'Photo Booth Magic 💖', 'Smile Always 📸'],
    suggestedStickers: ['✨', '💖', '🫰'],
  };
}

export async function runOfflineSmartEnhance(dataUrl: string): Promise<GeminiEnhanceResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(getDefaultSmartResult());
          return;
        }
        ctx.drawImage(img, 0, 0, 64, 64);
        const data = ctx.getImageData(0, 0, 64, 64).data;

        let totalR = 0;
        let totalG = 0;
        let totalB = 0;
        let totalLuminance = 0;
        const pixelCount = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          totalR += r;
          totalG += g;
          totalB += b;
          totalLuminance += 0.299 * r + 0.587 * g + 0.114 * b;
        }

        const avgL = totalLuminance / pixelCount;
        const avgR = totalR / pixelCount;
        const avgB = totalB / pixelCount;

        const brightnessAdj = avgL < 110 ? 18 : avgL > 180 ? -8 : 10;
        const warmthAdj = avgR > avgB ? 6 : 12;
        const recFilter = avgR > avgB ? 'golden-glow' : 'pink-glow';

        resolve({
          analysis: `Smart Analysis: Photo balanced. Average scene luminance calculated at ${Math.round(avgL)}/255. Contrast and warmth optimized.`,
          recommendedFilterId: recFilter,
          adjustments: {
            brightness: brightnessAdj,
            contrast: 16,
            saturation: 18,
            temperature: warmthAdj,
            vignette: 12,
            grain: 10,
            blur: 0,
            exposure: 0,
            sharpness: 0,
          },
          captions: ['Main Character Energy ✨', 'Living in 4K 📸', 'Golden Hour Vibes 💖'],
          suggestedStickers: ['✨', '💖', '😎', '👑'],
        });
      } catch {
        resolve(getDefaultSmartResult());
      }
    };
    img.onerror = () => resolve(getDefaultSmartResult());
    img.src = dataUrl;
  });
}

