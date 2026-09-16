import 'dotenv/config';

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT) || 5000,
  allowedOrigins,
  publicApiUrl: process.env.PUBLIC_API_URL || 'https://shirishtisnetflix.onrender.com',
};
