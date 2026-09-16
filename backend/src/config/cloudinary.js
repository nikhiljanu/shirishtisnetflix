import { v2 as cloudinary } from 'cloudinary';

function credentialsFromUrl(value) {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== 'cloudinary:' || !url.hostname || !url.username || !url.password) return null;
    return {
      cloud_name: url.hostname,
      api_key: decodeURIComponent(url.username),
      api_secret: decodeURIComponent(url.password),
    };
  } catch {
    return null;
  }
}

const credentials = credentialsFromUrl(process.env.CLOUDINARY_URL);

if (credentials) {
  cloudinary.config({ ...credentials, secure: true });
}

export const isCloudinaryConfigured = Boolean(credentials);
export { cloudinary };
