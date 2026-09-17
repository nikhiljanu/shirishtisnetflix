import { useEffect, useState } from 'react';
import { apiUrl } from './config/api';
import TopNav from './components/TopNav';
import HeroBillboard from './components/HeroBillboard';
import CarouselRow from './components/CarouselRow';
import DetailsOverlay from './components/DetailsOverlay';
import CinematicPlayer from './components/CinematicPlayer';
import { Play, Info, Plus, Check } from 'lucide-react';

export default function App() {
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState('loading');
  const [activeMenu, setActiveMenu] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isKidsMode, setIsKidsMode] = useState(false);
  const [myList, setMyList] = useState([]);
  
  const [modalVideo, setModalVideo] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const loadVideos = async () => {
    setStatus('loading');
    try {
      const response = await fetch(apiUrl('/api/videos?limit=100'));
      if (!response.ok) throw new Error('Unable to load videos');
      const result = await response.json();
      const loadedVideos = result.data || [];
      setVideos(loadedVideos);
      // Seed My List with first video initially if empty
      setMyList(prev => prev.length > 0 ? prev : loadedVideos.slice(0, 1));
      setStatus('ready');
    } catch (requestError) {
      console.error('Video library request failed:', requestError);
      setStatus('error');
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handlePlay = (video) => {
    setPlayingVideo(video);
  };

  const handleMoreInfo = (video) => {
    setModalVideo(video);
  };

  const closeModals = () => {
    setModalVideo(null);
  };

  const handleToggleMyList = (video) => {
    setMyList((prev) => {
      const exists = prev.some(item => item.publicId === video.publicId);
      if (exists) {
        return prev.filter(item => item.publicId !== video.publicId);
      }
      return [...prev, video];
    });
  };

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
    for(let i = 0; i < multiplier; i++) {
      result = [...result, ...seedList];
    }
    return result;
  };

  const heroVideo = videos[0];
  const popularMovies = generateRowData(videos, Math.ceil(8 / videos.length)).slice(0, 8);
  const top10Movies = generateRowData([...videos].reverse(), Math.ceil(10 / videos.length)).slice(0, 10);
  const trendingSeries = generateRowData(videos, Math.ceil(8 / videos.length)).slice(0, 8);

  const getDisplayTitle = (video) => {
    const rawTitle = video.publicId.split('/').pop().replace(/-/g, ' ').replace(/_/g, ' ');
    return rawTitle.toLowerCase().startsWith('img') ? 'Diwali Diaries' : rawTitle;
  };

  // Filter videos for search across title and id
  const filteredVideos = searchQuery.trim()
    ? videos.filter(v => {
        const title = getDisplayTitle(v).toLowerCase();
        const id = v.publicId.toLowerCase();
        const query = searchQuery.toLowerCase();
        return title.includes(query) || id.includes(query);
      })
    : [];

  return (
    <>
      <TopNav 
        activeMenu={activeMenu}
        onSelectMenu={(menu) => {
          setActiveMenu(menu);
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isKidsMode={isKidsMode}
        onToggleKids={() => setIsKidsMode(!isKidsMode)}
        notificationThumb={videos[0]?.thumbnailUrl}
      />

      {isKidsMode && (
        <div className="kids-banner">
          <span>👶 Netflix Kids Mode is Active</span>
          <button className="kids-exit-btn" onClick={() => setIsKidsMode(false)}>Exit Kids</button>
        </div>
      )}

      {/* 1. SEARCH RESULTS VIEW */}
      {searchQuery.trim() ? (
        <div className="view-container">
          <div className="view-header">
            <h1 className="view-title">Search Results</h1>
            <span className="view-subtitle">Showing matches for "{searchQuery}"</span>
          </div>

          {filteredVideos.length > 0 ? (
            <div className="content-grid">
              {filteredVideos.map((video, idx) => {
                const title = video.publicId.split('/').pop().replace(/-/g, ' ').replace(/_/g, ' ');
                const isBookmarked = myList.some(item => item.publicId === video.publicId);
                return (
                  <div className="grid-card" key={idx} onClick={() => handleMoreInfo(video)}>
                    <img src={video.thumbnailUrl} alt={title} />
                    <div className="grid-card-overlay">
                      <div className="grid-card-title">{title}</div>
                      <div className="grid-card-actions">
                        <button className="hover-btn play" onClick={(e) => { e.stopPropagation(); handlePlay(video); }} title="Play">
                          <Play size={14} fill="black" />
                        </button>
                        <button 
                          className="hover-btn" 
                          onClick={(e) => { e.stopPropagation(); handleToggleMyList(video); }} 
                          title={isBookmarked ? "Remove from My List" : "Add to My List"}
                        >
                          {isBookmarked ? <Check size={14} color="#46d369" /> : <Plus size={16} />}
                        </button>
                        <button className="hover-btn" style={{ marginLeft: 'auto' }} onClick={(e) => { e.stopPropagation(); handleMoreInfo(video); }}>
                          <Info size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-view-state">
              <div className="empty-view-title">No matches found for "{searchQuery}"</div>
              <p>Try searching for a different title or explore our recommendations.</p>
              <button className="empty-view-btn" onClick={() => setSearchQuery('')}>Clear Search</button>
            </div>
          )}
        </div>
      ) : activeMenu === 'My List' ? (
        /* 2. MY LIST VIEW */
        <div className="view-container">
          <div className="view-header">
            <h1 className="view-title">My List</h1>
            <span className="view-subtitle">{myList.length} saved {myList.length === 1 ? 'title' : 'titles'}</span>
          </div>

          {myList.length > 0 ? (
            <div className="content-grid">
              {myList.map((video, idx) => {
                const title = video.publicId.split('/').pop().replace(/-/g, ' ').replace(/_/g, ' ');
                return (
                  <div className="grid-card" key={idx} onClick={() => handleMoreInfo(video)}>
                    <img src={video.thumbnailUrl} alt={title} />
                    <div className="grid-card-overlay">
                      <div className="grid-card-title">{title}</div>
                      <div className="grid-card-actions">
                        <button className="hover-btn play" onClick={(e) => { e.stopPropagation(); handlePlay(video); }} title="Play">
                          <Play size={14} fill="black" />
                        </button>
                        <button 
                          className="hover-btn" 
                          onClick={(e) => { e.stopPropagation(); handleToggleMyList(video); }} 
                          title="Remove from My List"
                        >
                          <Check size={14} color="#46d369" />
                        </button>
                        <button className="hover-btn" style={{ marginLeft: 'auto' }} onClick={(e) => { e.stopPropagation(); handleMoreInfo(video); }}>
                          <Info size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-view-state">
              <div className="empty-view-title">You haven't added any titles to your list yet.</div>
              <p>Add shows and movies to your list so you can easily watch them later.</p>
              <button className="empty-view-btn" onClick={() => setActiveMenu('Home')}>Explore Popular Titles</button>
            </div>
          )}
        </div>
      ) : activeMenu === 'Shows' ? (
        /* 3. TV SHOWS VIEW */
        <>
          <HeroBillboard 
            video={videos[1] || heroVideo} 
            onPlay={handlePlay} 
            onMoreInfo={handleMoreInfo} 
          />
          <div style={{ marginTop: '1rem', paddingBottom: '4rem' }}>
            <CarouselRow 
              title="Trending TV Shows" 
              videos={trendingSeries} 
              onPlay={handlePlay} 
              onMoreInfo={handleMoreInfo}
              myList={myList}
              onToggleMyList={handleToggleMyList}
            />
            <CarouselRow 
              title="Top 10 Web Series" 
              videos={top10Movies} 
              isTop10={true}
              onPlay={handlePlay} 
              onMoreInfo={handleMoreInfo}
              myList={myList}
              onToggleMyList={handleToggleMyList}
            />
            <CarouselRow 
              title="Binge-worthy Dramas" 
              videos={popularMovies} 
              onPlay={handlePlay} 
              onMoreInfo={handleMoreInfo}
              myList={myList}
              onToggleMyList={handleToggleMyList}
            />
          </div>
        </>
      ) : activeMenu === 'Movies' ? (
        /* 4. MOVIES VIEW */
        <>
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
              myList={myList}
              onToggleMyList={handleToggleMyList}
            />
            <CarouselRow 
              title="Blockbuster Movies" 
              videos={popularMovies} 
              onPlay={handlePlay} 
              onMoreInfo={handleMoreInfo}
              myList={myList}
              onToggleMyList={handleToggleMyList}
            />
            <CarouselRow 
              title="Award-Winning Films" 
              videos={trendingSeries} 
              onPlay={handlePlay} 
              onMoreInfo={handleMoreInfo}
              myList={myList}
              onToggleMyList={handleToggleMyList}
            />
          </div>
        </>
      ) : activeMenu === 'New & Popular' ? (
        /* 5. NEW & POPULAR VIEW */
        <div style={{ paddingTop: '80px', paddingBottom: '4rem' }}>
          <CarouselRow 
            title="Top 10 Today" 
            videos={top10Movies} 
            isTop10={true}
            onPlay={handlePlay} 
            onMoreInfo={handleMoreInfo}
            myList={myList}
            onToggleMyList={handleToggleMyList}
          />
          <CarouselRow 
            title="Trending Now" 
            videos={trendingSeries} 
            onPlay={handlePlay} 
            onMoreInfo={handleMoreInfo}
            myList={myList}
            onToggleMyList={handleToggleMyList}
          />
          <CarouselRow 
            title="Worth The Wait: Coming Soon" 
            videos={popularMovies} 
            onPlay={handlePlay} 
            onMoreInfo={handleMoreInfo}
            myList={myList}
            onToggleMyList={handleToggleMyList}
          />
        </div>
      ) : (
        /* 6. HOME VIEW */
        <>
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
              myList={myList}
              onToggleMyList={handleToggleMyList}
            />
            
            <CarouselRow 
              title="Continue Watching for User" 
              videos={popularMovies} 
              isContinueWatching={true}
              onPlay={handlePlay} 
              onMoreInfo={handleMoreInfo}
              myList={myList}
              onToggleMyList={handleToggleMyList}
            />

            <CarouselRow 
              title="Trending Web Series" 
              videos={trendingSeries} 
              onPlay={handlePlay} 
              onMoreInfo={handleMoreInfo}
              myList={myList}
              onToggleMyList={handleToggleMyList}
            />
          </div>
        </>
      )}

      {modalVideo && (
        <DetailsOverlay 
          video={modalVideo} 
          allVideos={videos} 
          onClose={closeModals} 
          onPlay={handlePlay}
          myList={myList}
          onToggleMyList={handleToggleMyList}
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
