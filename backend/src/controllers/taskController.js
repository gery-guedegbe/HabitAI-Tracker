const taskModel = require("../models/taskModel");
const journalModel = require("../models/journalModel");

/**
 * Créer une tâche manuellement
 */
async function createTask(req, res, next) {
  try {
    const { journal_id } = req.params;
    const userId = req.user.id;

    // Vérifier que le journal existe et appartient à l'utilisateur
    const journal = await journalModel.getJournalById(journal_id);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    if (journal.user_id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const task = await taskModel.createTask(journal_id, req.body);

    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
}

/**
 * Récupérer une tâche par ID
 */
async function getTask(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await taskModel.getTaskById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Vérifier l'accès via le journal
    const journal = await journalModel.getJournalById(task.journal_id);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    if (journal.user_id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ task });
  } catch (error) {
    next(error);
  }
}

/**
 * Mettre à jour une tâche
 */
async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await taskModel.getTaskById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Vérifier l'accès
    const journal = await journalModel.getJournalById(task.journal_id);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    if (journal.user_id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await taskModel.updateTask(id, req.body);

    res.json({ task: updated });
  } catch (error) {
    next(error);
  }
}

/**
 * Supprimer une tâche
 */
async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await taskModel.getTaskById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Vérifier l'accès
    const journal = await journalModel.getJournalById(task.journal_id);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    if (journal.user_id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await taskModel.deleteTask(id);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTask,
  getTask,
  updateTask,
  deleteTask,
};

