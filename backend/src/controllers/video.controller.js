// Cloudinary-specific retrieval will be added here after credentials and the
// video public IDs / collection format are provided.
export function listVideos(_request, response) {
  response.status(503).json({
    error: 'Video catalog is not configured yet.',
    message: 'Add Cloudinary credentials and video public IDs before enabling this endpoint.',
  });
}

export function getVideo(_request, response) {
  response.status(503).json({
    error: 'Video catalog is not configured yet.',
    message: 'Add Cloudinary credentials and video public IDs before enabling this endpoint.',
  });
}
