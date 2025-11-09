
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
  '#ff005d', // Neon Pink
  '#ff00ff', // Magenta
  '#9d00ff', // Purple
  '#008cff', // Bright Blue
  '#00ffff', // Cyan
  '#00ff9d', // Spring Green
];

// These coordinates are percentages (top, left) for placing hits on the image.
export const CHIMES_CONFIG: ChimeData[] = [
    // Lower, larger chimes (Octave 4)
    { id: 0, frequency: CHIME_FREQUENCIES[0], color: CHIME_COLORS[3], x: 28, y: 65 },
    { id: 1, frequency: CHIME_FREQUENCIES[1], color: CHIME_COLORS[4], x: 33, y: 76 },
    { id: 2, frequency: CHIME_FREQUENCIES[2], color: CHIME_COLORS[2], x: 42, y: 80 },
    { id: 3, frequency: CHIME_FREQUENCIES[3], color: CHIME_COLORS[0], x: 58, y: 81 },
    { id: 4, frequency: CHIME_FREQUENCIES[4], color: CHIME_COLORS[5], x: 66, y: 74 },
    
    // Middle chimes (Octave 5)
    { id: 5, frequency: CHIME_FREQUENCIES[5], color: CHIME_COLORS[3], x: 25, y: 48 },
    { id: 6, frequency: CHIME_FREQUENCIES[6], color: CHIME_COLORS[4], x: 34, y: 56 },
    { id: 7, frequency: CHIME_FREQUENCIES[7], color: CHIME_COLORS[2], x: 44, y: 61 },
    { id: 8, frequency: CHIME_FREQUENCIES[8], color: CHIME_COLORS[0], x: 54, y: 64 },
    { id: 9, frequency: CHIME_FREQUENCIES[9], color: CHIME_COLORS[5], x: 68, y: 59 },

    // Higher, smaller chimes (Octave 6)
    { id: 10, frequency: CHIME_FREQUENCIES[10], color: CHIME_COLORS[3], x: 31, y: 35 },
    { id: 11, frequency: CHIME_FREQUENCIES[11], color: CHIME_COLORS[4], x: 41, y: 42 },
    { id: 12, frequency: CHIME_FREQUENCIES[12], color: CHIME_COLORS[2], x: 51, y: 38 },
    { id: 13, frequency: CHIME_FREQUENCIES[13], color: CHIME_COLORS[0], x: 61, y: 43 },
    { id: 14, frequency: CHIME_FREQUENCIES[14], color: CHIME_COLORS[5], x: 71, y: 49 },
];
