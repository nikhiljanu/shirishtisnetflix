export function notFoundHandler(request, response) {
  response.status(404).json({ error: `Route not found: ${request.method} ${request.originalUrl}` });
}

export function errorHandler(error, _request, response, _next) {
  console.error(error);
  if (error.message === 'Origin is not allowed by CORS') {
    return response.status(403).json({ error: 'Origin is not allowed' });
  }
  response.status(500).json({ error: 'Internal server error' });
}
