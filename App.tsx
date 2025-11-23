
import React, { useState, useCallback, useEffect } from 'react';
import RainChime from './components/RainChime.tsx';
import PlayIcon from './components/icons/PlayIcon.tsx';
import PauseIcon from './components/icons/PauseIcon.tsx';
import { useAudioEngine } from './hooks/useAudioEngine.ts';
import type { ChimeData, Hit } from './types.ts';
import { CHIMES_CONFIG } from './constants.ts';

const App: React.FC = () => {
  const [isRaining, setIsRaining] = useState(false);
  const [rainDensity, setRainDensity] = useState(3);
  const [hits, setHits] = useState<Hit[]>([]);
  const { isAudioReady, initializeAudio, playNote } = useAudioEngine();

  const handleChimeStrike = useCallback((chime: ChimeData) => {
    if (!isAudioReady) return;
    
    playNote(chime.frequency);
    const newHit: Hit = { key: Date.now() + Math.random(), chime };
    setHits(currentHits => [...currentHits, newHit]);
    
    setTimeout(() => {
      setHits(currentHits => currentHits.filter(h => h.key !== newHit.key));
    }, 600); // Animation duration
  }, [isAudioReady, playNote]);

  const handleManualClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAudioReady) {
      initializeAudio();
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    let closestChime: ChimeData | null = null;
    let minDistance = Infinity;

    for (const chime of CHIMES_CONFIG) {
      const distance = Math.sqrt(Math.pow(chime.x - x, 2) + Math.pow(chime.y - y, 2));
      if (distance < minDistance) {
        minDistance = distance;
        closestChime = chime;
      }
    }

    if (closestChime && minDistance < 7) { // Click radius of 7%
      handleChimeStrike(closestChime);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-900 text-white font-sans overflow-hidden">
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <header className="text-center mb-4 md:mb-8">
          <h1 className="text-4xl md:text-6xl font-thin tracking-wider text-cyan-200/80">
            Rain Chime
          </h1>
          <p className="text-slate-400 mt-2 max-w-md">
            Click the chimes to play, or start the rain for a generative melody.
          </p>
        </header>

        <div
          className="relative w-full max-w-4xl aspect-square rounded-lg shadow-2xl shadow-black/50 overflow-hidden group cursor-pointer"
          onClick={handleManualClick}
          role="application"
          aria-label="Interactive Rain Chime Image"
        >
          <video
            src="https://img.noahcohn.com/video/rainpiano.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            data-testid="background-video"
          />
          
          {!isAudioReady && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm transition-opacity duration-300">
              <button
                onClick={initializeAudio}
                className="px-8 py-4 bg-cyan-500 text-slate-900 font-bold rounded-lg text-xl hover:bg-cyan-400 transition-colors duration-300 shadow-lg shadow-cyan-500/20"
                aria-label="Start audio engine"
              >
                Start Experience
              </button>
              <p className="mt-4 text-slate-300">Click to enable audio</p>
            </div>
          )}

          {hits.map(({ key, chime }) => (
            <div
              key={key}
              className="hit-animation"
              style={{
                top: `${chime.y}%`,
                left: `${chime.x}%`,
                '--chime-color': chime.color,
              } as React.CSSProperties}
            />
          ))}
        </div>

        <RainChime isRaining={isRaining} rainDensity={rainDensity} onChimeStrike={handleChimeStrike} />

        <div className="mt-8 md:mt-12 flex flex-col items-center gap-8 w-full max-w-xs">
          <button
            onClick={() => setIsRaining(!isRaining)}
            className="flex items-center gap-3 px-6 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isRaining ? 'Pause the rain' : 'Start the rain'}
            disabled={!isAudioReady}
          >
            {isRaining ? <PauseIcon /> : <PlayIcon />}
            <span className="font-semibold tracking-wide">
              {isRaining ? 'Stop Rain' : 'Start Rain'}
            </span>
          </button>

          <div className="w-full flex flex-col items-center">
            <label htmlFor="density-slider" className="text-slate-400 mb-2 text-sm tracking-wide">
              Rain Density
            </label>
            <input
              id="density-slider"
              type="range"
              min="1"
              max="10"
              value={rainDensity}
              onChange={(e) => setRainDensity(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isRaining || !isAudioReady}
              aria-label="Rain density"
            />
            <div className="w-full flex justify-between text-xs text-slate-500 mt-1 px-1">
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
