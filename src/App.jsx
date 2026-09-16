import { useEffect, useState } from 'react';
import { apiUrl } from './config/api';
import TopNav from './components/TopNav';
import HeroBillboard from './components/HeroBillboard';
import CarouselRow from './components/CarouselRow';
import DetailsOverlay from './components/DetailsOverlay';
import CinematicPlayer from './components/CinematicPlayer';

export default function App() {
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState('loading');
  const [activeMenu, setActiveMenu] = useState('Home');
  
  const [modalVideo, setModalVideo] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const loadVideos = async () => {
    setStatus('loading');
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
    loadVideos();
  }, []);

  if (status === 'loading') {
    return <div style={{ height: '100vh', display: 'grid', placeItems: 'center', background: '#141414', color: 'white' }}>Loading...</div>;
  }
  
  if (status === 'error' || videos.length === 0) {
    return (
      <div style={{ height: '100vh', display: 'grid', placeItems: 'center', background: '#141414', color: 'white' }}>
        <h2>No videos found</h2>
        <button onClick={loadVideos} style={{ padding: '10px 20px', background: 'white', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>Retry</button>
      </div>
    );
  }

  // Duplicate arrays to fill the carousels if there are very few videos
  const generateRowData = (seedList, multiplier = 1) => {
    let result = [];
    for(let i=0; i<multiplier; i++) {
      result = [...result, ...seedList];
    }
    return result;
  };

  const heroVideo = videos[0];
  
  // Create the requested rows: 2 movie rows, 1 webseries row (using same video as 5 episodes in the modal)
  const popularMovies = generateRowData(videos, Math.ceil(8 / videos.length)).slice(0, 8);
  const top10Movies = generateRowData([...videos].reverse(), Math.ceil(10 / videos.length)).slice(0, 10);
  const trendingSeries = generateRowData(videos, Math.ceil(8 / videos.length)).slice(0, 8);

  const handlePlay = (video) => {
    setPlayingVideo(video);
  };

  const handleMoreInfo = (video) => {
    setModalVideo(video);
  };

  const closeModals = () => {
    setModalVideo(null);
  };

  return (
    <>
      <TopNav activeMenu={activeMenu} />
      
      <HeroBillboard 
        video={heroVideo} 
        onPlay={handlePlay} 
        onMoreInfo={handleMoreInfo} 
      />
      
      <div style={{ marginTop: '1rem', paddingBottom: '4rem' }}>
        <CarouselRow 
          title="Top 10 Movies Today" 
          videos={top10Movies} 
          isTop10={true}
          onPlay={handlePlay}
          onMoreInfo={handleMoreInfo}
        />
        
        <CarouselRow 
          title="Continue Watching for User" 
          videos={popularMovies} 
          isContinueWatching={true}
          onPlay={handlePlay}
          onMoreInfo={handleMoreInfo}
        />

        <CarouselRow 
          title="Trending Web Series" 
          videos={trendingSeries} 
          onPlay={handlePlay}
          onMoreInfo={handleMoreInfo}
        />
      </div>

      {modalVideo && (
        <DetailsOverlay 
          video={modalVideo} 
          allVideos={videos} // Pass all videos to act as dummy episodes for the webseries
          onClose={closeModals} 
          onPlay={handlePlay} 
        />
      )}

      {playingVideo && (
        <CinematicPlayer 
          video={playingVideo} 
          onClose={() => setPlayingVideo(null)} 
        />
      )}
    </>
  );
}
