import { useState, useRef, useEffect } from 'react';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { fetchPlaybackUrl } from '../config/api';
import { useAutoPreviewVideo } from '../hooks/useAutoPreviewVideo';
import '../styles/figma-ui.css';

export default function HeroBillboard({ video, onPlay, onMoreInfo }) {
  const [isMuted, setIsMuted] = useState(true);
  const [playbackUrl, setPlaybackUrl] = useState(null);
  const videoRef = useRef(null);

  useAutoPreviewVideo(videoRef, playbackUrl, { maxPlayMs: 15000 });

  useEffect(() => {
    if (!video) return;
    let cancelled = false;
    setPlaybackUrl(null);
    fetchPlaybackUrl(video.publicId)
      .then((data) => {
        if (!cancelled) setPlaybackUrl(data.secureUrl);
      })
      .catch((error) => {
        if (!cancelled) console.error('Hero preview playback URL failed:', error);
      });
    return () => { cancelled = true; };
  }, [video?.publicId]);

  if (!video) return null;

  const title = video.publicId.split('/').pop().replace(/-/g, ' ');

  const handleToggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="hero-container">
      <div className="hero-card">
        {/* Background Video Media with Fallback Poster */}
        {playbackUrl ? (
          <video
            ref={videoRef}
            src={playbackUrl}
            poster={video.thumbnailUrl}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            className="hero-media"
          />
        ) : (
          <img 
            src={video.thumbnailUrl} 
            alt={title} 
            className="hero-media" 
          />
        )}
        
        {/* Cinematic Scrim Vignette Overlay */}
        <div className="hero-vignette" />

        {/* Volume Mute/Unmute Toggle in Top Right */}
        <button 
          className="hero-volume-btn" 
          onClick={handleToggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        
        {/* Bottom Hero Details Overlay */}
        <div className="hero-footer-content">
          <div className="hero-left-info">
            <h1 className="hero-title">
              <span className="hero-title-prefix">the</span>
              {title.toLowerCase().startsWith('img') ? 'Diwali Diaries' : title}
            </h1>
            
            <div className="hero-meta-line">
              <span>Series</span>
              <span className="dot">•</span>
              <span>Drama</span>
              <span className="dot">•</span>
              <span>2026</span>
              <span className="dot">•</span>
              <span>8 Seasons</span>
              <span className="dot">•</span>
              <span className="hero-rating-pill">A</span>
            </div>
            
            <div className="hero-buttons">
              <button className="btn-pill-play" onClick={() => onPlay(video)}>
                <Play size={20} fill="black" /> Play
              </button>
              <button className="btn-pill-more" onClick={() => onMoreInfo(video)}>
                <Info size={20} /> More Info
              </button>
            </div>
          </div>

          {/* Bottom Right Callout Tags */}
          <div className="hero-right-tags">
            <div className="hero-tag-item">
              <span className="tag-emoji">👍</span>
              <span>We think you'll love this!</span>
            </div>
            <div className="hero-tag-item">
              <span className="tag-emoji">🍿</span>
              <span>"Twilight" meets "True Blood"</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

