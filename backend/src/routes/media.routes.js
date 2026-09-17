import express from 'express';
import { proxyMedia } from '../controllers/media.controller.js';

export const mediaRouter = express.Router();

mediaRouter.get('/', proxyMedia);
