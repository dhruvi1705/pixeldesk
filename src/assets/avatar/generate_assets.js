import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function makeSvg(content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges" width="100%" height="100%">
${content}
</svg>`;
}

function rect(x, y, w, h, fill) {
  return `  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" />`;
}

// -------------------------------------------------------------
// 1. SKIN / BASE BODY
// -------------------------------------------------------------
const skinTones = {
  light: {
    main: '#FFDCB6',
    shadow: '#F0BC8E',
    highlight: '#FFEAD2',
    blush: '#FF9F93',
    outline: '#24324A',
    earShadow: '#E5A575'
  },
  warm: {
    main: '#F4B886',
    shadow: '#D89662',
    highlight: '#FFC89C',
    blush: '#E57F70',
    outline: '#24324A',
    earShadow: '#BF7E4D'
  },
  medium: {
    main: '#C68642',
    shadow: '#A5672A',
    highlight: '#D99B58',
    blush: '#9E502B',
    outline: '#24324A',
    earShadow: '#8C521E'
  },
  deep: {
    main: '#845028',
    shadow: '#663B19',
    highlight: '#996035',
    blush: '#572710',
    outline: '#24324A',
    earShadow: '#522C11'
  }
};

function generateSkin(colors) {
  const { main, shadow, highlight, blush, outline, earShadow } = colors;
  const parts = [];

  // Head Outline & Silhouette
  // Top of head / skull
  parts.push(rect(11, 7, 10, 1, outline));
  parts.push(rect(10, 8, 1, 2, outline));
  parts.push(rect(21, 8, 1, 2, outline));

  // Head base fill
  parts.push(rect(11, 8, 10, 10, main));
  // Head highlights
  parts.push(rect(12, 8, 6, 1, highlight));
  parts.push(rect(11, 9, 2, 2, highlight));

  // Ears
  parts.push(rect(8, 12, 2, 4, outline));
  parts.push(rect(9, 13, 1, 2, earShadow));
  parts.push(rect(22, 12, 2, 4, outline));
  parts.push(rect(22, 13, 1, 2, earShadow));

  // Cheeks / Jaw outline & fill
  parts.push(rect(10, 10, 1, 7, outline));
  parts.push(rect(21, 10, 1, 7, outline));
  parts.push(rect(11, 17, 1, 1, outline));
  parts.push(rect(20, 17, 1, 1, outline));
  parts.push(rect(12, 18, 8, 1, outline));

  // Jaw & Neck shadow
  parts.push(rect(11, 16, 10, 1, shadow));
  parts.push(rect(12, 17, 8, 1, shadow));

  // Neck
  parts.push(rect(13, 19, 1, 3, outline));
  parts.push(rect(18, 19, 1, 3, outline));
  parts.push(rect(14, 19, 4, 3, main));
  parts.push(rect(14, 19, 4, 1, shadow)); // neck shadow under chin

  // Cute subtle blush
  parts.push(rect(11, 15, 2, 1, blush));
  parts.push(rect(19, 15, 2, 1, blush));

  // Cute nose
  parts.push(rect(15, 15, 2, 1, shadow));
  // Smile / mouth
  parts.push(rect(15, 17, 2, 1, outline));

  // Shoulders & Chest base (in case outfit has neck opening)
  parts.push(rect(12, 22, 8, 3, main));
  parts.push(rect(14, 22, 4, 1, highlight));

  // Hands (peeking at bottom corners)
  parts.push(rect(5, 28, 3, 3, outline));
  parts.push(rect(6, 28, 2, 2, main));
  parts.push(rect(6, 29, 2, 1, shadow));

  parts.push(rect(24, 28, 3, 3, outline));
  parts.push(rect(24, 28, 2, 2, main));
  parts.push(rect(24, 29, 2, 1, shadow));

  return makeSvg(parts.join('\n'));
}

// -------------------------------------------------------------
// 2. EYES
// -------------------------------------------------------------
function generateEyes(type) {
  const parts = [];
  const dark = '#24324A';
  const white = '#FFFFFF';
  const teal = '#4E9F9A';
  const lightTeal = '#A3E3DE';

  if (type === 'simple') {
    // Left eye (x: 12..13, y: 13..14)
    parts.push(rect(12, 13, 2, 2, dark));
    parts.push(rect(12, 13, 1, 1, white)); // catchlight

    // Right eye (x: 18..19, y: 13..14)
    parts.push(rect(18, 13, 2, 2, dark));
    parts.push(rect(18, 13, 1, 1, white)); // catchlight

    // Subtle eyebrows
    parts.push(rect(12, 11, 2, 1, dark));
    parts.push(rect(18, 11, 2, 1, dark));
  } else if (type === 'round') {
    // Big round cute retro eyes
    // Left eye
    parts.push(rect(11, 12, 4, 1, dark)); // top lash
    parts.push(rect(11, 13, 1, 2, dark));
    parts.push(rect(14, 13, 1, 2, dark));
    parts.push(rect(12, 15, 2, 1, dark)); // bottom
    parts.push(rect(12, 13, 2, 2, teal)); // iris
    parts.push(rect(12, 13, 1, 1, white)); // highlight
    parts.push(rect(13, 14, 1, 1, lightTeal));

    // Right eye
    parts.push(rect(17, 12, 4, 1, dark)); // top lash
    parts.push(rect(17, 13, 1, 2, dark));
    parts.push(rect(20, 13, 1, 2, dark));
    parts.push(rect(18, 15, 2, 1, dark)); // bottom
    parts.push(rect(18, 13, 2, 2, teal)); // iris
    parts.push(rect(18, 13, 1, 1, white)); // highlight
    parts.push(rect(19, 14, 1, 1, lightTeal));

    // Eyebrows
    parts.push(rect(12, 10, 3, 1, dark));
    parts.push(rect(17, 10, 3, 1, dark));
  } else if (type === 'happy') {
    // Smiling closed arc eyes ^ ^
    // Left arc
    parts.push(rect(12, 14, 1, 1, dark));
    parts.push(rect(13, 13, 2, 1, dark));
    parts.push(rect(15, 14, 1, 1, dark));

    // Right arc
    parts.push(rect(17, 14, 1, 1, dark));
    parts.push(rect(18, 13, 2, 1, dark));
    parts.push(rect(20, 14, 1, 1, dark));

    // Cheerful high eyebrows
    parts.push(rect(12, 11, 2, 1, dark));
    parts.push(rect(18, 11, 2, 1, dark));
  } else if (type === 'focused') {
    // Sharp focused / determined eyes
    // Angled eyebrows
    parts.push(rect(11, 11, 2, 1, dark));
    parts.push(rect(13, 12, 2, 1, dark));
    parts.push(rect(17, 12, 2, 1, dark));
    parts.push(rect(19, 11, 2, 1, dark));

    // Left eye sharp slit
    parts.push(rect(12, 13, 3, 1, dark));
    parts.push(rect(12, 14, 1, 1, white));
    parts.push(rect(13, 14, 2, 1, dark));

    // Right eye sharp slit
    parts.push(rect(17, 13, 3, 1, dark));
    parts.push(rect(17, 14, 2, 1, dark));
    parts.push(rect(19, 14, 1, 1, white));
  }

  return makeSvg(parts.join('\n'));
}

// -------------------------------------------------------------
// 3. HAIR
// -------------------------------------------------------------
function generateHair(style) {
  const parts = [];
  const base = '#24324A';       // Navy primary hair
  const shadow = '#172233';     // Darker navy
  const highlight = '#4E5F80';  // Highlight luster
  const light = '#7588AC';

  if (style === 'short') {
    // Modern classic side-swept short cut
    parts.push(rect(10, 5, 12, 1, shadow));
    parts.push(rect(9, 6, 14, 2, base));
    parts.push(rect(8, 8, 16, 2, base));
    // Hair volume highlight
    parts.push(rect(11, 6, 8, 1, highlight));
    parts.push(rect(13, 7, 5, 1, light));

    // Bangs & sideburns
    parts.push(rect(8, 10, 2, 3, base));
    parts.push(rect(22, 10, 2, 3, base));
    parts.push(rect(10, 9, 3, 2, base));
    parts.push(rect(13, 9, 4, 1, base));
    parts.push(rect(16, 10, 2, 1, base));
    parts.push(rect(19, 9, 3, 2, shadow));
  } else if (style === 'long') {
    // Elegant flowing long hair
    // Crown
    parts.push(rect(10, 5, 12, 2, shadow));
    parts.push(rect(9, 7, 14, 3, base));
    parts.push(rect(12, 6, 7, 1, highlight));
    parts.push(rect(13, 7, 4, 1, light));

    // Bangs
    parts.push(rect(11, 9, 4, 2, base));
    parts.push(rect(17, 9, 4, 2, base));
    parts.push(rect(15, 9, 2, 1, shadow));

    // Left long tresses falling over shoulders
    parts.push(rect(7, 9, 3, 7, base));
    parts.push(rect(6, 16, 4, 9, base));
    parts.push(rect(7, 13, 1, 8, highlight));
    parts.push(rect(6, 25, 3, 2, shadow));

    // Right long tresses
    parts.push(rect(22, 9, 3, 7, base));
    parts.push(rect(22, 16, 4, 9, base));
    parts.push(rect(24, 13, 1, 8, highlight));
    parts.push(rect(23, 25, 3, 2, shadow));
  } else if (style === 'bob') {
    // Chic rounded retro bob cut
    parts.push(rect(10, 5, 12, 2, shadow));
    parts.push(rect(8, 7, 16, 3, base));
    parts.push(rect(11, 6, 8, 1, highlight));

    // Neat straight bangs
    parts.push(rect(10, 9, 12, 2, base));
    parts.push(rect(11, 10, 10, 1, shadow));

    // Curved bob sides framing cheeks
    parts.push(rect(7, 10, 3, 7, base));
    parts.push(rect(8, 17, 3, 2, shadow));
    parts.push(rect(22, 10, 3, 7, base));
    parts.push(rect(21, 17, 3, 2, shadow));
  } else if (style === 'curly') {
    // Textured voluminous curly hair
    // Top curls bumps
    parts.push(rect(9, 4, 4, 2, shadow));
    parts.push(rect(14, 3, 5, 3, shadow));
    parts.push(rect(20, 4, 4, 2, shadow));

    parts.push(rect(7, 6, 18, 5, base));
    parts.push(rect(6, 8, 20, 5, base));

    // Curls highlights
    parts.push(rect(10, 5, 2, 2, highlight));
    parts.push(rect(15, 4, 3, 2, highlight));
    parts.push(rect(20, 5, 2, 2, highlight));
    parts.push(rect(8, 9, 2, 2, highlight));
    parts.push(rect(22, 9, 2, 2, highlight));

    // Cheeks curls
    parts.push(rect(7, 13, 3, 4, base));
    parts.push(rect(22, 13, 3, 4, base));
    parts.push(rect(8, 16, 2, 2, shadow));
    parts.push(rect(22, 16, 2, 2, shadow));

    // Forehead curl tips
    parts.push(rect(11, 9, 2, 2, base));
    parts.push(rect(15, 9, 2, 2, base));
    parts.push(rect(19, 9, 2, 2, base));
  } else if (style === 'spiky') {
    // 90s anime spiky hair
    parts.push(rect(11, 2, 3, 4, base)); // spike 1
    parts.push(rect(15, 1, 3, 5, highlight)); // spike 2 center
    parts.push(rect(19, 2, 3, 4, base)); // spike 3
    parts.push(rect(8, 4, 3, 4, shadow)); // spike left
    parts.push(rect(22, 4, 3, 4, shadow)); // spike right

    parts.push(rect(8, 6, 16, 4, base));
    parts.push(rect(12, 5, 7, 2, highlight));

    // Bang spikes
    parts.push(rect(10, 9, 3, 3, base));
    parts.push(rect(14, 9, 3, 3, base));
    parts.push(rect(18, 9, 3, 2, base));
    parts.push(rect(7, 9, 2, 4, shadow));
    parts.push(rect(23, 9, 2, 4, shadow));
  } else if (style === 'cap') {
    // Pixel Beanie / Cap
    const capMain = '#8D86C9'; // Lavender beanie
    const capFold = '#6F68AA';
    const capPom = '#E9C46A';

    // Pom pom on top
    parts.push(rect(14, 2, 4, 3, capPom));
    parts.push(rect(15, 1, 2, 1, '#FFF2AA'));

    // Beanie dome
    parts.push(rect(10, 4, 12, 5, capMain));
    parts.push(rect(9, 6, 14, 3, capMain));
    parts.push(rect(12, 4, 6, 1, '#AAA4DE'));

    // Beanie fold
    parts.push(rect(8, 8, 16, 3, capFold));
    parts.push(rect(9, 9, 14, 1, '#837BBF'));

    // Hair peeking from beneath
    parts.push(rect(8, 11, 2, 3, base));
    parts.push(rect(22, 11, 2, 3, base));
    parts.push(rect(11, 11, 3, 1, base));
    parts.push(rect(18, 11, 3, 1, base));
  }

  return makeSvg(parts.join('\n'));
}

// -------------------------------------------------------------
// 4. OUTFITS
// -------------------------------------------------------------
function generateOutfit(style) {
  const parts = [];
  const darkOutline = '#24324A';

  if (style === 'casual') {
    // Teal & Cream striped retro crewneck
    const teal = '#4E9F9A';
    const darkTeal = '#377874';
    const cream = '#F7F1E3';

    // Base body silhouette
    parts.push(rect(9, 21, 14, 10, teal));
    // Shoulders
    parts.push(rect(7, 22, 18, 4, teal));
    parts.push(rect(5, 24, 22, 5, teal));

    // Striped stripes
    parts.push(rect(8, 24, 16, 1, cream));
    parts.push(rect(8, 26, 16, 1, cream));
    parts.push(rect(9, 28, 14, 1, cream));

    // Collar
    parts.push(rect(13, 21, 6, 1, darkOutline));
    parts.push(rect(14, 22, 4, 1, cream));

    // Hem & cuffs
    parts.push(rect(5, 27, 2, 1, darkTeal));
    parts.push(rect(25, 27, 2, 1, darkTeal));
    parts.push(rect(9, 30, 14, 1, darkTeal));

    // Outline
    parts.push(rect(6, 22, 1, 6, darkOutline));
    parts.push(rect(25, 22, 1, 6, darkOutline));
    parts.push(rect(9, 31, 14, 1, darkOutline));
  } else if (style === 'student') {
    // School / Collegiate knit vest with tie
    const vest = '#8D86C9'; // Lavender knit
    const shirt = '#FFFFFF';
    const tie = '#E76F51'; // Coral tie
    const darkVest = '#6E67A8';

    // Base vest
    parts.push(rect(9, 21, 14, 10, vest));
    parts.push(rect(7, 22, 18, 4, vest));
    parts.push(rect(5, 24, 22, 5, vest));

    // White shirt collar V-neck
    parts.push(rect(12, 21, 8, 4, shirt));
    parts.push(rect(14, 25, 4, 2, shirt));

    // Tie
    parts.push(rect(15, 23, 2, 2, tie));
    parts.push(rect(15, 25, 2, 4, tie));
    parts.push(rect(15, 29, 2, 1, '#D4573B'));

    // Vest V-neck trim
    parts.push(rect(12, 21, 2, 3, darkVest));
    parts.push(rect(18, 21, 2, 3, darkVest));
    parts.push(rect(13, 24, 2, 2, darkVest));
    parts.push(rect(17, 24, 2, 2, darkVest));

    // Outline
    parts.push(rect(6, 22, 1, 6, darkOutline));
    parts.push(rect(25, 22, 1, 6, darkOutline));
    parts.push(rect(9, 31, 14, 1, darkOutline));
  } else if (style === 'hoodie') {
    // Oversized cozy hoodie with front pocket
    const hoodie = '#E9C46A'; // Golden Yellow hoodie
    const darkHoodie = '#CFA644';
    const stringColor = '#FFFFFF';

    // Shoulders & arms
    parts.push(rect(9, 21, 14, 10, hoodie));
    parts.push(rect(6, 22, 20, 5, hoodie));
    parts.push(rect(4, 24, 24, 5, hoodie));

    // Hood collar rim around neck
    parts.push(rect(11, 20, 10, 2, darkHoodie));
    parts.push(rect(13, 21, 6, 2, hoodie));

    // Drawstrings
    parts.push(rect(13, 23, 1, 4, stringColor));
    parts.push(rect(18, 23, 1, 4, stringColor));

    // Kangaroo pocket
    parts.push(rect(11, 26, 10, 4, darkHoodie));
    parts.push(rect(12, 27, 8, 3, hoodie));

    // Outlines & ribbed hem
    parts.push(rect(4, 28, 2, 1, darkHoodie));
    parts.push(rect(26, 28, 2, 1, darkHoodie));
    parts.push(rect(8, 30, 16, 1, darkHoodie));
    parts.push(rect(8, 31, 16, 1, darkOutline));
    parts.push(rect(4, 22, 1, 7, darkOutline));
    parts.push(rect(27, 22, 1, 7, darkOutline));
  } else if (style === 'retro') {
    // 80s/90s color-blocked windbreaker (Teal, Coral, Navy)
    const coral = '#E76F51';
    const teal = '#4E9F9A';
    const navy = '#24324A';
    const white = '#F7F1E3';

    // Base windbreaker
    parts.push(rect(7, 22, 18, 4, navy));
    parts.push(rect(5, 24, 22, 5, navy));
    parts.push(rect(9, 21, 14, 10, navy));

    // Diagonal color block 1: Coral
    parts.push(rect(7, 22, 18, 2, coral));
    parts.push(rect(9, 24, 14, 1, coral));

    // Diagonal stripe: White
    parts.push(rect(8, 24, 16, 1, white));

    // Diagonal block 2: Teal
    parts.push(rect(8, 25, 16, 3, teal));

    // Zipper
    parts.push(rect(15, 21, 2, 9, white));
    parts.push(rect(15, 22, 2, 1, '#D9D0BE'));

    // Cuffs & bottom hem
    parts.push(rect(5, 27, 2, 1, navy));
    parts.push(rect(25, 27, 2, 1, navy));
    parts.push(rect(9, 30, 14, 1, navy));
    parts.push(rect(9, 31, 14, 1, darkOutline));
  } else if (style === 'professional') {
    // Tailored deep navy blazer with white dress shirt
    const blazer = '#24324A';
    const blazerLapel = '#172233';
    const shirt = '#FFFFFF';
    const pocketSquare = '#E76F51'; // Coral pocket handkerchief

    // Outer jacket
    parts.push(rect(7, 22, 18, 4, blazer));
    parts.push(rect(5, 24, 22, 6, blazer));
    parts.push(rect(9, 21, 14, 10, blazer));

    // Crisp white dress shirt V
    parts.push(rect(13, 21, 6, 6, shirt));
    parts.push(rect(15, 22, 2, 1, '#E2DFD8')); // top button / shadow
    parts.push(rect(15, 25, 2, 1, '#E2DFD8')); // button

    // Blazer Lapels
    parts.push(rect(11, 21, 2, 7, blazerLapel));
    parts.push(rect(19, 21, 2, 7, blazerLapel));

    // Pocket handkerchief
    parts.push(rect(9, 25, 3, 1, pocketSquare));
    parts.push(rect(9, 26, 3, 1, blazerLapel));

    // Outlines & buttons
    parts.push(rect(15, 28, 2, 1, '#E9C46A')); // gold blazer button
    parts.push(rect(5, 22, 1, 7, blazerLapel));
    parts.push(rect(26, 22, 1, 7, blazerLapel));
    parts.push(rect(9, 31, 14, 1, blazerLapel));
  }

  return makeSvg(parts.join('\n'));
}

// -------------------------------------------------------------
// 5. ACCESSORIES
// -------------------------------------------------------------
function generateAccessory(type) {
  const parts = [];
  const darkOutline = '#24324A';

  if (type === 'none') {
    // Empty layer
    return makeSvg('');
  } else if (type === 'glasses') {
    // Retro pixel glasses
    const frame = '#24324A';
    const glass = 'rgba(78, 159, 154, 0.4)';
    const glint = '#FFFFFF';

    // Left lens frame
    parts.push(rect(10, 12, 5, 1, frame));
    parts.push(rect(10, 15, 5, 1, frame));
    parts.push(rect(10, 13, 1, 2, frame));
    parts.push(rect(14, 13, 1, 2, frame));
    parts.push(rect(11, 13, 3, 2, glass));
    parts.push(rect(11, 13, 1, 1, glint));

    // Bridge
    parts.push(rect(15, 13, 2, 1, frame));

    // Right lens frame
    parts.push(rect(17, 12, 5, 1, frame));
    parts.push(rect(17, 15, 5, 1, frame));
    parts.push(rect(17, 13, 1, 2, frame));
    parts.push(rect(21, 13, 1, 2, frame));
    parts.push(rect(18, 13, 3, 2, glass));
    parts.push(rect(18, 13, 1, 1, glint));

    // Ear arms extending to sides
    parts.push(rect(8, 12, 2, 1, frame));
    parts.push(rect(22, 12, 2, 1, frame));
  } else if (type === 'headphones') {
    // Retro studio over-ear headphones
    const band = '#24324A';
    const pad = '#E76F51'; // Coral pads
    const accent = '#E9C46A';

    // Headband arc over hair
    parts.push(rect(12, 3, 8, 1, band));
    parts.push(rect(10, 4, 3, 1, band));
    parts.push(rect(19, 4, 3, 1, band));
    parts.push(rect(9, 5, 1, 4, band));
    parts.push(rect(22, 5, 1, 4, band));

    // Left earcup
    parts.push(rect(6, 11, 3, 6, pad));
    parts.push(rect(7, 12, 1, 4, accent));
    parts.push(rect(5, 12, 1, 4, band));

    // Right earcup
    parts.push(rect(23, 11, 3, 6, pad));
    parts.push(rect(24, 12, 1, 4, accent));
    parts.push(rect(26, 12, 1, 4, band));
  } else if (type === 'cap') {
    // Retro Snapback Cap
    const cap = '#E76F51'; // Coral
    const darkCap = '#C95539';
    const brim = '#4E9F9A'; // Teal visor
    const logo = '#F7F1E3';

    // Cap crown
    parts.push(rect(10, 4, 12, 4, cap));
    parts.push(rect(9, 5, 14, 4, cap));
    parts.push(rect(11, 3, 10, 1, darkCap));
    // Eyelet / button
    parts.push(rect(15, 2, 2, 1, brim));

    // Retro patch logo
    parts.push(rect(14, 5, 4, 2, logo));

    // Visor / Brim
    parts.push(rect(7, 8, 18, 2, brim));
    parts.push(rect(6, 9, 20, 1, darkOutline));
  } else if (type === 'hairpin') {
    // Cute pixel star hairpin + lavender ribbon
    const gold = '#E9C46A';
    const lightGold = '#FFF3B8';
    const ribbon = '#8D86C9';

    // Pin base
    parts.push(rect(20, 7, 4, 1, darkOutline));

    // Pixel star
    parts.push(rect(21, 6, 2, 4, gold));
    parts.push(rect(20, 7, 4, 2, gold));
    parts.push(rect(21, 7, 2, 2, lightGold)); // twinkle center

    // Hanging ribbon
    parts.push(rect(23, 9, 1, 3, ribbon));
    parts.push(rect(24, 10, 1, 3, ribbon));
  }

  return makeSvg(parts.join('\n'));
}

// -------------------------------------------------------------
// 6. BACKGROUNDS
// -------------------------------------------------------------
function generateBackground(type) {
  const parts = [];

  if (type === 'none') {
    // Clean transparent with subtle corner pixel bracket marks
    const mark = '#4A5B78';
    parts.push(rect(1, 1, 2, 1, mark));
    parts.push(rect(1, 1, 1, 2, mark));
    parts.push(rect(29, 1, 2, 1, mark));
    parts.push(rect(30, 1, 1, 2, mark));
    parts.push(rect(1, 30, 2, 1, mark));
    parts.push(rect(1, 29, 1, 2, mark));
    parts.push(rect(29, 30, 2, 1, mark));
    parts.push(rect(30, 29, 1, 2, mark));
  } else if (type === 'studio') {
    // Warm Cream Studio backdrop with pixel floor & gradient
    parts.push(rect(0, 0, 32, 25, '#EDE5D3'));
    parts.push(rect(0, 25, 32, 7, '#DFD6C2'));
    parts.push(rect(0, 25, 32, 1, '#D0C6B0'));

    // Subtle polka pixel grid
    for (let y = 3; y < 24; y += 4) {
      for (let x = 3; x < 32; x += 4) {
        parts.push(rect(x, y, 1, 1, '#E2D8C3'));
      }
    }

    // Pedestal shadow under avatar
    parts.push(rect(6, 27, 20, 3, '#C7BDAB'));
    parts.push(rect(8, 28, 16, 1, '#B8AD98'));
  } else if (type === 'terminal') {
    // Deep Navy Terminal with Teal scanline grid
    parts.push(rect(0, 0, 32, 32, '#182232'));

    // Grid lines
    for (let y = 0; y < 32; y += 4) {
      parts.push(rect(0, y, 32, 1, 'rgba(78, 159, 154, 0.12)'));
    }
    for (let x = 0; x < 32; x += 4) {
      parts.push(rect(x, 0, 1, 32, 'rgba(78, 159, 154, 0.12)'));
    }

    // Glowing platform under character
    parts.push(rect(6, 29, 20, 2, '#4E9F9A'));
    parts.push(rect(9, 28, 14, 1, '#7BD3CE'));
  } else if (type === 'sunset') {
    // Retro sunset gradient
    parts.push(rect(0, 0, 32, 8, '#24324A'));   // Navy sky
    parts.push(rect(0, 8, 32, 8, '#8D86C9'));   // Lavender dusk
    parts.push(rect(0, 16, 32, 8, '#E76F51'));  // Coral glow
    parts.push(rect(0, 24, 32, 8, '#E9C46A'));  // Golden horizon

    // Pixel stars in sky
    parts.push(rect(4, 2, 1, 1, '#FDF8EB'));
    parts.push(rect(12, 4, 1, 1, '#FDF8EB'));
    parts.push(rect(26, 3, 1, 1, '#FDF8EB'));
    parts.push(rect(22, 6, 1, 1, '#FDF8EB'));

    // Distant sun outline
    parts.push(rect(12, 14, 8, 6, '#F7F1E3'));
  } else if (type === 'lavender') {
    // Soft Muted Lavender Dream with Twinkles
    parts.push(rect(0, 0, 32, 32, '#8D86C9'));

    // Pixel clouds / hills
    parts.push(rect(0, 22, 32, 10, '#776FA8'));
    parts.push(rect(0, 26, 32, 6, '#645C91'));

    // Twinkling pixel stars
    const stars = [
      [3, 4], [8, 9], [15, 3], [24, 5], [28, 11], [5, 16], [26, 17]
    ];
    for (const [sx, sy] of stars) {
      parts.push(rect(sx, sy, 1, 1, '#FFFFFF'));
      parts.push(rect(sx - 1, sy, 1, 1, '#D8D4EE'));
      parts.push(rect(sx + 1, sy, 1, 1, '#D8D4EE'));
      parts.push(rect(sx, sy - 1, 1, 1, '#D8D4EE'));
      parts.push(rect(sx, sy + 1, 1, 1, '#D8D4EE'));
    }
  } else if (type === 'grid') {
    // Retro Blueprint Graph Paper
    parts.push(rect(0, 0, 32, 32, '#24324A'));

    // Fine grid
    for (let y = 0; y < 32; y += 2) {
      parts.push(rect(0, y, 32, 1, 'rgba(247, 241, 227, 0.08)'));
    }
    for (let x = 0; x < 32; x += 2) {
      parts.push(rect(x, 0, 1, 32, 'rgba(247, 241, 227, 0.08)'));
    }

    // Center crosshair markings
    parts.push(rect(15, 0, 2, 32, 'rgba(78, 159, 154, 0.25)'));
    parts.push(rect(0, 15, 32, 2, 'rgba(78, 159, 154, 0.25)'));
  }

  return makeSvg(parts.join('\n'));
}

// -------------------------------------------------------------
// WRITE ASSETS
// -------------------------------------------------------------
const baseDir = __dirname;

const categories = {
  skin: ['light', 'warm', 'medium', 'deep'],
  eyes: ['simple', 'round', 'happy', 'focused'],
  hair: ['short', 'long', 'bob', 'curly', 'spiky', 'cap'],
  outfits: ['casual', 'student', 'hoodie', 'retro', 'professional'],
  accessories: ['none', 'glasses', 'headphones', 'cap', 'hairpin'],
  backgrounds: ['none', 'studio', 'terminal', 'sunset', 'lavender', 'grid']
};

for (const cat of Object.keys(categories)) {
  const dir = path.join(baseDir, cat);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const item of categories[cat]) {
    let content = '';
    if (cat === 'skin') content = generateSkin(skinTones[item]);
    else if (cat === 'eyes') content = generateEyes(item);
    else if (cat === 'hair') content = generateHair(item);
    else if (cat === 'outfits') content = generateOutfit(item);
    else if (cat === 'accessories') content = generateAccessory(item);
    else if (cat === 'backgrounds') content = generateBackground(item);

    fs.writeFileSync(path.join(dir, `${item}.svg`), content, 'utf8');
  }
}

console.log('All pixel avatar assets generated successfully!');
