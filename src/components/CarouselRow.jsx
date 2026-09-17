import { Play, Plus, Check, ThumbsUp, ChevronDown } from 'lucide-react';
import '../styles/figma-ui.css';

export default function CarouselRow({ 
  title, 
  videos, 
  isTop10, 
  isContinueWatching, 
  onPlay, 
  onMoreInfo,
  myList = [],
  onToggleMyList
}) {
  if (!videos || videos.length === 0) return null;

  return (
    <div className={`carousel-row ${isTop10 ? 'top-10-row' : ''}`}>
      <h2 className="carousel-title">{title}</h2>
      
      <div className="carousel-container">
        {videos.map((video, index) => {
          const rawTitle = video.publicId.split('/').pop().replace(/-/g, ' ').replace(/_/g, ' ');
          const displayTitle = rawTitle.toLowerCase().startsWith('img') ? 'Diwali Diaries' : rawTitle;
          const isBookmarked = myList.some(item => item.publicId === video.publicId);
          
          return (
            <div className="carousel-card" key={`${video.publicId}-${index}`} onClick={() => onMoreInfo(video)}>
              {isTop10 && (
                <span className="top-10-number">{index + 1}</span>
              )}
              
              <img 
                src={video.thumbnailUrl} 
                alt={displayTitle} 
                className="carousel-poster"
                loading="lazy"
              />
              
              {isContinueWatching && (
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
                </div>
              )}

              <div className="hover-info">
                {isTop10 && (
                  <img src={video.thumbnailUrl} alt={displayTitle} className="hover-info-top10-poster" />
                )}
                <div className="hover-info-content">
                  <div className="hover-actions">
                    <button className="hover-btn play" onClick={(e) => { e.stopPropagation(); onPlay(video); }} title="Play">
                      <Play size={16} fill="black" />
                    </button>
                    <button 
                      className="hover-btn" 
                      onClick={(e) => { e.stopPropagation(); onToggleMyList?.(video); }}
                      title={isBookmarked ? "Remove from My List" : "Add to My List"}
                    >
                      {isBookmarked ? <Check size={16} color="#46d369" /> : <Plus size={18} />}
                    </button>
                    <button className="hover-btn" title="Like"><ThumbsUp size={16} /></button>
                    <button className="hover-btn" style={{ marginLeft: 'auto' }} onClick={(e) => { e.stopPropagation(); onMoreInfo(video); }} title="More Info">
                      <ChevronDown size={18} />
                    </button>
                  </div>
                  <div className="hover-meta">
                    <span className="maturity">U/A 16+</span>
                    <span>37 Episodes</span>
                    <span className="hd">HD</span>
                  </div>
                  <div className="hover-tags">
                    Chilling <span className="dot">•</span> Cerebral <span className="dot">•</span> Horror Anime
                  </div>
                  <div className="hover-badge">
                    <ThumbsUp size={12} fill="white" style={{ marginRight: '6px' }}/> Most Liked
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
