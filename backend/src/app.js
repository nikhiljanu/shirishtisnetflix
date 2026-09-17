import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { healthRouter } from './routes/health.routes.js';
import { mediaRouter } from './routes/media.routes.js';
import { videoRouter } from './routes/video.routes.js';

export const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  },
}));
app.use(express.json());
app.use(morgan(env.isProduction ? 'combined' : 'dev'));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
}));

app.use('/api/health', healthRouter);
app.use('/api/media', mediaRouter);
app.use('/api/videos', videoRouter);

app.use(notFoundHandler);
app.use(errorHandler);
