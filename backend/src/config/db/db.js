require("dotenv").config();
const { Pool } = require("pg");

const { DB_HOST, DB_PORT, DB_PASSWORD, DB_NAME, DB_USER } = process.env;

const pool = new Pool({
  host: DB_HOST || "localhost",
  user: DB_USER || "postgres",
  password: DB_PASSWORD || "postgres",
  database: DB_NAME || "habitai_tracker_db",
  port: DB_PORT || 5432,
});

// Test de connexion (lazy - ne bloque pas le démarrage)
pool
  .connect()
  .then((client) => {
    console.log("✅ PostgreSQL connected");
    client.release();
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err.message);
    console.error("💡 Vérifiez vos variables d'environnement DB_* dans .env");
  });

module.exports = pool;
