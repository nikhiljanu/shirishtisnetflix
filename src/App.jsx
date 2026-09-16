import { useEffect, useMemo, useState } from 'react';
import { Play, RefreshCw, Search, X } from 'lucide-react';
import VideoPlayer from './components/VideoPlayer';
import { apiUrl } from './config/api';
import './styles/catalog.css';

export default function App() {
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [status, setStatus] = useState('loading');

  const loadVideos = async ({ showLoading = true } = {}) => {
    if (showLoading) setStatus('loading');
    try {
      const response = await fetch(apiUrl('/api/videos?limit=100'));
      if (!response.ok) throw new Error('Unable to load videos');
      const result = await response.json();
      setVideos(result.data || []);
      setStatus('ready');
    } catch (requestError) {
      console.error('Video library request failed:', requestError);
      setStatus('error');
    }
  };

  useEffect(() => {
    const requestTimer = window.setTimeout(() => loadVideos({ showLoading: false }), 0);
    return () => window.clearTimeout(requestTimer);
  }, []);

  const visibleVideos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return videos;
    return videos.filter((video) => video.publicId.toLowerCase().includes(normalizedQuery));
  }, [query, videos]);

  const displayTitle = (video) => video.publicId.split('/').at(-1);
  const heroVideo = visibleVideos[0] || videos[0];

  return (
    <main className="video-library">
      <header className="library-header">
        <button className="library-brand" onClick={() => { setQuery(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          SHRISHTI'S
        </button>
        <label className="library-search">
          <Search size={18} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles" aria-label="Search titles" />
          {query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button>}
        </label>
      </header>

      {status === 'loading' && <div className="library-state">Loading videos…</div>}
      {status === 'error' && (
        <div className="library-state library-error">
          <p>Videos could not be loaded.</p>
          <button onClick={loadVideos}><RefreshCw size={17} /> Retry</button>
        </div>
      )}
      {status === 'ready' && videos.length === 0 && <div className="library-state">No videos have been uploaded yet.</div>}

      {status === 'ready' && heroVideo && (
        <section className="library-feature" style={{ '--feature-image': `url("${heroVideo.thumbnailUrl}")` }}>
          <div className="feature-shade" />
          <div className="feature-content">
            <h1>{displayTitle(heroVideo)}</h1>
            <button className="play-feature" onClick={() => setSelectedVideo(heroVideo)}><Play size={20} fill="currentColor" /> Play</button>
          </div>
        </section>
      )}

      {status === 'ready' && visibleVideos.length > 0 && (
        <section className="library-grid" aria-label="Video library">
          {visibleVideos.map((video) => (
            <article className="video-tile" key={video.publicId}>
              <button className="video-tile-media" onClick={() => setSelectedVideo(video)} aria-label={`Play ${displayTitle(video)}`}>
                <img src={video.thumbnailUrl} alt="" loading="lazy" />
                <span className="tile-play"><Play size={18} fill="currentColor" /></span>
              </button>
              <h2>{displayTitle(video)}</h2>
            </article>
          ))}
        </section>
      )}

      {status === 'ready' && videos.length > 0 && visibleVideos.length === 0 && <div className="library-state">No matching titles.</div>}

      {selectedVideo && <VideoPlayer video={selectedVideo} title={displayTitle(selectedVideo)} onClose={() => setSelectedVideo(null)} />}
    </main>
  );
}
