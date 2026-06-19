/**
 * Error Handling Middleware
 */

const errorHandler = (
  err,
  req,
  res,
  next
) => {
  console.error(err);

  let statusCode =
    res.statusCode === 200
      ? 500
      : res.statusCode;

  let message = err.message;

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    message =
      "Duplicate field value entered";
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(
      err.errors
    )
      .map((val) => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack:
      process.env.NODE_ENV ===
      "production"
        ? null
        : err.stack,
  });
};

/**
 * Not Found Middleware
 */

const notFound = (
  req,
  res,
  next
) => {
  const error = new Error(
    `Not Found - ${req.originalUrl}`
  );

  res.status(404);

  next(error);
};

module.exports = {
  errorHandler,
  notFound,
};