import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

function ensureConfigured() {
  if (!isCloudinaryConfigured) {
    const error = new Error('Cloudinary is not configured');
    error.statusCode = 503;
    throw error;
  }
}

function toVideoResponse(resource, baseUrl) {
  return {
    publicId: resource.public_id,
    format: resource.format,
    resourceType: resource.resource_type,
    duration: resource.duration,
    width: resource.width,
    height: resource.height,
    bytes: resource.bytes,
    createdAt: resource.created_at,
    secureUrl: `${baseUrl}/api/media?type=video&id=${encodeURIComponent(resource.public_id)}&fmt=${resource.format}`,
    thumbnailUrl: `${baseUrl}/api/media?type=image&id=${encodeURIComponent(resource.public_id)}`,
  };
}


export async function listCloudinaryVideos({ cursor, limit, baseUrl }) {
  ensureConfigured();
  const result = await cloudinary.api.resources({
    resource_type: 'video',
    type: 'upload',
    max_results: limit,
    next_cursor: cursor || undefined,
  });

  return {
    data: result.resources.map(res => toVideoResponse(res, baseUrl)),
    nextCursor: result.next_cursor || null,
  };
}

export async function getCloudinaryVideo(publicId, baseUrl) {
  ensureConfigured();
  const resource = await cloudinary.api.resource(publicId, {
    resource_type: 'video',
    type: 'upload',
  });
  return toVideoResponse(resource, baseUrl);
}
