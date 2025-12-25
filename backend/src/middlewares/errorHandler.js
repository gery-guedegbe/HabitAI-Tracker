/**
 * Middleware de gestion centralisée des erreurs
 * Doit être placé en dernier dans la chaîne de middlewares
 */

function errorHandler(err, req, res, next) {
  // Log l'erreur pour le debugging
  console.error("Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Erreur de validation Joi
  if (err.isJoi) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    });
  }

  // Erreur JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Token expired",
    });
  }

  // Erreur PostgreSQL
  if (err.code === "23505") {
    // Unique violation
    return res.status(409).json({
      message: "Duplicate entry",
      field: err.constraint,
    });
  }

  if (err.code === "23503") {
    // Foreign key violation
    return res.status(400).json({
      message: "Invalid reference",
    });
  }

  // Erreur avec status défini (depuis les services)
  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  // Erreur par défaut
  res.status(500).json({
    message: process.env.NODE_ENV === "production" 
      ? "Internal server error" 
      : err.message,
  });
}

module.exports = errorHandler;

