/**
 * Request-logging middleware.
 * Logs method, URL, status code, and response time for every request.
 */
export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}]  ${req.method}  ${req.originalUrl}  → ${res.statusCode}  (${duration}ms)`
    );
  });

  next();
}
