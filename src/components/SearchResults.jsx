import React from 'react';
import MovieCard from './MovieCard';
import '../styles/rows.css';

export default function SearchResults({
  title,
  items,
  onPlay,
  onOpenModal,
  myList,
  onToggleMyList
}) {
  return (
    <div className="search-results-section" style={{ padding: '120px 4% 60px' }}>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '24px', color: '#fff' }}>
        {title} ({items.length})
      </h2>

      {items.length === 0 ? (
        <div style={{ color: '#888', fontSize: '1.1rem', margin: '40px 0' }}>
          No titles found matching your search. Try searching for another movie, TV show, or actor.
        </div>
      ) : (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '24px 14px'
          }}
        >
          {items.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlay={onPlay}
              onOpenModal={onOpenModal}
              isInMyList={myList.some((m) => m.id === movie.id)}
              onToggleMyList={onToggleMyList}
            />
          ))}
        </div>
      )}
    </div>
  );
}
