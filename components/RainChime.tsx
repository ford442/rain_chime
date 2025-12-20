
import { useEffect, useRef } from 'react';
import { CHIMES_CONFIG } from '../constants.ts';
import type { ChimeData } from '../types.ts';

interface RainChimeProps {
  isRaining: boolean;
  rainDensity: number;
  onChimeStrike: (chime: ChimeData, randomizePosition?: boolean) => void;
}

const RainChime: React.FC<RainChimeProps> = ({ isRaining, rainDensity, onChimeStrike }) => {
  const rainTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const rain = () => {
      // This check is important to stop the loop if isRaining becomes false
      if (!isRaining) {
        if (rainTimeoutRef.current) clearTimeout(rainTimeoutRef.current);
        return;
      }

      const randomChimeIndex = Math.floor(Math.random() * CHIMES_CONFIG.length);
      const randomChime = CHIMES_CONFIG[randomChimeIndex];
      onChimeStrike(randomChime, true); // Enable position randomization for rain

      // Slower, more controlled interval based on density
      const baseInterval = 5000 / rainDensity; // e.g., density 1 = 5s, density 10 = 0.5s
      const randomJitter = baseInterval * 0.5 * (Math.random() - 0.5); // +/- 25% jitter
      const nextInterval = Math.max(200, baseInterval + randomJitter);

      rainTimeoutRef.current = window.setTimeout(rain, nextInterval);
    };

    if (isRaining) {
      // Start the first drop immediately for better feedback
      rain();
    }

    return () => {
      if (rainTimeoutRef.current) {
        clearTimeout(rainTimeoutRef.current);
      }
    };
  }, [isRaining, rainDensity, onChimeStrike]);

  return null; // This is a headless component; it renders nothing.
};

export default RainChime;
