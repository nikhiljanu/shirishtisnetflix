import React, { useState, useEffect } from 'react';
import { Play, Plus, Check, ThumbsUp, Volume2, VolumeX, X, ChevronDown } from 'lucide-react';
import '../styles/modal.css';

export default function DetailModal({
  item,
  onClose,
  onPlay,
  isInMyList = false,
  onToggleMyList,
  onSelectRelated
}) {
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState('Season 1');
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    // Lock background scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!item) return null;

  const isTvShow = item.type === 'tv' || !!item.episodes;
  const episodes = item.episodes || [];
  const moreLikeThis = item.moreLikeThis || [];
  const trailers = item.trailers || [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Close modal"
          title="Close"
        >
          <X size={22} />
        </button>

        {/* Modal Hero Header */}
        <div className="modal-hero">
          <img 
            src={item.backdrop || item.image} 
            alt={item.title} 
            className="modal-hero-img" 
          />
          <div className="modal-hero-gradient" />

          <div className="modal-hero-content">
            <h1 className="modal-title">{item.title}</h1>

            <div className="modal-hero-actions">
              <button 
                className="modal-btn modal-play-btn"
                onClick={() => onPlay(item)}
              >
                <Play size={20} fill="#000" color="#000" />
                <span>Play</span>
              </button>

              <button 
                className={`modal-round-btn ${isInMyList ? 'active-list' : ''}`}
                onClick={() => onToggleMyList(item)}
                title={isInMyList ? "In your list" : "Add to My List"}
              >
                {isInMyList ? <Check size={20} /> : <Plus size={20} />}
              </button>

              <button 
                className={`modal-round-btn ${liked ? 'liked' : ''}`}
                onClick={() => setLiked(!liked)}
                title="Rate this"
              >
                <ThumbsUp size={18} />
              </button>

              <button 
                className="modal-round-btn sound-btn"
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="modal-body">
          {/* Top Info Grid (Figma 2-column layout) */}
          <div className="modal-metadata-grid">
            {/* Left Column: Metadata & Synopsis */}
            <div className="meta-left-col">
              <div className="meta-tags-line">
                <span className="modal-match-score">{item.matchScore || 98}% Match</span>
                <span className="modal-year">{item.year || 2026}</span>
                <span className="modal-duration">{item.duration || `${item.seasonsCount || 10} Seasons`}</span>
                <span className="modal-hd-badge">Ultra HD 4K</span>
                <span className="modal-hd-badge">5.1 Audio</span>
              </div>

              <div className="maturity-rating-row">
                <span className="rating-tag">{item.maturity || 'U/A 16+'}</span>
                <span className="rating-desc">{item.ratingNotice || 'sexual content, coarse language'}</span>
              </div>

              {item.tagline && (
                <div className="modal-tagline-heading">
                  <h4>{item.tagline}</h4>
                </div>
              )}

              <p className="modal-synopsis-text">
                {item.synopsis}
              </p>
            </div>

            {/* Right Column: Cast, Genres, Moods */}
            <div className="meta-right-col">
              <div className="credit-line">
                <span className="credit-label">Cast: </span>
                <span className="credit-values">
                  {(item.cast || ['Tyler Perry', 'Tasha Smith', 'Jill Scott', 'Richard T. Jones']).join(', ')}
                </span>
              </div>

              <div className="credit-line">
                <span className="credit-label">Genres: </span>
                <span className="credit-values">
                  {(item.genres || ['Romantic Comedies', 'Drama Movies', 'US Movies']).join(', ')}
                </span>
              </div>

              <div className="credit-line">
                <span className="credit-label">This {isTvShow ? 'Show' : 'Movie'} Is: </span>
                <span className="credit-values">
                  {(item.moods || ['Witty', 'Romantic', 'Feel-Good']).join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* TV SHOW EPISODES SECTION (Figma Frame 3 - Friends) */}
          {isTvShow && episodes.length > 0 && (
            <div className="modal-episodes-section">
              <div className="episodes-header">
                <h3 className="section-heading">Episodes</h3>

                {/* Season Dropdown Selector */}
                <div className="season-selector-wrapper">
                  <button 
                    className="season-dropdown-btn"
                    onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)}
                  >
                    <span>{selectedSeason}</span>
                    <ChevronDown size={18} />
                  </button>

                  {isSeasonDropdownOpen && (
                    <div className="season-menu">
                      {['Season 1', 'Season 2', 'Season 3', 'Season 4'].map((season) => (
                        <div 
                          key={season}
                          className={`season-menu-item ${selectedSeason === season ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedSeason(season);
                            setIsSeasonDropdownOpen(false);
                          }}
                        >
                          {season}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Episode Rows List */}
              <div className="episodes-list">
                {episodes.map((ep) => (
                  <div 
                    key={ep.id} 
                    className="episode-card"
                    onClick={() => onPlay({ ...item, currentEpisode: ep })}
                  >
                    <span className="episode-index-number">{ep.number}</span>
                    <div className="episode-thumb-container">
                      <img src={ep.thumbnail} alt={ep.title} className="episode-thumb-img" />
                      <div className="episode-play-overlay">
                        <Play size={20} fill="#fff" />
                      </div>
                    </div>
                    <div className="episode-info">
                      <div className="episode-top-line">
                        <h4 className="episode-title">{ep.title}</h4>
                        <span className="episode-duration">{ep.duration}</span>
                      </div>
                      <p className="episode-synopsis">{ep.synopsis}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TRAILERS & MORE SECTION (Figma Frame 2) */}
          {trailers.length > 0 && (
            <div className="modal-trailers-section">
              <h3 className="section-heading">Trailers & More</h3>
              <div className="trailers-grid">
                {trailers.map((trailer) => (
                  <div 
                    key={trailer.id} 
                    className="trailer-card"
                    onClick={() => onPlay({ ...item, trailerTitle: trailer.title })}
                  >
                    <div className="trailer-thumb-box">
                      <img src={trailer.thumbnail} alt={trailer.title} className="trailer-thumb-img" />
                      <div className="trailer-play-icon">
                        <Play size={24} fill="#fff" />
                      </div>
                      <span className="trailer-runtime-badge">{trailer.duration}</span>
                    </div>
                    <h5 className="trailer-title">{trailer.title}</h5>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MORE LIKE THIS SECTION (Figma Frame 2 & Frame 3) */}
          {moreLikeThis.length > 0 && (
            <div className="modal-more-like-this-section">
              <h3 className="section-heading">More Like This</h3>
              <div className="more-like-this-grid">
                {moreLikeThis.map((related) => (
                  <div key={related.id} className="related-card">
                    <div className="related-thumbnail-box">
                      <img src={related.image} alt={related.title} className="related-img" />
                      <span className="related-duration-badge">{related.duration}</span>
                      <div className="related-play-hover" onClick={() => onPlay(related)}>
                        <Play size={22} fill="#fff" />
                      </div>
                    </div>

                    <div className="related-card-body">
                      <div className="related-meta-row">
                        <div className="meta-stats">
                          <span className="related-match">{related.matchScore || 94}% Match</span>
                          <span className="related-year">{related.year}</span>
                          <span className="related-maturity">{related.maturity || 'U/A 16+'}</span>
                        </div>
                        <button 
                          className="related-add-btn"
                          onClick={() => onToggleMyList(related)}
                          title="Add to My List"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <p className="related-synopsis">{related.synopsis}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABOUT SECTION */}
          <div className="modal-about-section">
            <h3 className="section-heading">About {item.title}</h3>
            <div className="about-details">
              <p><span>Director: </span>{item.director || 'Tyler Perry'}</p>
              <p><span>Cast: </span>{(item.cast || ['Tyler Perry', 'Tasha Smith', 'Jill Scott']).join(', ')}</p>
              <p><span>Writers: </span>{item.writer || 'Tyler Perry'}</p>
              <p><span>Genres: </span>{(item.genres || ['Comedies', 'Dramas']).join(', ')}</p>
              <p><span>Maturity Rating: </span><strong>{item.maturity || 'U/A 16+'}</strong> Recommended for ages 16 and up.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
