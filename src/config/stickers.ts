import { StickerItem } from '../types';

export const STICKERS: StickerItem[] = [
  // Hearts & Love
  { id: 'heart-sparkle', name: 'Sparkling Heart', category: 'hearts', content: '💖', isEmoji: true },
  { id: 'heart-fire', name: 'Heart on Fire', category: 'hearts', content: '❤️‍🔥', isEmoji: true },
  { id: 'heart-ribbon', name: 'Heart with Ribbon', category: 'hearts', content: '💝', isEmoji: true },
  { id: 'heart-two', name: 'Two Hearts', category: 'hearts', content: '💕', isEmoji: true },
  { id: 'heart-pink', name: 'Pink Heart', category: 'hearts', content: '🩷', isEmoji: true },
  { id: 'kiss-mark', name: 'Kiss Mark', category: 'hearts', content: '💋', isEmoji: true },
  { id: 'love-letter', name: 'Love Letter', category: 'hearts', content: '💌', isEmoji: true },

  // Stars & Sparkles
  { id: 'star-glowing', name: 'Glowing Star', category: 'stars', content: '⭐', isEmoji: true },
  { id: 'sparkles', name: 'Sparkles', category: 'stars', content: '✨', isEmoji: true },
  { id: 'shooting-star', name: 'Shooting Star', category: 'stars', content: '🌠', isEmoji: true },
  { id: 'dizzy-star', name: 'Dizzy Star', category: 'stars', content: '💫', isEmoji: true },
  { id: 'crystal-ball', name: 'Crystal Magic', category: 'stars', content: '🔮', isEmoji: true },

  // Accessories & Dress-up
  { id: 'crown-gold', name: 'Royal Crown', category: 'accessories', content: '👑', isEmoji: true },
  { id: 'sunglasses-cool', name: 'Cool Shades', category: 'accessories', content: '🕶️', isEmoji: true },
  { id: 'sunglasses-party', name: 'Retro Shades', category: 'accessories', content: '😎', isEmoji: true },
  { id: 'party-hat', name: 'Party Cone Hat', category: 'accessories', content: '🥳', isEmoji: true },
  { id: 'top-hat', name: 'Gentleman Top Hat', category: 'accessories', content: '🎩', isEmoji: true },
  { id: 'mustache-classic', name: 'Classic Mustache', category: 'accessories', content: '🥸', isEmoji: true },
  { id: 'pink-bow', name: 'Pink Ribbon Bow', category: 'accessories', content: '🎀', isEmoji: true },
  { id: 'graduation-cap', name: 'Graduation Cap', category: 'accessories', content: '🎓', isEmoji: true },
  { id: 'tiara', name: 'Princess Tiara', category: 'accessories', content: '👸', isEmoji: true },
  { id: 'headphone', name: 'Headphones', category: 'accessories', content: '🎧', isEmoji: true },

  // Flowers & Nature
  { id: 'cherry-blossom', name: 'Sakura Blossom', category: 'celebration', content: '🌸', isEmoji: true },
  { id: 'rose', name: 'Red Rose', category: 'celebration', content: '🌹', isEmoji: true },
  { id: 'sunflower', name: 'Sunflower', category: 'celebration', content: '🌻', isEmoji: true },
  { id: 'tulip', name: 'Tulip', category: 'celebration', content: '🌷', isEmoji: true },
  { id: 'four-leaf-clover', name: 'Lucky Clover', category: 'celebration', content: '🍀', isEmoji: true },
  { id: 'rainbow', name: 'Vibrant Rainbow', category: 'celebration', content: '🌈', isEmoji: true },

  // Emojis & Fun
  { id: 'peace-sign', name: 'Peace Sign', category: 'emojis', content: '✌️', isEmoji: true },
  { id: 'finger-heart', name: 'Finger Heart', category: 'emojis', content: '🫰', isEmoji: true },
  { id: 'wink-tongue', name: 'Winking Tongue', category: 'emojis', content: '😜', isEmoji: true },
  { id: 'star-eyes', name: 'Star Struck', category: 'emojis', content: '🤩', isEmoji: true },
  { id: 'heart-eyes', name: 'Heart Eyes', category: 'emojis', content: '😍', isEmoji: true },
  { id: 'fire', name: 'Lit Fire', category: 'emojis', content: '🔥', isEmoji: true },
  { id: 'camera-flash', name: 'Vintage Camera', category: 'emojis', content: '📸', isEmoji: true },

  // Birthday & Celebration
  { id: 'party-popper', name: 'Party Popper', category: 'celebration', content: '🎉', isEmoji: true },
  { id: 'birthday-cake', name: 'Birthday Cake', category: 'celebration', content: '🎂', isEmoji: true },
  { id: 'cupcake', name: 'Cupcake', category: 'celebration', content: '🧁', isEmoji: true },
  { id: 'balloon', name: 'Party Balloon', category: 'celebration', content: '🎈', isEmoji: true },
  { id: 'champagne', name: 'Champagne Cheers', category: 'celebration', content: '🥂', isEmoji: true },
  { id: 'disco-ball', name: 'Disco Ball', category: 'celebration', content: '🪩', isEmoji: true },

  // Cute Animals
  { id: 'cat-face', name: 'Cute Cat', category: 'accessories', content: '🐱', isEmoji: true },
  { id: 'dog-face', name: 'Playful Dog', category: 'accessories', content: '🐶', isEmoji: true },
  { id: 'bunny', name: 'Sweet Bunny', category: 'accessories', content: '🐰', isEmoji: true },
  { id: 'bear', name: 'Teddy Bear', category: 'accessories', content: '🧸', isEmoji: true },
  { id: 'butterfly', name: 'Butterfly', category: 'accessories', content: '🦋', isEmoji: true },

  // Food & Sweet
  { id: 'ice-cream', name: 'Soft Ice Cream', category: 'food', content: '🍦', isEmoji: true },
  { id: 'donut', name: 'Strawberry Donut', category: 'food', content: '🍩', isEmoji: true },
  { id: 'boba', name: 'Boba Milk Tea', category: 'food', content: '🧋', isEmoji: true },
  { id: 'lollipop', name: 'Sweet Lollipop', category: 'food', content: '🍭', isEmoji: true },
  { id: 'pizza', name: 'Pizza Slice', category: 'food', content: '🍕', isEmoji: true },

  // Holiday Stickers
  { id: 'santa', name: 'Santa Claus', category: 'holiday', content: '🎅', isEmoji: true },
  { id: 'xmas-tree', name: 'Christmas Tree', category: 'holiday', content: '🎄', isEmoji: true },
  { id: 'snowman', name: 'Snowman', category: 'holiday', content: '⛄', isEmoji: true },
  { id: 'jack-o-lantern', name: 'Pumpkin Halloween', category: 'holiday', content: '🎃', isEmoji: true },
  { id: 'ghost', name: 'Spooky Ghost', category: 'holiday', content: '👻', isEmoji: true },
];
