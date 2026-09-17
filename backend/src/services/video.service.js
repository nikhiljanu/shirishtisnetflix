import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

function ensureConfigured() {
  if (!isCloudinaryConfigured) {
    const error = new Error('Cloudinary is not configured');
    error.statusCode = 503;
    throw error;
  }
}

const PLAYBACK_URL_TTL_SECONDS = 15 * 60;

// Delivery type of the underlying Cloudinary video resources. Must match how
// the assets are actually stored — see backend/scripts/migrate-to-authenticated.js.
// Keep this as 'upload' until that migration has been run against production,
// then switch to 'authenticated' or listing/lookup will 404.
const VIDEO_DELIVERY_TYPE = 'upload';

function toVideoResponse(resource) {
  return {
    publicId: resource.public_id,
    format: resource.format,
    resourceType: resource.resource_type,
    duration: resource.duration,
    width: resource.width,
    height: resource.height,
    bytes: resource.bytes,
    createdAt: resource.created_at,
    thumbnailUrl: cloudinary.url(resource.public_id, {
      resource_type: 'video',
      type: VIDEO_DELIVERY_TYPE,
      format: 'jpg',
      secure: true,
      transformation: [{ width: 640, crop: 'scale' }],
      sign_url: true
    }),
  };
}


export async function listCloudinaryVideos({ cursor, limit }) {
  ensureConfigured();
  const result = await cloudinary.api.resources({
    resource_type: 'video',
    type: VIDEO_DELIVERY_TYPE,
    max_results: limit,
    next_cursor: cursor || undefined,
  });

  return {
    data: result.resources.map(toVideoResponse),
    nextCursor: result.next_cursor || null,
  };
}

export async function getCloudinaryVideo(publicId) {
  ensureConfigured();
  const resource = await cloudinary.api.resource(publicId, {
    resource_type: 'video',
    type: VIDEO_DELIVERY_TYPE,
  });
  return toVideoResponse(resource);
}

// NOTE: expires_at is only enforced by Cloudinary's edge for 'authenticated'
// (or 'private') delivery types. While VIDEO_DELIVERY_TYPE is still 'upload',
// this URL is signed but NOT actually access-restricted or expiring.
export async function getSignedPlaybackUrl(publicId) {
  ensureConfigured();
  // Confirms the asset exists before signing so we return 404 instead of a
  // dead URL for a typo'd or deleted publicId.
  await cloudinary.api.resource(publicId, {
    resource_type: 'video',
    type: VIDEO_DELIVERY_TYPE,
  });

  const expiresAt = Math.floor(Date.now() / 1000) + PLAYBACK_URL_TTL_SECONDS;
  const secureUrl = cloudinary.url(publicId, {
    resource_type: 'video',
    type: VIDEO_DELIVERY_TYPE,
    quality: 'auto',
    fetch_format: 'auto',
    secure: true,
    sign_url: true,
    expires_at: expiresAt,
  });

  return { secureUrl, expiresAt };
}
