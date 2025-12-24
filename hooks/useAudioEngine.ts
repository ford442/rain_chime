
import { useState, useRef, useCallback } from 'react';

export const useAudioEngine = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);

  const initializeAudio = useCallback(async () => {
    if (typeof window !== 'undefined') {
      try {
        if (!audioCtxRef.current) {
          const context = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioCtxRef.current = context;
        }

        const context = audioCtxRef.current;
        
        // If the context is suspended, it must be resumed by a user gesture.
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
    if (!audioCtx) {
      console.warn('Audio engine not initialized.');
      return;
    }
    
    if (audioCtx.state === 'suspended') {
        console.log("Resuming suspended context in playNote");
        audioCtx.resume();
    }

    console.log("Playing note:", frequency);
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Bell-like sound envelope
    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.05); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.5); // Decay

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);

    oscillator.start(now);
    oscillator.stop(now + 2);
  }, []);

  return { isAudioReady, initializeAudio, playNote };
};
