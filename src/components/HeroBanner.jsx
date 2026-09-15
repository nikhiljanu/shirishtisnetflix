import React, { useState } from 'react';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import '../styles/hero.css';

export default function HeroBanner({ movie, onPlay, onOpenModal }) {
  const [isMuted, setIsMuted] = useState(true);

  if (!movie) return null;

  return (
    <div className="hero-banner">
      {/* Background Media with Multi-directional Gradients */}
      <div className="hero-backdrop-container">
        <img 
          src={movie.backdrop} 
          alt={movie.title} 
          className="hero-backdrop-image"
        />
        <div className="hero-gradient-left" />
        <div className="hero-gradient-bottom" />
        <div className="hero-gradient-top" />
      </div>

      {/* Main Content Info */}
      <div className="hero-content">
        <div className="hero-meta-strip">
          <span className="hero-category-tag">{movie.categoryTag}</span>
          <span className="bullet-dot">•</span>
          <span>{movie.genreMain}</span>
          <span className="bullet-dot">•</span>
          <span>{movie.year}</span>
          <span className="bullet-dot">•</span>
          <span>{movie.duration}</span>
          <span className="bullet-dot">•</span>
          <span className="hero-maturity-badge">{movie.maturity}</span>
        </div>

        {/* Title Presentation */}
        <div className="hero-title-container">
          <h3 className="hero-author-tag">TYLER PERRY'S</h3>
          <h1 className="hero-main-title">WHY DID I GET<br />MARRIED AGAIN?</h1>
        </div>

        {/* Synopsis & Taglines */}
        <p className="hero-synopsis">
          {movie.synopsis}
        </p>

        {/* Action Buttons */}
        <div className="hero-buttons">
          <button 
            className="hero-btn btn-play"
            onClick={() => onPlay(movie)}
            id="hero-play-btn"
          >
            <Play size={22} fill="currentColor" />
            <span>Play</span>
          </button>

          <button 
            className="hero-btn btn-info"
            onClick={() => onOpenModal(movie)}
            id="hero-info-btn"
          >
            <Info size={22} />
            <span>More Info</span>
          </button>
        </div>
      </div>

      {/* Right Controls: Audio & Age Rating */}
      <div className="hero-right-controls">
        <button 
          className="sound-toggle-btn"
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="hero-age-rating">
          <div className="drama-bubble">
            <span>A Vow to bring the Drama: Watch Now</span>
          </div>
          <span className="hair-quote">Wait, fake your hair?</span>
          <div className="rating-pill">
            <span>{movie.maturity}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
