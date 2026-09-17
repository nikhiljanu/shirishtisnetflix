import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Flag, Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX, SkipForward, ListVideo, Subtitles, Settings, Maximize } from 'lucide-react';
import { fetchPlaybackUrl } from '../config/api';
import '../styles/figma-ui.css';

export default function CinematicPlayer({ video, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const [playbackUrl, setPlaybackUrl] = useState(null);

  const videoRef = useRef(null);
  const idleTimerRef = useRef(null);

  const displayTitle = video?.publicId.split('/').pop().replace(/-/g, ' ');

  useEffect(() => {
    let cancelled = false;
    setPlaybackUrl(null);
    fetchPlaybackUrl(video.publicId).then((data) => {
      if (!cancelled) setPlaybackUrl(data.secureUrl);
    });
    return () => { cancelled = true; };
  }, [video.publicId]);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsIdle(false);
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setIsIdle(true), 3000);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(idleTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const seekForward = () => { if (videoRef.current) videoRef.current.currentTime += 10; };
  const seekBackward = () => { if (videoRef.current) videoRef.current.currentTime -= 10; };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleScrubberClick = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  return (
    <div className={`player-container ${isIdle && isPlaying ? 'idle' : ''}`}>
      {playbackUrl ? (
        <video
          ref={videoRef}
          src={playbackUrl}
          className="player-video"
          autoPlay
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      ) : (
        <div className="player-video" style={{ display: 'grid', placeItems: 'center', background: '#000', color: 'white' }}>
          Loading...
        </div>
      )}

      <div className="player-overlay">
        <div className="player-top-bar">
          <button className="player-back-btn" onClick={onClose}>
            <ArrowLeft size={32} />
          </button>
          <button className="player-back-btn">
            <Flag size={24} />
          </button>
        </div>

        <div className="player-bottom-bar">
          <div className="player-scrubber" onClick={handleScrubberClick}>
            <div className="scrubber-filled" style={{ width: `${progress}%` }}></div>
            <div className="scrubber-handle" style={{ left: `calc(${progress}% - 6px)` }}></div>
          </div>
          
          <div className="player-controls">
            <div className="player-controls-left">
              <button onClick={togglePlay}>
                {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
              </button>
              <button onClick={seekBackward}><RotateCcw size={28} /></button>
              <button onClick={seekForward}><RotateCw size={28} /></button>
              <button onClick={toggleMute}>
                {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
              </button>
            </div>
            
            <div className="player-title">{displayTitle}</div>
            
            <div className="player-controls-right">
              <button><SkipForward size={28} /></button>
              <button><ListVideo size={28} /></button>
              <button><Subtitles size={28} /></button>
              <button><Settings size={28} /></button>
              <button onClick={() => document.documentElement.requestFullscreen()}><Maximize size={28} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
