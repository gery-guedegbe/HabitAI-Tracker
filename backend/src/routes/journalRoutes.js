/**
 * @swagger
 * tags:
 *   name: Journals
 *   description: Gestion des journaux quotidiens
 */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const journalController = require("../controllers/journalController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createJournalSchema,
  updateJournalSchema,
  validate,
} = require("../utils/validators");

// Configuration multer pour les fichiers audio
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    // Accepter seulement les fichiers audio
    console.log(`📁 Fichier reçu: ${file.originalname}, type: ${file.mimetype}`);
    
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      console.error(`❌ Type de fichier non autorisé: ${file.mimetype}`);
      cb(new Error(`Only audio files are allowed. Received: ${file.mimetype}`), false);
    }
  },
});

/**
 * @swagger
 * /api/journals:
 *   post:
 *     summary: Créer un nouveau journal avec extraction IA
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - raw_text
 *             properties:
 *               raw_text:
 *                 type: string
 *                 description: Texte libre décrivant la journée
 *               journal_date:
 *                 type: string
 *                 format: date
 *                 description: Date du journal (optionnel)
 *     responses:
 *       201:
 *         description: Journal créé avec tâches extraites
 *       400:
 *         description: Erreur de validation
 */
router.post(
  "/",
  authMiddleware,
  validate(createJournalSchema),
  journalController.createJournal
);

/**
 * @swagger
 * /api/journals/audio:
 *   post:
 *     summary: Créer un journal depuis un fichier audio
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - audio
 *             properties:
 *               audio:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Journal créé depuis audio
 *       400:
 *         description: Erreur de traitement audio
 */
router.post(
  "/audio",
  authMiddleware,
  upload.single("audio"),
  journalController.processAudioJournal
);

/**
 * @swagger
 * /api/journals:
 *   get:
 *     summary: Récupérer tous les journals de l'utilisateur
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des journals avec leurs tâches
 */
router.get("/", authMiddleware, journalController.getJournals);

/**
 * @swagger
 * /api/journals/{id}:
 *   get:
 *     summary: Récupérer un journal par ID
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Journal trouvé
 *       404:
 *         description: Journal introuvable
 */
router.get("/:id", authMiddleware, journalController.getJournal);

/**
 * @swagger
 * /api/journals/{id}:
 *   patch:
 *     summary: Mettre à jour un journal
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               raw_text:
 *                 type: string
 *               journal_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Journal mis à jour
 *       404:
 *         description: Journal introuvable
 */
router.patch(
  "/:id",
  authMiddleware,
  validate(updateJournalSchema),
  journalController.updateJournal
);

/**
 * @swagger
 * /api/journals/{id}:
 *   delete:
 *     summary: Supprimer un journal
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Journal supprimé
 *       404:
 *         description: Journal introuvable
 */
router.delete("/:id", authMiddleware, journalController.deleteJournal);

// Routes pour les tâches d'un journal
const taskController = require("../controllers/taskController");
const {
  createTaskSchema,
  validate: validateTask,
} = require("../utils/validators");

/**
 * @swagger
 * /api/journals/{journal_id}/tasks:
 *   post:
 *     summary: Créer une tâche pour un journal
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: journal_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               status:
 *                 type: string
 *               tags:
 *                 type: array
 *               duration_minutes:
 *                 type: integer
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tâche créée
 */
router.post(
  "/:journal_id/tasks",
  authMiddleware,
  validateTask(createTaskSchema),
  taskController.createTask
);

module.exports = router;

