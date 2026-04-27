import { useRef, useCallback } from 'react';

export function useAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
    try {
      const audioContext = getAudioContext();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [getAudioContext]);

  // 移动音效（短促低音）
  const playMoveSound = useCallback(() => {
    playTone(200, 0.05, 'sine', 0.2);
  }, [playTone]);

  // 旋转音效（短促中音）
  const playRotateSound = useCallback(() => {
    playTone(400, 0.08, 'square', 0.2);
  }, [playTone]);

  // 落地音效
  const playDropSound = useCallback(() => {
    playTone(150, 0.1, 'sine', 0.3);
  }, [playTone]);

  // 消除音效（上升音阶）
  const playClearSound = useCallback((lines: number) => {
    const baseFreq = 440;
    for (let i = 0; i < lines; i++) {
      setTimeout(() => {
        playTone(baseFreq + i * 110, 0.1, 'sine', 0.3);
      }, i * 50);
    }
  }, [playTone]);

  // 游戏结束音效（下降音阶）
  const playGameOverSound = useCallback(() => {
    const freqs = [440, 330, 220, 110];
    freqs.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 'sawtooth', 0.4), i * 150);
    });
  }, [playTone]);

  // 开始游戏音效
  const playStartSound = useCallback(() => {
    playTone(523, 0.15, 'sine', 0.3);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.3), 150);
    setTimeout(() => playTone(784, 0.2, 'sine', 0.3), 300);
  }, [playTone]);

  return {
    playMoveSound,
    playRotateSound,
    playDropSound,
    playClearSound,
    playGameOverSound,
    playStartSound,
  };
}
