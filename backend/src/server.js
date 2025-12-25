/**
 * Point d'entrée principal du serveur
 * ===================================
 * Responsabilités :
 * - Charger la configuration (.env)
 * - Initialiser Express
 * - Appliquer les middlewares de sécurité
 * - Démarrer le serveur sur le port configuré
 */

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet"); // Headers HTTP sécurisés (XSS, clickjacking)
const cors = require("cors");
const rateLimit = require("express-rate-limit"); // Protection brute-force
const swaggerDocs = require("./config/swagger/swagger");

// ============= CONFIGURATION ENVIRONNEMENT =============
// Charge les variables depuis .env AVANT toute autre initialization.
// Raison : Les imports suivants peuvent avoir besoin de process.env
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const journalRoutes = require("./routes/journalRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// ============= SÉCURITÉ HEADERS HTTP =============
// Helmet ajoute des headers de sécurité standardisés (OWASP).
// Détails :
//   - Désactive X-Powered-By (masque qu'on utilise Express)
//   - Ajoute Content-Security-Policy (bloque XSS inline)
//   - Ajoute X-Frame-Options (empêche clickjacking)
app.use(helmet());

// ============= RATE LIMITING =============
// Protège contre brute-force et DDoS.
// Logique :
//   - windowMs: Fenêtre de temps (15 min)
//   - max: Max requêtes par IP dans la fenêtre (100)
// Exemple : Si quelqu'un fait 200 requêtes en 15 min, il se prend un 429 Too Many Requests
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.use(limiter);

// ============= LOGGING =============
// Morgan pour logger les requêtes HTTP (dev seulement)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ============= CORS (CROSS-ORIGIN) =============
// Restreint les requêtes à UNIQUEMENT le frontend.
// Problème résolu : Empêche les attaques CSRF
// Configs :
//   - origin: Accepte requêtes que du frontend (pas de *)
//   - credentials: true → Envoie cookies/auth avec requête
//   - methods: Accepte uniquement GET, POST, PUT, DELETE (pas PATCH, HEAD...)
//   - allowedHeaders: Frontend peut envoyer Content-Type et Authorization uniquement
let frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

// S'assurer que l'URL est valide (pas juste le port)
if (!frontendUrl.startsWith("http")) {
  console.warn(`⚠️  FRONTEND_URL invalide: "${frontendUrl}". Utilisation de http://localhost:3000`);
  frontendUrl = "http://localhost:3000";
}

console.log(`🌐 CORS configuré pour: ${frontendUrl}`);

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ============= PARSING JSON & URLENCODED =============
// Parse les bodies des requêtes.
// Limite : '1mb' pour permettre les journaux avec beaucoup de texte
// Les réponses IA peuvent être volumineuses
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

swaggerDocs(app);

// ============= ROUTES =============
/**
 * Route de santé : /api/health
 * Permet à un monitoring (Datadog, New Relic) de vérifier que le serveur est actif.
 * Cas réel : Un load balancer appelle /health toutes les 10 sec.
 * Si ça répond pas 200, il retire le serveur du pool.
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Routes d'authentification
app.use("/api/auth", authRoutes);

// Routes pour la gestion des users
app.use("/api/users", userRoutes);

// Routes de journal
app.use("/api/journals", journalRoutes);

// Routes de tâches
app.use("/api/tasks", taskRoutes);

// Routes dashboard
app.use("/api/dashboard", dashboardRoutes);

// Middleware de gestion des erreurs
app.use(errorHandler);

// ============= GESTION DES ROUTES INVALIDES =============
// Middleware pour les 404 (routes qui n'existent pas).
// IMPORTANT : Doit être EN DERNIER pour catch les routes non-matchées.
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// ============= DÉMARRAGE DU SERVEUR =============
// Récupère le port depuis .env, default 5000 pour développement local.
// Raison du default : Un dev peut lancer sans .env et ça marche quand même
const PORT = process.env.PORT || 5000;

// Lance le serveur et affiche un message clair.
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});
