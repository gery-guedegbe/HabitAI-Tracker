/**
 * Script pour initialiser la base de données
 * Usage: node scripts/init-db.js
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "postgres", // Se connecter à postgres pour créer la DB
  port: process.env.DB_PORT || 5432,
});

async function initDatabase() {
  try {
    const dbName = process.env.DB_NAME || "habitai_tracker_db";
    
    // Essayer de créer la base de données
    try {
      console.log("📦 Création de la base de données...");
      await pool.query(`CREATE DATABASE ${dbName}`);
      console.log("✅ Base de données créée");
    } catch (err) {
      if (err.code === "42P04") {
        // 42P04 = database already exists
        console.log("ℹ️  Base de données existe déjà");
      } else {
        throw err;
      }
    }

    // Se connecter à la base de données
    const dbPool = new Pool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: dbName,
      port: process.env.DB_PORT || 5432,
    });

    // Lire et exécuter le schéma SQL
    const schemaPath = path.join(__dirname, "../src/config/schema/schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    console.log("📝 Exécution du schéma SQL...");
    await dbPool.query(schema);

    console.log("✅ Base de données initialisée avec succès !");
    
    await dbPool.end();
    await pool.end();
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error);
    process.exit(1);
  }
}

initDatabase();

