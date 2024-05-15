import { useRef, useEffect } from "react";

const useAudioRef = (audioId: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioElement = document.getElementById(audioId);

    if (audioElement) {
      audioRef.current = audioElement as HTMLAudioElement;
    }
  }, [audioId]);

  return audioRef;
};

export default useAudioRef;
