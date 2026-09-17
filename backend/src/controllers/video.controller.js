import { getCloudinaryVideo, listCloudinaryVideos } from '../services/video.service.js';

export async function listVideos(request, response, next) {
  try {
    const limit = Math.min(Math.max(Number(request.query.limit) || 25, 1), 100);
    const result = await listCloudinaryVideos({ cursor: request.query.cursor, limit });
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getVideo(request, response, next) {
  try {
    const video = await getCloudinaryVideo(request.params.videoId);
    response.status(200).json({ data: video });
  } catch (error) {
    if (error.http_code === 404) {
      return response.status(404).json({ error: 'Video not found' });
    }
    next(error);
  }
}
