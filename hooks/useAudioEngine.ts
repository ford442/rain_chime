import { useState, useRef, useCallback, useEffect } from 'react';

export const useAudioEngine = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rainSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const rainFilterRef = useRef<BiquadFilterNode | null>(null);
  const rainTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);

  const initializeAudio = useCallback(async () => {
    if (typeof window !== 'undefined') {
      try {
        if (!audioCtxRef.current) {
          const context = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioCtxRef.current = context;
        }

        const context = audioCtxRef.current;
        
        if (context && context.state === 'suspended') {
          await context.resume();
        }

        setIsAudioReady(true);
        return true;
      } catch (e) {
        console.error("Audio initialization failed", e);
        setIsAudioReady(false);
        return false;
      }
    }
    return true;
  }, []);

  const playNote = useCallback((frequency: number) => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);

    oscillator.start(now);
    oscillator.stop(now + 2);
  }, []);

  // --- Rain Sound Engine ---

  const createNoiseBuffer = (ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  };

  const startRainSound = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Fix race condition: clear pending stop timeout if we restart rain
    if (rainTimeoutRef.current) {
        clearTimeout(rainTimeoutRef.current);
        rainTimeoutRef.current = null;
    }

    // If already playing, just ensure volume is correct (handled by setRainVolume usually)
    // or we can just return. But if we were fading out, we need to ramp back up?
    // setRainVolume will handle the ramp up from wherever the gain is currently.
    if (rainSourceRef.current) {
        // We might be in the middle of a fade out. The setRainVolume call in App.tsx
        // will happen right after this, ramping the gain back up.
        // But we should cancel any scheduled ramp down?
        // gainNode.gain.cancelScheduledValues(now); // Good practice
        if (rainGainRef.current) {
            const now = ctx.currentTime;
            rainGainRef.current.gain.cancelScheduledValues(now);
        }
        return;
    }

    const buffer = createNoiseBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Lowpass filter to muffle the white noise into "rain"
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    const gain = ctx.createGain();
    gain.gain.value = 0;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    rainSourceRef.current = source;
    rainGainRef.current = gain;
    rainFilterRef.current = filter;
  }, []);

  const stopRainSound = useCallback(() => {
    if (rainSourceRef.current && rainGainRef.current && audioCtxRef.current) {
        const gain = rainGainRef.current;
        const now = audioCtxRef.current.currentTime;

        // Cancel any previous ramps to avoid conflict
        gain.gain.cancelScheduledValues(now);
        // Fade out
        gain.gain.linearRampToValueAtTime(0, now + 1);

        // Store timeout ID to allow cancellation
        const timeoutId = setTimeout(() => {
            if (rainSourceRef.current) {
                rainSourceRef.current.stop();
                rainSourceRef.current.disconnect();
                rainSourceRef.current = null;
            }
            rainGainRef.current = null;
            rainFilterRef.current = null;
            rainTimeoutRef.current = null;
        }, 1000);

        rainTimeoutRef.current = timeoutId;
    }
  }, []);

  const setRainVolume = useCallback((density: number) => {
    if (rainGainRef.current && audioCtxRef.current) {
        const now = audioCtxRef.current.currentTime;

        // Map density (1-10) to volume (0.02 - 0.3)
        const volume = 0.02 + (density / 10) * 0.28;

        // Cancel scheduled values to ensure we interrupt a fade-out if restarting
        rainGainRef.current.gain.cancelScheduledValues(now);
        rainGainRef.current.gain.linearRampToValueAtTime(volume, now + 0.2);

        // Adjust filter frequency based on density
        if (rainFilterRef.current) {
             const frequency = 400 + (density * 80);
             rainFilterRef.current.frequency.cancelScheduledValues(now);
             rainFilterRef.current.frequency.linearRampToValueAtTime(frequency, now + 0.2);
        }
    }
  }, []);

  return { isAudioReady, initializeAudio, playNote, startRainSound, stopRainSound, setRainVolume };
};
