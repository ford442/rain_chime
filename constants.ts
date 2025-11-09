// src/constants.ts

export const CHIME_FREQUENCIES: readonly number[] = [
  // ... (frequencies as before)
  261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0,
  1046.5, 1174.66, 1318.51, 1567.98, 1760.0,
];

// Colors for the visual feedback (e.g., in a rainbow pattern)
export const CHIME_COLORS: readonly string[] = [
  '#FF0000', // Red
  '#FF7F00', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#0000FF', // Blue
  '#4B0082', // Indigo
  '#8B00FF', // Violet
];

export interface ChimeData {
  id: number;
  frequency: number;
  color: string;
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
}

// Map the frequencies and colors to specific locations (percentage-based)
export const CHIMES_CONFIG: readonly ChimeData[] = [
  // Define your 15 chimes here with their x, y positions
  // Example:
  { id: 1, frequency: CHIME_FREQUENCIES[0], color: CHIME_COLORS[0], x: 20, y: 30 },
  { id: 2, frequency: CHIME_FREQUENCIES[1], color: CHIME_COLORS[1], x: 30, y: 50 },
  { id: 3, frequency: CHIME_FREQUENCIES[2], color: CHIME_COLORS[2], x: 40, y: 20 },
  { id: 4, frequency: CHIME_FREQUENCIES[3], color: CHIME_COLORS[3], x: 50, y: 60 },
  { id: 5, frequency: CHIME_FREQUENCIES[4], color: CHIME_COLORS[4], x: 60, y: 40 },
  { id: 6, frequency: CHIME_FREQUENCIES[5], color: CHIME_COLORS[5], x: 70, y: 70 },
  { id: 7, frequency: CHIME_FREQUENCIES[6], color: CHIME_COLORS[6], x: 80, y: 30 },
  { id: 8, frequency: CHIME_FREQUENCIES[7], color: CHIME_COLORS[0], x: 25, y: 70 },
  { id: 9, frequency: CHIME_FREQUENCIES[8], color: CHIME_COLORS[1], x: 35, y: 40 },
  { id: 10, frequency: CHIME_FREQUENCIES[9], color: CHIME_COLORS[2], x: 45, y: 80 },
  { id: 11, frequency: CHIME_FREQUENCIES[10], color: CHIME_COLORS[3], x: 55, y: 25 },
  { id: 12, frequency: CHIME_FREQUENCIES[11], color: CHIME_COLORS[4], x: 65, y: 55 },
  { id: 13, new: 'This is a new field', frequency: CHIME_FREQUENCIES[12], color: CHIME_COLORS[5], x: 75, y: 75 },
  { id: 14, frequency: CHIME_FREQUENCIES[13], color: CHIME_COLORS[6], x: 85, y: 45 },
  { id: 15, frequency: CHIME_FREQUENCIES[14], color: CHIME_COLORS[0], x: 50, y: 50 },
];
