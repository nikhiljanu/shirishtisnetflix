import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import '../styles/rows.css';

export default function ContentRow({
  category,
  onPlay,
  onOpenModal,
  myList = [],
  onToggleMyList
}) {
  const rowSliderRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  if (!category || !category.items || category.items.length === 0) return null;

  const handleScroll = (direction) => {
    if (!rowSliderRef.current) return;
    const { clientWidth } = rowSliderRef.current;
    const scrollAmount = clientWidth * 0.8;
    const newPos = direction === 'left' 
      ? Math.max(0, rowSliderRef.current.scrollLeft - scrollAmount)
      : rowSliderRef.current.scrollLeft + scrollAmount;

    rowSliderRef.current.scrollTo({
      left: newPos,
      behavior: 'smooth'
    });

    setTimeout(() => {
      if (rowSliderRef.current) {
        setScrollPosition(rowSliderRef.current.scrollLeft);
        setShowLeftArrow(rowSliderRef.current.scrollLeft > 20);
      }
    }, 350);
  };

  return (
    <div className="netflix-row-section">
      {/* Row Header with Title and Pagination dashes */}
      <div className="row-header">
        <h2 className="row-title">{category.title}</h2>
        
        <div className="row-pagination-indicators">
          <span className="pagination-dash active" />
          <span className="pagination-dash" />
          <span className="pagination-dash" />
        </div>
      </div>

      {/* Row Carousel Area */}
      <div className="row-slider-container">
        {showLeftArrow && (
          <button 
            className="slider-arrow left-arrow"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft size={34} />
          </button>
        )}

        <div 
          ref={rowSliderRef} 
          className="row-slider"
          onScroll={() => {
            if (rowSliderRef.current) {
              setShowLeftArrow(rowSliderRef.current.scrollLeft > 20);
            }
          }}
        >
          {category.items.map((movie, index) => (
            <MovieCard
              key={movie.id || index}
              movie={movie}
              isContinueWatching={category.isContinueWatching}
              isTop10={category.isTop10}
              rank={category.isTop10 ? movie.rank || index + 1 : null}
              onPlay={onPlay}
              onOpenModal={onOpenModal}
              isInMyList={myList.some(m => m.id === movie.id)}
              onToggleMyList={onToggleMyList}
            />
          ))}
        </div>

        <button 
          className="slider-arrow right-arrow"
          onClick={() => handleScroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight size={34} />
        </button>
      </div>
    </div>
  );
}
