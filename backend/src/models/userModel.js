/**
 * src/models/userModel.js
 *
 * Fonctions basiques d'accès à la table "users".
 * Utilise des requêtes paramétrées (prévention injections).
 *
 * Remarque : la validation (format email, mot de passe fort...) doit être faite
 * avant d'appeler ces fonctions (controller / service).
 */

const pool = require("../config/db/db");
const { v4: uuidv4 } = require("uuid");

/**
 * Create user
 */
async function createUser({ username, email, passwordHash }) {
  const userId = uuidv4();

  const sql = `
    INSERT INTO users (id, username, email, password_hash)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, email, role, is_active, created_at, updated_at
  `;

  const values = [userId, username, email, passwordHash];

  const { rows } = await pool.query(sql, values);
  return rows[0];
}

/**
 * Find by email
 */
async function findUserByEmail(email) {
  const sql = `
    SELECT *
    FROM users
    WHERE email = $1
  `;
  const { rows } = await pool.query(sql, [email]);
  return rows[0] || null;
}

/**
 * Find user by id
 */
async function findUserById(id) {
  const sql = `
    SELECT id, username, email, role, is_active, created_at, updated_at, last_login
    FROM users
    WHERE id = $1
  `;
  const { rows } = await pool.query(sql, [id]);
  return rows[0] || null;
}

/**
 * Update user
 */
async function updateUser(id, fields = {}) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return findUserById(id);

  const setClauses = keys.map((k, i) => `"${k}" = $${i + 1}`);
  const values = keys.map((k) => fields[k]);

  setClauses.push(`updated_at = NOW()`);

  const sql = `
    UPDATE users
    SET ${setClauses.join(", ")}
    WHERE id = $${values.length + 1}
    RETURNING id, username, email, role, is_active, created_at, updated_at, last_login
  `;

  values.push(id);

  const { rows } = await pool.query(sql, values);
  return rows[0] || null;
}

/**
 * Update user password
 */
async function updatePassword(id, hashedPassword) {
  const query = `
    UPDATE users
    SET password_hash = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, email;
  `;

  const result = await pool.query(query, [hashedPassword, id]);

  return result.rows[0];
}

async function saveResetToken(id, token, expires) {
  const query = `
    UPDATE users
    SET reset_token = $1,
        reset_token_expires = $2
    WHERE id = $3
    RETURNING id;
  `;
  const result = await pool.query(query, [token, expires, id]);
  return result.rows[0];
}

async function findUserByResetToken(tokenHash) {
  const query = `
    SELECT * FROM users
    WHERE reset_token = $1
  `;
  const result = await pool.query(query, [tokenHash]);
  return result.rows[0] || null;
}

async function resetPassword(id, hashedPassword) {
  const query = `
    UPDATE users
    SET password_hash = $1,
        reset_token = NULL,
        reset_token_expires = NULL,
        updated_at = NOW()
    WHERE id = $2
    RETURNING id;
  `;
  const result = await pool.query(query, [hashedPassword, id]);
  return result.rows[0];
}

/**
 * List users
 */
async function findUsers({ limit = 50, offset = 0 }) {
  const sql = `
    SELECT id, username, email, role, is_active, created_at, updated_at, last_login
    FROM users
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;
  const { rows } = await pool.query(sql, [limit, offset]);
  return rows;
}

/**
 * Delete user
 */
async function deleteUser(id) {
  const sql = `DELETE FROM users WHERE id = $1`;
  await pool.query(sql, [id]);
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findUsers,
  updateUser,
  updatePassword,
  deleteUser,
};
