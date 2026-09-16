import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ContentRow from './components/ContentRow';
import DetailModal from './components/DetailModal';
import VideoPlayer from './components/VideoPlayer';
import SearchResults from './components/SearchResults';
import Footer from './components/Footer';

import { 
  HERO_FEATURED,
  FRIENDS_SHOW,
  MOVIE_CATEGORIES,
  ALL_MEDIA
} from './data/moviesData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalItem, setModalItem] = useState(null);
  const [playingItem, setPlayingItem] = useState(null);
  // My List persistence in localStorage
  const [myList, setMyList] = useState(() => {
    try {
      const saved = localStorage.getItem('netflix_my_list');
      return saved ? JSON.parse(saved) : [HERO_FEATURED, FRIENDS_SHOW];
    } catch {
      return [HERO_FEATURED, FRIENDS_SHOW];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('netflix_my_list', JSON.stringify(myList));
    } catch (e) {
      console.error(e);
    }
  }, [myList]);

  const handleToggleMyList = (movie) => {
    setMyList((prev) => {
      const exists = prev.some((item) => item.id === movie.id);
      if (exists) {
        return prev.filter((item) => item.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const handleResetHome = () => {
    setActiveTab('home');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open modal with deep copy or full data (e.g. if Friends is clicked, enrich with FRIENDS_SHOW episodes)
  const handleOpenModal = (item) => {
    if (item.id === 'friends' || item.id === 'friends-bb') {
      setModalItem(FRIENDS_SHOW);
    } else if (item.id === HERO_FEATURED.id) {
      setModalItem(HERO_FEATURED);
    } else {
      // Find matching item or enriched data
      const enriched = ALL_MEDIA.find((m) => m.id === item.id) || item;
      setModalItem(enriched);
    }
  };

  const handlePlay = (item) => {
    setPlayingItem(item);
  };

  // Filter items based on active search
  const filteredSearchItems = searchQuery.trim()
    ? ALL_MEDIA.filter((item) => {
        const q = searchQuery.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const genreMatch = item.genres?.some((g) => g.toLowerCase().includes(q));
        const castMatch = item.cast?.some((c) => c.toLowerCase().includes(q));
        return titleMatch || genreMatch || castMatch;
      })
    : [];

  // Filter categories by tab
  const getDisplayCategories = () => {
    if (activeTab === 'tv') {
      return MOVIE_CATEGORIES.filter((cat) => 
        cat.id === 'international-tv-shows' ||
        cat.id === 'critically-acclaimed' ||
        cat.id === 'tv-dramas' ||
        cat.id === 'crime-tv-shows' ||
        cat.id === 'k-dramas'
      );
    }
    if (activeTab === 'movies') {
      return MOVIE_CATEGORIES.filter((cat) => 
        cat.id === 'we-think-youll-love-these' ||
        cat.id === 'made-in-india' ||
        cat.id === 'top-10-india'
      );
    }
    if (activeTab === 'popular') {
      return MOVIE_CATEGORIES.filter((cat) => 
        cat.id === 'top-10-india' ||
        cat.id === 'critically-acclaimed' ||
        cat.id === 'we-think-youll-love-these'
      );
    }
    return MOVIE_CATEGORIES;
  };

  return (
    <div className="app-container">
      {/* Fixed Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        myListCount={myList.length}
        onResetHome={handleResetHome}
      />

      {/* Main Content Area */}
      {searchQuery.trim() ? (
        <SearchResults
          title={`Results for "${searchQuery}"`}
          items={filteredSearchItems}
          onPlay={handlePlay}
          onOpenModal={handleOpenModal}
          myList={myList}
          onToggleMyList={handleToggleMyList}
        />
      ) : activeTab === 'my-list' ? (
        <SearchResults
          title="My List"
          items={myList}
          onPlay={handlePlay}
          onOpenModal={handleOpenModal}
          myList={myList}
          onToggleMyList={handleToggleMyList}
        />
      ) : (
        <>
          {/* Cinematic Hero Banner (Figma Frame 1) */}
          <HeroBanner
            movie={HERO_FEATURED}
            onPlay={handlePlay}
            onOpenModal={handleOpenModal}
          />

          {/* Row Sections & Carousels */}
          <div className="main-content">
            {getDisplayCategories().map((category) => (
              <ContentRow
                key={category.id}
                category={category}
                onPlay={handlePlay}
                onOpenModal={handleOpenModal}
                myList={myList}
                onToggleMyList={handleToggleMyList}
              />
            ))}
          </div>
        </>
      )}

      {/* Detail Modal (Figma Frames 2 & 3) */}
      {modalItem && (
        <DetailModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          onPlay={handlePlay}
          isInMyList={myList.some((m) => m.id === modalItem.id)}
          onToggleMyList={handleToggleMyList}
        />
      )}

      {/* Interactive Video Player Overlay */}
      {playingItem && (
        <VideoPlayer
          item={playingItem}
          onClose={() => setPlayingItem(null)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
