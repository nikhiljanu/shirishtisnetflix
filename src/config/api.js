const configuredApiUrl = import.meta.env.API_URL?.trim();

export const API_URL = configuredApiUrl ? configuredApiUrl.replace(/\/$/, '') : '';

export function apiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${normalizedPath}`;
}
