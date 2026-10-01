// Avatar Assets Imports
// Skin
import skinLight from '../assets/avatar/skin/light.svg';
import skinWarm from '../assets/avatar/skin/warm.svg';
import skinMedium from '../assets/avatar/skin/medium.svg';
import skinDeep from '../assets/avatar/skin/deep.svg';

// Eyes
import eyesSimple from '../assets/avatar/eyes/simple.svg';
import eyesRound from '../assets/avatar/eyes/round.svg';
import eyesHappy from '../assets/avatar/eyes/happy.svg';
import eyesFocused from '../assets/avatar/eyes/focused.svg';

// Hair
import hairShort from '../assets/avatar/hair/short.svg';
import hairLong from '../assets/avatar/hair/long.svg';
import hairBob from '../assets/avatar/hair/bob.svg';
import hairCurly from '../assets/avatar/hair/curly.svg';
import hairSpiky from '../assets/avatar/hair/spiky.svg';
import hairCap from '../assets/avatar/hair/cap.svg';

// Outfits
import outfitCasual from '../assets/avatar/outfits/casual.svg';
import outfitStudent from '../assets/avatar/outfits/student.svg';
import outfitHoodie from '../assets/avatar/outfits/hoodie.svg';
import outfitRetro from '../assets/avatar/outfits/retro.svg';
import outfitProfessional from '../assets/avatar/outfits/professional.svg';

// Accessories
import accNone from '../assets/avatar/accessories/none.svg';
import accGlasses from '../assets/avatar/accessories/glasses.svg';
import accHeadphones from '../assets/avatar/accessories/headphones.svg';
import accCap from '../assets/avatar/accessories/cap.svg';
import accHairpin from '../assets/avatar/accessories/hairpin.svg';

// Backgrounds
import bgNone from '../assets/avatar/backgrounds/none.svg';
import bgStudio from '../assets/avatar/backgrounds/studio.svg';
import bgTerminal from '../assets/avatar/backgrounds/terminal.svg';
import bgSunset from '../assets/avatar/backgrounds/sunset.svg';
import bgLavender from '../assets/avatar/backgrounds/lavender.svg';
import bgGrid from '../assets/avatar/backgrounds/grid.svg';

export const DEFAULT_AVATAR_CONFIG = {
  skin: 'light',
  hair: 'short',
  eyes: 'simple',
  outfit: 'casual',
  accessory: 'none',
  background: 'studio'
};

export const AVATAR_CATEGORIES = [
  {
    id: 'skin',
    label: 'Skin Tone',
    icon: '✨',
    badge: 'Base',
    description: 'Tone and silhouette for base pixel body',
    options: [
      { id: 'light', label: 'Light', asset: skinLight, colorChip: '#FFDCB6' },
      { id: 'warm', label: 'Warm', asset: skinWarm, colorChip: '#F4B886' },
      { id: 'medium', label: 'Medium', asset: skinMedium, colorChip: '#C68642' },
      { id: 'deep', label: 'Deep', asset: skinDeep, colorChip: '#845028' }
    ]
  },
  {
    id: 'hair',
    label: 'Hair Style',
    icon: '✂️',
    badge: 'Cut',
    description: 'Retro hair shapes and headwear',
    options: [
      { id: 'short', label: 'Short', asset: hairShort },
      { id: 'long', label: 'Long', asset: hairLong },
      { id: 'bob', label: 'Bob', asset: hairBob },
      { id: 'curly', label: 'Curly', asset: hairCurly },
      { id: 'spiky', label: 'Spiky', asset: hairSpiky },
      { id: 'cap', label: 'Pixel Cap', asset: hairCap }
    ]
  },
  {
    id: 'eyes',
    label: 'Eyes',
    icon: '👀',
    badge: 'Look',
    description: 'Facial expression and eye shape',
    options: [
      { id: 'simple', label: 'Simple', asset: eyesSimple },
      { id: 'round', label: 'Round', asset: eyesRound },
      { id: 'happy', label: 'Happy', asset: eyesHappy },
      { id: 'focused', label: 'Focused', asset: eyesFocused }
    ]
  },
  {
    id: 'outfit',
    label: 'Outfit',
    icon: '👕',
    badge: 'Wear',
    description: 'PixelDesk apparel and retro garments',
    options: [
      { id: 'casual', label: 'Casual', asset: outfitCasual },
      { id: 'student', label: 'Student', asset: outfitStudent },
      { id: 'hoodie', label: 'Hoodie', asset: outfitHoodie },
      { id: 'retro', label: 'Retro', asset: outfitRetro },
      { id: 'professional', label: 'Professional', asset: outfitProfessional }
    ]
  },
  {
    id: 'accessory',
    label: 'Accessories',
    icon: '👓',
    badge: 'Gear',
    description: 'Eyewear, headgear, and decor',
    options: [
      { id: 'none', label: 'None', asset: accNone },
      { id: 'glasses', label: 'Glasses', asset: accGlasses },
      { id: 'headphones', label: 'Headphones', asset: accHeadphones },
      { id: 'cap', label: 'Cap', asset: accCap },
      { id: 'hairpin', label: 'Hair accessory', asset: accHairpin }
    ]
  },
  {
    id: 'background',
    label: 'Backdrop',
    icon: '🖼️',
    badge: 'Scene',
    description: 'Atmospheric pixel backdrop',
    options: [
      { id: 'studio', label: 'Studio Warm', asset: bgStudio, colorChip: '#EDE5D3' },
      { id: 'terminal', label: 'Terminal', asset: bgTerminal, colorChip: '#182232' },
      { id: 'sunset', label: 'Sunset Glow', asset: bgSunset, colorChip: '#E76F51' },
      { id: 'lavender', label: 'Lavender Dusk', asset: bgLavender, colorChip: '#8D86C9' },
      { id: 'grid', label: 'Graph Paper', asset: bgGrid, colorChip: '#24324A' },
      { id: 'none', label: 'Minimal', asset: bgNone, colorChip: 'transparent' }
    ]
  }
];

export const ASSET_MAP = {
  skin: {
    light: skinLight,
    warm: skinWarm,
    medium: skinMedium,
    deep: skinDeep
  },
  hair: {
    short: hairShort,
    long: hairLong,
    bob: hairBob,
    curly: hairCurly,
    spiky: hairSpiky,
    cap: hairCap
  },
  eyes: {
    simple: eyesSimple,
    round: eyesRound,
    happy: eyesHappy,
    focused: eyesFocused
  },
  outfit: {
    casual: outfitCasual,
    student: outfitStudent,
    hoodie: outfitHoodie,
    retro: outfitRetro,
    professional: outfitProfessional
  },
  accessory: {
    none: accNone,
    glasses: accGlasses,
    headphones: accHeadphones,
    cap: accCap,
    hairpin: accHairpin
  },
  background: {
    none: bgNone,
    studio: bgStudio,
    terminal: bgTerminal,
    sunset: bgSunset,
    lavender: bgLavender,
    grid: bgGrid
  }
};

export function getRandomAvatarConfig() {
  const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  return {
    skin: randomPick(AVATAR_CATEGORIES.find(c => c.id === 'skin').options).id,
    hair: randomPick(AVATAR_CATEGORIES.find(c => c.id === 'hair').options).id,
    eyes: randomPick(AVATAR_CATEGORIES.find(c => c.id === 'eyes').options).id,
    outfit: randomPick(AVATAR_CATEGORIES.find(c => c.id === 'outfit').options).id,
    accessory: randomPick(AVATAR_CATEGORIES.find(c => c.id === 'accessory').options).id,
    background: randomPick(AVATAR_CATEGORIES.find(c => c.id === 'background').options).id
  };
}

export function sanitizeAvatarConfig(saved) {
  if (!saved || typeof saved !== 'object') {
    return { ...DEFAULT_AVATAR_CONFIG };
  }

  const result = {};
  for (const cat of AVATAR_CATEGORIES) {
    const validIds = cat.options.map(o => o.id);
    if (saved[cat.id] && validIds.includes(saved[cat.id])) {
      result[cat.id] = saved[cat.id];
    } else {
      result[cat.id] = DEFAULT_AVATAR_CONFIG[cat.id];
    }
  }
  return result;
}
