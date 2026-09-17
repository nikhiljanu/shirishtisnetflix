const configuredApiUrl = import.meta.env.API_URL?.trim();

export const API_URL = configuredApiUrl ? configuredApiUrl.replace(/\/$/, '') : '';

export function apiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${normalizedPath}`;
}

export async function fetchPlaybackUrl(publicId) {
  const response = await fetch(apiUrl(`/api/videos/${encodeURIComponent(publicId)}/play`));
  if (!response.ok) throw new Error('Unable to load playback URL');
  const result = await response.json();
  return result.data;
}
