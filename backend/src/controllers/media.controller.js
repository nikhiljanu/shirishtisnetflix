import https from 'https';
import { cloudinary } from '../config/cloudinary.js';

export const proxyMedia = (req, res, next) => {
  const { type, id, fmt } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing id parameter' });
  }

  let targetUrl;

  try {
    if (type === 'image') {
      targetUrl = cloudinary.url(id, {
        resource_type: 'video',
        format: 'jpg',
        secure: true,
        transformation: [{ width: 640, crop: 'scale' }],
      });
    } else if (type === 'video') {
      targetUrl = cloudinary.url(id, {
        resource_type: 'video',
        format: fmt || 'mp4',
        secure: true
      });
    } else {
      return res.status(400).json({ error: 'Invalid type parameter. Use video or image.' });
    }
  } catch (error) {
    return next(error);
  }

  const options = {
    headers: {}
  };

  // Forward range requests
  if (req.headers.range) {
    options.headers['Range'] = req.headers.range;
  }

  const proxyRequest = https.get(targetUrl, options, (proxyResponse) => {
    // Forward status code
    res.status(proxyResponse.statusCode);

    // Forward relevant headers
    const headersToForward = [
      'content-type',
      'content-length',
      'content-range',
      'accept-ranges',
      'cache-control',
      'etag',
      'last-modified'
    ];

    headersToForward.forEach(header => {
      if (proxyResponse.headers[header]) {
        res.setHeader(header, proxyResponse.headers[header]);
      }
    });

    if (proxyResponse.statusCode >= 400) {
      console.error(`Cloudinary returned status ${proxyResponse.statusCode} for ${targetUrl}`);
    }

    // Pipe stream
    proxyResponse.pipe(res);
  });

  proxyRequest.on('error', (error) => {
    console.error('Error proxying media:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to proxy media' });
    }
  });

  req.on('aborted', () => {
    proxyRequest.destroy();
  });
};
