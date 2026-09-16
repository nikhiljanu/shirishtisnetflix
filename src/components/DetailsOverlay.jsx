import { Play, Plus, ThumbsUp, X } from 'lucide-react';
import '../styles/figma-ui.css';

export default function DetailsOverlay({ video, allVideos, onClose, onPlay }) {
  if (!video) return null;

  const displayTitle = video.publicId.split('/').pop().replace(/-/g, ' ');

  // Dummy episodes using allVideos to fill space
  const episodes = allVideos ? allVideos.slice(0, 5) : [video, video, video, video, video];
  
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-banner">
          <img src={video.thumbnailUrl} alt={displayTitle} />
          <div className="modal-banner-vignette"></div>
          
          <div className="modal-banner-content">
            <h1 className="modal-banner-title">{displayTitle}</h1>
            <div className="modal-actions">
              <button className="btn-play" onClick={() => onPlay(video)}>
                <Play size={24} fill="black" /> Play
              </button>
              <button className="btn-round"><Plus size={24} /></button>
              <button className="btn-round"><ThumbsUp size={20} /></button>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-metadata-grid">
            <div className="modal-info-primary">
              <div className="modal-stats">
                <span className="match">98% Match</span>
                <span>2024</span>
                <span className="maturity">U/A 16+</span>
                <span>3 Seasons</span>
                <span className="hd">HD</span>
              </div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
              </p>
            </div>
            
            <div className="modal-info-secondary">
              <div>
                <span>Cast: </span>
                John Doe, Jane Smith, Robert Brown, Emily White, Michael Green, Sarah Black
              </div>
              <div>
                <span>Genres: </span>
                Action, Thriller, Sci-Fi, Drama
              </div>
              <div>
                <span>This show is: </span>
                Mind-bending, Suspenseful, Exciting
              </div>
            </div>
          </div>

          <div className="episodes-section">
            <div className="episodes-header">
              <h3>Episodes</h3>
              <select className="season-select" defaultValue="Season 1">
                <option value="Season 1">Season 1</option>
                <option value="Season 2">Season 2</option>
                <option value="Season 3">Season 3</option>
              </select>
            </div>

            <div className="episodes-list">
              {episodes.map((ep, idx) => (
                <div className="episode-item" key={idx} onClick={() => onPlay(ep)}>
                  <div className="episode-number">{idx + 1}</div>
                  <img src={ep.thumbnailUrl || video.thumbnailUrl} alt={`Episode ${idx + 1}`} className="episode-thumb" />
                  <div className="episode-details">
                    <div className="episode-title-row">
                      <h4 className="episode-title">Episode {idx + 1}</h4>
                      <span className="episode-duration">45m</span>
                    </div>
                    <p className="episode-synopsis">
                      Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
