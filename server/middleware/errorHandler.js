/**
 * Global error-handling middleware.
 * Catches any unhandled errors thrown in route handlers and returns
 * a consistent JSON error response.
 */
export function errorHandler(err, _req, res, _next) {
  console.error("Unhandled error:", err);

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
}
