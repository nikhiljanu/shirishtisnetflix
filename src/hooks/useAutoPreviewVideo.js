import { useEffect } from 'react';

// Caps how long a muted background/preview <video> is allowed to stream, and
// pauses it whenever the tab is hidden. Without this, a looping autoplay
// preview left open for hours pulls video data from Cloudinary the entire
// time, even while backgrounded.
export function useAutoPreviewVideo(videoRef, sourceKey, { maxPlayMs = 15000 } = {}) {
  useEffect(() => {
    if (!sourceKey) return undefined;

    let capped = false;
    const capTimer = setTimeout(() => {
      capped = true;
      videoRef.current?.pause();
    }, maxPlayMs);

    const handleVisibilityChange = () => {
      const el = videoRef.current;
      if (!el) return;
      if (document.hidden) {
        el.pause();
      } else if (!capped) {
        el.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(capTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [videoRef, sourceKey, maxPlayMs]);
}
