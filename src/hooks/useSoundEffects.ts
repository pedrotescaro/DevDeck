"use client";

import { useCallback, useEffect, useRef } from "react";

export function useSoundEffects(enabled: boolean = false) {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!enabled) return;
    
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      audioContextRef.current?.close();
    };
  }, [enabled]);

  const playSound = useCallback((type: 'post' | 'like' | 'levelup' | 'quiz_correct' | 'quiz_incorrect') => {
    if (!enabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Volume max 30%
    gainNode.gain.value = 0.3;

    switch (type) {
      case 'post':
        // Whoosh sound
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
        break;
      case 'like':
        // Pop sound
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;
      case 'levelup':
        // 3 ascending notes
        [440, 554, 659].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          gain.gain.value = 0.3;
          osc.frequency.value = freq;
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3 + i * 0.15);
          osc.start(ctx.currentTime + i * 0.15);
          osc.stop(ctx.currentTime + 0.3 + i * 0.15);
        });
        break;
      case 'quiz_correct':
        // 2 ascending bright notes (C5 -> E5)
        [523.25, 659.25].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          gain.gain.value = 0.2;
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25 + i * 0.1);
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + 0.25 + i * 0.1);
        });
        break;
      case 'quiz_incorrect':
        // Slur downward low sound (triangle wave)
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(220, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
        break;
    }
  }, [enabled]);

  return { playSound };
}
