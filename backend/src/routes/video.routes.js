import { Router } from 'express';
import { getVideo, getVideoPlaybackUrl, listVideos } from '../controllers/video.controller.js';

export const videoRouter = Router();

videoRouter.get('/', listVideos);
videoRouter.get('/:videoId/play', getVideoPlaybackUrl);
videoRouter.get('/:videoId', getVideo);
