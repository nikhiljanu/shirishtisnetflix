import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

function ensureConfigured() {
  if (!isCloudinaryConfigured) {
    const error = new Error('Cloudinary is not configured');
    error.statusCode = 503;
    throw error;
  }
}

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
    secureUrl: cloudinary.url(resource.public_id, {
      resource_type: 'video',
      type: 'upload',
      quality: 'auto',
      fetch_format: 'auto',
      secure: true,
      sign_url: true
    }),
    thumbnailUrl: cloudinary.url(resource.public_id, {
      resource_type: 'video',
      type: 'upload',
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
    type: 'upload',
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
    type: 'upload',
  });
  return toVideoResponse(resource);
}
