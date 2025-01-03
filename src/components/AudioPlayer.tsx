import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Radio } from 'lucide-react';

const useAudioPlayer = (src: string) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('volume');
    return savedVolume ? parseFloat(savedVolume) : 0.7;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleError = () => {
        console.error('Error al cargar la radio');
        setIsPlaying(false);
      };
      const handleWaiting = () => setIsLoading(true);
      const handleCanPlay = () => setIsLoading(false);
      audio.addEventListener('error', handleError);
      audio.addEventListener('waiting', handleWaiting);
      audio.addEventListener('canplay', handleCanPlay);
      return () => {
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('waiting', handleWaiting);
        audio.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return {
    audioRef,
    isPlaying,
    volume,
    isMuted,
    isLoading,
    togglePlay,
    toggleMute,
    handleVolumeChange,
  };
};

const AudioPlayer = () => {
  const {
    audioRef,
    isPlaying,
    volume,
    isMuted,
    isLoading,
    togglePlay,
    toggleMute,
    handleVolumeChange,
  } = useAudioPlayer('https://az03.streaminghd.net.ar/8080/stream');

  return (
    <div className="w-full max-w-md bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 p-6 rounded-2xl shadow-2xl">
      <audio ref={audioRef} src="https://az03.streaminghd.net.ar/8080/stream" crossOrigin="anonymous" />
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center animate-pulse">
          <Radio className="w-16 h-16 text-white" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-1">Uculture Techno Radio</h2>
          <p className="text-violet-200 text-sm">Live Stream</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            className={`w-16 h-16 rounded-full ${
              isPlaying ? 'bg-violet-500' : 'bg-white bg-opacity-10 hover:bg-opacity-20'
            } transition-all flex items-center justify-center text-white`}
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </button>
        </div>
        <div className="w-full flex items-center space-x-2">
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Desilenciar' : 'Silenciar'}
            className="text-white hover:text-violet-300 transition-colors"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-violet-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        {isLoading && <p className="text-white">Cargando...</p>}
      </div>
    </div>
  );
};

export default AudioPlayer;