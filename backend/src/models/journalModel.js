/**
 * src/models/journalModel.js
 *
 * Accès à la table "journals".
 * Chaque fonction doit être simple, testable, prévisible.
 */

const pool = require("../config/db/db");

/**
 * Create a new journal entry for a user
 * @param {number} userId
 * @param {string} rawText - text brut fourni par l'utilisateur
 * @param {object|null} aiOutput - resultat AI (JSON)
 */
async function createJournal(userId, rawText, aiOutput = null) {
  const sql = `INSERT INTO journals (user_id, raw_text, ai_output) VALUES ($1, $2, $3) RETURNING id, user_id, journal_date, raw_text, ai_output, created_at, updated_at`;
  const values = [userId, rawText, aiOutput ? JSON.stringify(aiOutput) : null];
  const { rows } = await pool.query(sql, values);
  return rows[0];
}

/**
 * Get a journal by its ID
 */
async function getJournalById(id) {
  const sql = `SELECT id, user_id, journal_date, raw_text, ai_output, created_at, updated_at FROM journals WHERE id = $1`;
  const { rows } = await pool.query(sql, [id]);
  return rows[0] || null;
}

/**
 * Get all journal for a given user, sorted by newest first
 */
async function getJournalByUser(userId) {
  const sql = `SELECT id, user_id, journal_date, raw_text, ai_output, created_at, updated_at FROM journals WHERE user_id = $1 ORDER BY created_at DESC`;
  const { rows } = await pool.query(sql, [userId]);
  return rows;
}

/**
 * Update fields of a journal (partial update)
 */
async function updateJournal(id, fields = {}) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return getJournalById(id);

  const setClauses = keys.map((key, i) => `"${key}" = $${i + 1}`);
  const values = keys.map((key) => fields[key]);

  setClauses.push(`updated_at = NOW()`);
  
  const sql = `
    UPDATE journals
    SET ${setClauses.join(", ")}
    WHERE id = $${values.length + 1}
    RETURNING id, user_id, journal_date, raw_text, ai_output, created_at, updated_at
  `;

  values.push(id);

  const { rows } = await pool.query(sql, values);
  return rows[0] || null;
}

/**
 * Delete a journal (and its tasks due to ON DELETE CASCADE)
 */
async function deleteJournal(id) {
  await pool.query(`DELETE FROM journals WHERE id = $1`, [id]);
}

module.exports = {
  createJournal,
  getJournalById,
  getJournalByUser,
  updateJournal,
  deleteJournal,
};
