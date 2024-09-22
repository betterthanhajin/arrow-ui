import React, { useEffect, useRef } from "react";

const SoundEffect: React.FC = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    oscillatorRef.current = audioContextRef.current.createOscillator();
    gainNodeRef.current = audioContextRef.current.createGain();

    oscillatorRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioContextRef.current.destination);

    oscillatorRef.current.type = "sine";
    oscillatorRef.current.frequency.setValueAtTime(
      440,
      audioContextRef.current.currentTime
    );
    oscillatorRef.current.start();

    gainNodeRef.current.gain.setValueAtTime(
      0,
      audioContextRef.current.currentTime
    );

    return () => {
      oscillatorRef.current?.stop();
      audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (
        audioContextRef.current &&
        oscillatorRef.current &&
        gainNodeRef.current
      ) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        // 주파수 조절 (x축)
        const minFreq = 220;
        const maxFreq = 880;
        const frequency =
          minFreq + (clientX / innerWidth) * (maxFreq - minFreq);
        oscillatorRef.current.frequency.setTargetAtTime(
          frequency,
          audioContextRef.current.currentTime,
          0.1
        );

        // 볼륨 조절 (y축)
        const volume = 1 - clientY / innerHeight;
        gainNodeRef.current.gain.setTargetAtTime(
          volume,
          audioContextRef.current.currentTime,
          0.1
        );
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return null;
};

export default SoundEffect;
