import React, { useState } from 'react';
import { Play, Plus, Check, ThumbsUp, ChevronDown } from 'lucide-react';
import '../styles/card.css';

export default function MovieCard({
  movie,
  isContinueWatching = false,
  isTop10 = false,
  rank = null,
  onPlay,
  onOpenModal,
  isInMyList = false,
  onToggleMyList
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);

  // If Top 10 card with 3D number
  if (isTop10 && rank) {
    return (
      <div 
        className="top10-card-wrapper"
        onClick={() => onOpenModal(movie)}
      >
        <div className="top10-rank-number">
          {rank}
        </div>
        <div className="top10-poster-container">
          <img 
            src={movie.image} 
            alt={movie.title} 
            className="top10-poster-img"
            loading="lazy" 
          />
          {movie.badge && (
            <div className="card-badge red-badge">
              <span>{movie.badge}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Continue Watching card with progress indicator
  if (isContinueWatching) {
    return (
      <div className="cw-card-container">
        <div 
          className="cw-thumbnail-box"
          onClick={() => onPlay(movie)}
        >
          <img 
            src={movie.image} 
            alt={movie.title} 
            className="cw-thumbnail-img"
            loading="lazy"
          />
          <div className="cw-play-overlay">
            <div className="cw-play-circle">
              <Play size={20} fill="#fff" />
            </div>
          </div>
          <div className="cw-progress-bar-bg">
            <div 
              className="cw-progress-bar-fill" 
              style={{ width: `${movie.progress || 50}%` }}
            />
          </div>
        </div>

        <div className="cw-bottom-meta">
          <div className="cw-text-info">
            <h4 className="cw-title">{movie.title}</h4>
            <span className="cw-time-left">{movie.timeLeft || `${movie.duration}`}</span>
          </div>
          <button 
            className="cw-info-btn"
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(movie);
            }}
            title="More Info"
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Standard Netflix Hoverable Movie Card
  return (
    <div 
      className="movie-card-root"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base Card Thumbnail */}
      <div 
        className="card-base-thumbnail"
        onClick={() => onOpenModal(movie)}
      >
        <img 
          src={movie.image} 
          alt={movie.title} 
          className="card-poster-img"
          loading="lazy"
        />
        {movie.badge && (
          <div className={`card-badge ${movie.badge.toLowerCase().includes('top') ? 'badge-top10' : 'red-badge'}`}>
            <span>{movie.badge}</span>
          </div>
        )}
      </div>

      {/* Expanded Hover Preview Card */}
      {isHovered && (
        <div className="card-hover-preview">
          <div 
            className="hover-preview-media"
            onClick={() => onPlay(movie)}
          >
            <img 
              src={movie.image} 
              alt={movie.title} 
              className="hover-preview-img"
            />
            <div className="hover-media-overlay" />
            <div className="hover-title-badge">
              <span>{movie.title}</span>
            </div>
          </div>

          <div className="hover-preview-body">
            {/* Action Buttons Row */}
            <div className="hover-action-row">
              <div className="action-group-left">
                <button 
                  className="round-btn play-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay(movie);
                  }}
                  title="Play"
                >
                  <Play size={15} fill="#000" color="#000" />
                </button>

                <button 
                  className={`round-btn list-btn ${isInMyList ? 'in-list' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMyList(movie);
                  }}
                  title={isInMyList ? "Remove from My List" : "Add to My List"}
                >
                  {isInMyList ? <Check size={16} /> : <Plus size={16} />}
                </button>

                <button 
                  className={`round-btn thumbs-btn ${liked ? 'liked' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLiked(!liked);
                  }}
                  title="I like this"
                >
                  <ThumbsUp size={15} />
                </button>
              </div>

              <button 
                className="round-btn expand-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(movie);
                }}
                title="Episode & info details"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Quick Metadata */}
            <div className="hover-meta-row">
              <span className="match-score">{movie.matchScore || 95}% Match</span>
              <span className="maturity-tag">{movie.maturity || 'U/A 16+'}</span>
              <span className="duration-tag">{movie.duration || '1h 45m'}</span>
              <span className="hd-tag">HD</span>
            </div>

            {/* Genres */}
            <div className="hover-genres-row">
              {(movie.genres || ['Drama', 'Exciting']).slice(0, 3).map((genre, idx) => (
                <React.Fragment key={genre}>
                  <span>{genre}</span>
                  {idx < Math.min((movie.genres || []).length, 3) - 1 && <span className="genre-dot">•</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
