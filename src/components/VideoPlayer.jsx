import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  Maximize, 
  Minimize, 
  MessageSquare, 
  SkipForward,
  Settings
} from 'lucide-react';
import '../styles/player.css';

export default function VideoPlayer({ item, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(145); // start 2m 25s in
  const [totalDuration, setTotalDuration] = useState(6690); // 1h 51m 30s
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSubtitlesModal, setShowSubtitlesModal] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState('English [Original]');
  const [selectedSubtitles, setSelectedSubtitles] = useState('English [CC]');
  const controlsTimeoutRef = useRef(null);
  const videoRef = useRef(null);

  // Sync video play/pause with state
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  // Sync volume and mute with video element
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Handle real video time updates or fallback simulation timer
  useEffect(() => {
    if (item?.videoUrl || item?.video_url) return; // Real video element handles its own time

    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration, item?.videoUrl, item?.video_url]);

  // Hide controls on inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  // Keyboard shortcuts (Space = Play/Pause, Esc = Exit)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setCurrentTime((t) => Math.min(totalDuration, t + 10));
      } else if (e.key === 'ArrowLeft') {
        setCurrentTime((t) => Math.max(0, t - 10));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, totalDuration]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = Math.floor(pos * totalDuration);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const currentTitle = item?.currentEpisode 
    ? `${item.title}: ${item.currentEpisode.title}` 
    : item?.trailerTitle || item?.title || "Netflix Video";

  const activeVideoUrl = item?.videoUrl || item?.video_url;
  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div 
      className={`video-player-container ${!showControls ? 'hide-cursor' : ''}`}
      onMouseMove={handleMouseMove}
    >
      {/* Video Viewport (Supports real Cloudinary video or simulated backdrop) */}
      <div className="player-video-viewport" onClick={() => setIsPlaying(!isPlaying)}>
        {activeVideoUrl ? (
          <video
            ref={videoRef}
            src={activeVideoUrl}
            className="simulated-video-stream"
            autoPlay
            playsInline
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(Math.floor(videoRef.current.currentTime));
              }
            }}
            onLoadedMetadata={() => {
              if (videoRef.current && videoRef.current.duration) {
                setTotalDuration(Math.floor(videoRef.current.duration));
              }
            }}
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <img 
            src={item?.backdrop || item?.image || "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1920&q=80"} 
            alt={currentTitle} 
            className="simulated-video-stream"
          />
        )}
        <div className="video-vignette" />

        {/* Center Play/Pause Pulsing Icon */}
        {!isPlaying && (
          <div className="center-pause-indicator">
            <Play size={48} fill="#fff" />
          </div>
        )}
      </div>

      {/* Top Header Controls */}
      <div className={`player-top-header ${showControls ? 'visible' : ''}`}>
        <button 
          className="player-back-btn" 
          onClick={onClose}
          title="Back to Browse"
        >
          <ArrowLeft size={30} />
        </button>
        <div className="player-title-info">
          <h2 className="stream-title">{currentTitle}</h2>
          {item?.currentEpisode && (
            <span className="stream-subtitle">
              Season 1: Episode {item.currentEpisode.number}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className={`player-bottom-controls ${showControls ? 'visible' : ''}`}>
        {/* Timeline Progress Scrubber */}
        <div className="timeline-scrubber-wrapper" onClick={handleSeek}>
          <div className="timeline-track">
            <div 
              className="timeline-buffer" 
              style={{ width: `${Math.min(100, progressPercent + 15)}%` }} 
            />
            <div 
              className="timeline-fill" 
              style={{ width: `${progressPercent}%` }}
            />
            <div 
              className="timeline-thumb" 
              style={{ left: `${progressPercent}%` }} 
            />
          </div>
        </div>

        <div className="controls-button-strip">
          {/* Left Actions */}
          <div className="controls-left">
            <button 
              className="ctrl-btn" 
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            >
              {isPlaying ? <Pause size={26} fill="#fff" /> : <Play size={26} fill="#fff" />}
            </button>

            <button 
              className="ctrl-btn" 
              onClick={() => setCurrentTime((t) => Math.max(0, t - 10))}
              title="Rewind 10s (Left Arrow)"
            >
              <RotateCcw size={22} />
              <span className="btn-number-label">10</span>
            </button>

            <button 
              className="ctrl-btn" 
              onClick={() => setCurrentTime((t) => Math.min(totalDuration, t + 10))}
              title="Fast Forward 10s (Right Arrow)"
            >
              <RotateCw size={22} />
              <span className="btn-number-label">10</span>
            </button>

            {/* Volume Control */}
            <div className="volume-control-group">
              <button 
                className="ctrl-btn" 
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={isMuted ? 0 : volume} 
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="volume-slider"
              />
            </div>

            {/* Time Stamp */}
            <div className="player-timestamp">
              <span>{formatTime(currentTime)}</span>
              <span className="time-divider">/</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="controls-right">
            {item?.type === 'tv' && (
              <button 
                className="ctrl-btn next-ep-btn" 
                onClick={() => setCurrentTime(0)}
                title="Next Episode"
              >
                <SkipForward size={22} />
                <span>Next Ep</span>
              </button>
            )}

            {/* Audio & Subtitles Selector */}
            <div className="audio-subtitles-wrapper">
              <button 
                className="ctrl-btn" 
                onClick={() => setShowSubtitlesModal(!showSubtitlesModal)}
                title="Audio & Subtitles"
              >
                <MessageSquare size={22} />
              </button>

              {showSubtitlesModal && (
                <div className="subtitles-panel">
                  <div className="panel-col">
                    <h4>Audio</h4>
                    {['English [Original]', 'Hindi', 'Tamil', 'Spanish', 'French'].map((aud) => (
                      <div 
                        key={aud} 
                        className={`panel-option ${selectedAudio === aud ? 'active' : ''}`}
                        onClick={() => setSelectedAudio(aud)}
                      >
                        <span>{aud}</span>
                      </div>
                    ))}
                  </div>
                  <div className="panel-col">
                    <h4>Subtitles</h4>
                    {['Off', 'English [CC]', 'Hindi', 'Spanish', 'German'].map((sub) => (
                      <div 
                        key={sub} 
                        className={`panel-option ${selectedSubtitles === sub ? 'active' : ''}`}
                        onClick={() => setSelectedSubtitles(sub)}
                      >
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Toggle */}
            <button 
              className="ctrl-btn" 
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
