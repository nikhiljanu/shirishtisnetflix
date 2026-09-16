import { useEffect } from 'react';
import { X } from 'lucide-react';
import '../styles/catalog.css';

export default function VideoPlayer({ video, title, onClose }) {
  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return (
    <section className="cloud-player" role="dialog" aria-modal="true" aria-label={title}>
      <div className="cloud-player-bar">
        <h2>{title}</h2>
        <button onClick={onClose} aria-label="Close player"><X size={22} /></button>
      </div>
      <video src={video.secureUrl} poster={video.thumbnailUrl} controls autoPlay playsInline className="cloud-player-video" />
    </section>
  );
}
