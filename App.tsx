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

  const handleChimeStrike = useCallback((chime: ChimeData, randomizePosition: boolean = false) => {
    console.log("[App] handleChimeStrike", chime.id);
    if (!isAudioReady) return;
    
    playNote(chime.frequency);
    
    // Add position randomization for rain strikes
    const hitChime = randomizePosition ? {
      ...chime,
      x: chime.x + (Math.random() - 0.5) * 10, // +/- 5 percentage points variation
      y: chime.y + (Math.random() - 0.5) * 10, // +/- 5 percentage points variation
    } : chime;
    
    const newHit: Hit = { key: Date.now() + Math.random(), chime: hitChime };
    setHits(currentHits => [...currentHits, newHit]);
    
    setTimeout(() => {
      setHits(currentHits => currentHits.filter(h => h.key !== newHit.key));
    }, 2000); // Extended animation duration for blur effect
  }, [isAudioReady, playNote]);

  // Rain Effect
  useEffect(() => {
    if (!isRaining || !isAudioReady) return;

    const spawnRainDrop = () => {
      const randomChime = CHIMES_CONFIG[Math.floor(Math.random() * CHIMES_CONFIG.length)];
      handleChimeStrike(randomChime, true);
    };

    // Calculate interval based on density (1-10)
    // Density 1: Slower (e.g., 2000ms)
    // Density 10: Faster (e.g., 200ms)
    const intervalTime = 2200 - (rainDensity * 200);

    const intervalId = setInterval(spawnRainDrop, Math.max(200, intervalTime));

    return () => clearInterval(intervalId);
  }, [isRaining, rainDensity, isAudioReady, handleChimeStrike]);

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
    // We add a class here to handle the video background styling
    <div className="relative min-h-screen w-full bg-slate-900 text-white font-sans overflow-hidden video-container">
      
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline // Important for iOS video playback
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="https://stream.media.thinknpm.com/p/static/fastly/production/a9775.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Content Overlay */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 bg-black bg-opacity-30"> {/* Added a slight dark overlay for text readability */}
        <header className="text-center mb-4 md:mb-8">
          <h1 className="text-4xl md:text-6xl font-thin tracking-wider text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            Rain Chime
          </h1>
          <p className="text-gray-200 mt-2 max-w-md" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            Click anywhere to play, or start the rain for a generative melody.
          </p>
        </header>

        <div
          className="relative w-full max-w-5xl aspect-video group cursor-pointer"
          style={{
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
          }}
          onClick={handleManualClick}
          role="application"
          aria-label="Interactive Rain Chime Video"
        >
          <video
            src="https://img.noahcohn.com/video/rainpiano.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-center"
            data-testid="background-video"
          />
          
          {!isAudioReady && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm transition-opacity duration-300">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  initializeAudio();
                }}
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
            <label htmlFor="density-slider" className="text-slate-200 mb-2 text-sm tracking-wide">
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
              aria-label="Rain density"
            />
            <div className="w-full flex justify-between text-xs text-slate-400 mt-1 px-1">
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
