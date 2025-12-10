
import type { ChimeData } from './types.ts';

// C Major Pentatonic Scale
const BASE_FREQ = 261.63; // C4
const PENTATONIC_RATIOS = [
  1,       // C
  9 / 8,   // D
  5 / 4,   // E
  3 / 2,   // G
  5 / 3,   // A
];

const generateFrequencies = (): number[] => {
  const freqs: number[] = [];
  // Generate for 3 octaves
  for (let octave = 0; octave < 3; octave++) {
    for (const ratio of PENTATONIC_RATIOS) {
      freqs.push(BASE_FREQ * ratio * Math.pow(2, octave));
    }
  }
  return freqs;
};

export const CHIME_FREQUENCIES = generateFrequencies();

export const CHIME_COLORS = [
  '#008cff', // Blue (Left)
  '#ff005d', // Red (Right - Middle)
  '#00ff9d', // Green (Bottom Right)
  '#ff00ff', // Pink (Bottom Left)
  '#ffa500', // Orange (Top Right)
];

// Fixed seeds or hardcoded values preferred for consistency across reloads?
// The previous file had hardcoded values. I will stick to hardcoded to ensure they "look good"
// and don't overlap awkwardly, but I will manually distribute them into the requested zones.

/*
  Zones:
  0: Blue - Left (x: 10-25, y: 20-80)
  1: Red - Right Mid (x: 75-90, y: 40-60)
  2: Green - Bottom Right (x: 60-90, y: 70-90)
  3: Pink - Bottom Left (x: 10-40, y: 70-90)
  4: Orange - Top Right (x: 60-90, y: 10-30)
*/

export const CHIMES_CONFIG: ChimeData[] = [
    // --- Cluster 1: Blue (Left) ---
    { id: 0, frequency: CHIME_FREQUENCIES[0], color: CHIME_COLORS[0], x: 15, y: 30 },
    { id: 1, frequency: CHIME_FREQUENCIES[5], color: CHIME_COLORS[0], x: 22, y: 50 },
    { id: 2, frequency: CHIME_FREQUENCIES[10], color: CHIME_COLORS[0], x: 18, y: 70 },

    // --- Cluster 2: Red (Right Middle) ---
    { id: 3, frequency: CHIME_FREQUENCIES[1], color: CHIME_COLORS[1], x: 82, y: 45 },
    { id: 4, frequency: CHIME_FREQUENCIES[6], color: CHIME_COLORS[1], x: 78, y: 55 },
    { id: 5, frequency: CHIME_FREQUENCIES[11], color: CHIME_COLORS[1], x: 85, y: 50 },

    // --- Cluster 3: Green (Bottom Right) ---
    { id: 6, frequency: CHIME_FREQUENCIES[2], color: CHIME_COLORS[2], x: 70, y: 80 },
    { id: 7, frequency: CHIME_FREQUENCIES[7], color: CHIME_COLORS[2], x: 80, y: 75 },
    { id: 8, frequency: CHIME_FREQUENCIES[12], color: CHIME_COLORS[2], x: 85, y: 85 },

    // --- Cluster 4: Pink (Bottom Left) ---
    { id: 9, frequency: CHIME_FREQUENCIES[3], color: CHIME_COLORS[3], x: 20, y: 80 },
    { id: 10, frequency: CHIME_FREQUENCIES[8], color: CHIME_COLORS[3], x: 30, y: 85 },
    { id: 11, frequency: CHIME_FREQUENCIES[13], color: CHIME_COLORS[3], x: 15, y: 88 },

    // --- Cluster 5: Orange (Top Right) ---
    { id: 12, frequency: CHIME_FREQUENCIES[4], color: CHIME_COLORS[4], x: 75, y: 20 },
    { id: 13, frequency: CHIME_FREQUENCIES[9], color: CHIME_COLORS[4], x: 85, y: 15 },
    { id: 14, frequency: CHIME_FREQUENCIES[14], color: CHIME_COLORS[4], x: 80, y: 25 },
];
