// middlewares/errorHandler.js

export const errorHandler = (err, req, res, next) => {
  console.error("Erreur capturée :", err);

  // Valeurs par défaut
  let status = err.status || 500;
  let errorType = err.name || "InternalServerError";
  let message = err.message || "Une erreur interne est survenue.";
  let details = err.details || null;

  // =============================
  // 🔹 1. Erreurs de validation Mongoose
  // =============================
  if (err.name === "ValidationError") {
    status = 400;
    errorType = "Bad Request";

    const validationErrors = Object.keys(err.errors).map((field) => ({
      field,
      message: err.errors[field].message,
      code: "VALIDATION_ERROR",
    }));

    details = validationErrors;
    message = "Erreur de validation sur un ou plusieurs champs.";
  }

  // =============================
  // 🔹 2. ObjectId invalide (CastError)
  // =============================
  else if (err.name === "CastError") {
    status = 400;
    errorType = "Bad Request";
    message = `L'identifiant '${err.value}' est invalide pour le champ '${err.path}'.`;
    details = {
      field: err.path,
      value: err.value,
      code: "INVALID_OBJECT_ID",
    };
  }

  // =============================
  // 🔹 4. Erreurs JWT (authentification)
  // =============================
  else if (err.name === "JsonWebTokenError") {
    status = 401;
    errorType = "Unauthorized";
    message = "Token d'authentification invalide.";
    details = { code: "INVALID_TOKEN" };
  }

  else if (err.name === "TokenExpiredError") {
    status = 401;
    errorType = "Unauthorized";
    message = "Le token d'authentification a expiré.";
    details = { code: "TOKEN_EXPIRED" };
  }

  // =============================
  // 🔹 5. Erreurs de validation JSON / Body parser
  // =============================
  else if (err.type === "entity.parse.failed") {
    status = 400;
    errorType = "Bad Request";
    message = "Le corps de la requête contient un JSON invalide.";
    details = { code: "INVALID_JSON" };
  }

  // =============================
  // 🔹 6. Erreurs de requête HTTP (Express)
  // =============================
  else if (err.status === 404) {
    errorType = "Not Found";
    message = err.message || "Ressource non trouvée.";
  }

  else if (err.status === 405) {
    errorType = "Method Not Allowed";
    message = "La méthode HTTP utilisée n’est pas autorisée pour cette ressource.";
  }

  // =============================
  // 🔹 7. Erreurs réseau / MongoDB
  // =============================
  else if (err.name === "MongoNetworkError") {
    status = 503;
    errorType = "Service Unavailable";
    message = "Connexion à la base de données échouée.";
    details = { code: "DATABASE_CONNECTION_ERROR" };
  }

  else if (err.name === "MongoServerError") {
    status = 500;
    errorType = "Database Error";
    message = "Une erreur est survenue dans MongoDB.";
  }


  // =============================
  // 🔹 9. Erreurs génériques (fallback)
  // =============================
  else {
    status = status || 500;
    errorType = "Internal Server Error";
    message = message || "Une erreur inconnue est survenue.";
  }

  // =============================
  // 🔹 Réponse JSON standardisée
  // =============================
  res.status(status).json({
    success: false,
    status,
    error: errorType,
    message,
    details,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};
