import React, { useState, useCallback, useEffect } from 'react';
import RainOverlay from './components/RainOverlay.tsx';
import PlayIcon from './components/icons/PlayIcon.tsx';
import PauseIcon from './components/icons/PauseIcon.tsx';
import { useAudioEngine } from './hooks/useAudioEngine.ts';
import type { ChimeData, Hit } from './types.ts';
import { CHIMES_CONFIG } from './constants.ts';

const App: React.FC = () => {
  const [isRaining, setIsRaining] = useState(false);
  const [rainDensity, setRainDensity] = useState(3);
  const [hits, setHits] = useState<Hit[]>([]);

  const { isAudioReady, initializeAudio, playNote, startRainSound, stopRainSound, setRainVolume } = useAudioEngine();

  const handleChimeStrike = useCallback((chime: ChimeData, randomizePosition: boolean = false) => {
    if (!isAudioReady) return;

    playNote(chime.frequency);

    const hitChime = randomizePosition ? {
      ...chime,
      x: chime.x + (Math.random() - 0.5) * 10,
      y: chime.y + (Math.random() - 0.5) * 10,
    } : chime;

    const newHit: Hit = { key: Date.now() + Math.random(), chime: hitChime };
    setHits(currentHits => [...currentHits, newHit]);

    setTimeout(() => {
      setHits(currentHits => currentHits.filter(h => h.key !== newHit.key));
    }, 2000);
  }, [isAudioReady, playNote]);

  // Rain Effect Logic
  useEffect(() => {
    if (!isRaining || !isAudioReady) return;

    const spawnRainDrop = () => {
      const randomChime = CHIMES_CONFIG[Math.floor(Math.random() * CHIMES_CONFIG.length)];
      handleChimeStrike(randomChime, true);
    };

    const intervalTime = 2200 - (rainDensity * 200);
    const intervalId = setInterval(spawnRainDrop, Math.max(200, intervalTime));

    return () => clearInterval(intervalId);
  }, [isRaining, rainDensity, isAudioReady, handleChimeStrike]);

  // Handle Rain Audio
  useEffect(() => {
    if (isAudioReady) {
      if (isRaining) {
        startRainSound();
        setRainVolume(rainDensity);
      } else {
        stopRainSound();
      }
    }
  }, [isRaining, isAudioReady, startRainSound, stopRainSound, setRainVolume, rainDensity]);

  const handleManualClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If audio not ready, don't trigger chime, let the overlay button handle init
    if (!isAudioReady) return;

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

    if (closestChime && minDistance < 7) {
      handleChimeStrike(closestChime);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-900 text-white font-sans overflow-hidden">
      
      {/* Background Video (Visible when NOT raining/zoomed) */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isRaining ? 'opacity-0 delay-500' : 'opacity-100'}`}>
        <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
        >
            <source src="https://img.noahcohn.com/video/rainpiano.mp4" type="video/mp4" />
        </video>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Header - Fades out when raining */}
        <header className={`text-center mb-4 md:mb-8 transition-opacity duration-1000 ${isRaining ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}>
          <h1 className="text-4xl md:text-6xl font-thin tracking-wider text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            Rain Chime
          </h1>
          <p className="text-gray-200 mt-2 max-w-md" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            Click anywhere to play, or start the rain for a generative melody.
          </p>
        </header>

        {/* Interactive Container - Transforms to fullscreen on rain */}
        <div
          className={`relative transition-all duration-1000 ease-in-out group/container cursor-pointer ${
            isRaining
              ? 'fixed inset-0 w-screen h-screen z-50 rounded-none'
              : 'w-full max-w-5xl aspect-video rounded-xl shadow-2xl'
          }`}
          style={{
            maskImage: isRaining ? 'none' : 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
            WebkitMaskImage: isRaining ? 'none' : 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
          }}
          onClick={handleManualClick}
          role="application"
          aria-label="Interactive Rain Chime Video"
        >
          {/* Main Content Video */}
          <video
            src="https://img.noahcohn.com/video/rainpiano.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-center"
            data-testid="background-video"
          />
          
          {/* Audio Start Overlay */}
          {!isAudioReady && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm transition-opacity duration-300 z-40">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  initializeAudio();
                }}
                className="px-8 py-4 bg-cyan-500 text-slate-900 font-bold rounded-lg text-xl hover:bg-cyan-400 transition-colors duration-300 shadow-lg shadow-cyan-500/20"
              >
                Start Experience
              </button>
            </div>
          )}

          {/* Visual Rain Shader Overlay */}
          {isRaining && <RainOverlay density={rainDensity} />}

          {/* Hit Animations */}
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

          {/* Controls - Moved Inside Container for Fullscreen Access */}
          <div
            className="absolute bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none"
          >
             {/* Wrapper for pointer events so clicks on empty space go to container */}
            <div
                className={`group bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col items-center gap-4 w-full max-w-xs pointer-events-auto transition-all duration-500 hover:scale-105 shadow-2xl ${
                    isRaining ? 'hover:bg-slate-900/80' : ''
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => setIsRaining(!isRaining)}
                    className="flex items-center gap-3 px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 rounded-full text-cyan-300 transition-all duration-300 w-full justify-center"
                    disabled={!isAudioReady}
                >
                    {isRaining ? <PauseIcon /> : <PlayIcon />}
                    <span className="font-semibold tracking-wide">
                    {isRaining ? 'Stop Rain' : 'Start Rain'}
                    </span>
                </button>

                {/* Density Slider - Vanishes when raining, appears on group hover */}
                <div className={`w-full flex flex-col items-center transition-all duration-500 overflow-hidden ${
                    isRaining
                        ? 'max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 pt-0 group-hover:pt-2'
                        : 'max-h-40 opacity-100'
                }`}>
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
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="w-full flex justify-between text-xs text-slate-400 mt-1 px-1">
                    <span>Light</span>
                    <span>Storm</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
