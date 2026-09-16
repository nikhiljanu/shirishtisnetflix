import { Router } from 'express';
import { getVideo, listVideos } from '../controllers/video.controller.js';

export const videoRouter = Router();

videoRouter.get('/', listVideos);
videoRouter.get('/:videoId', getVideo);
