const journalModel = require("../models/journalModel");
const taskModel = require("../models/taskModel");
const { extractTasksFromText, transcribeAudio } = require("../services/aiService");

/**
 * Créer un nouveau journal avec extraction IA
 */
async function createJournal(req, res, next) {
  try {
    const { raw_text, journal_date } = req.body;
    const userId = req.user.id;

    // Extraction IA des tâches
    let aiOutput = null;
    let extractedTasks = [];
    let aiErrorOccurred = false;

    try {
      console.log("🤖 Début extraction IA...");
      aiOutput = await extractTasksFromText(raw_text);
      extractedTasks = aiOutput.tasks || [];
      console.log(`✅ Extraction IA réussie: ${extractedTasks.length} tâches extraites`);
    } catch (aiError) {
      aiErrorOccurred = true;
      console.error("❌ AI extraction failed:", aiError.message);
      // On continue même si l'IA échoue - l'utilisateur peut ajouter manuellement
      aiOutput = { 
        error: aiError.message, 
        tasks: [],
        warning: "L'extraction IA a échoué. Vous pouvez ajouter les tâches manuellement."
      };
    }

    // Créer le journal
    const journal = await journalModel.createJournal(
      userId,
      raw_text,
      aiOutput
    );
    console.log(`📝 Journal créé avec ID: ${journal.id}`);

    // Créer les tâches extraites
    const createdTasks = [];
    if (extractedTasks.length > 0) {
      console.log(`🔄 Création de ${extractedTasks.length} tâches...`);
      for (const taskData of extractedTasks) {
        try {
          // Validation basique avant création
          if (!taskData.title || taskData.title.trim().length === 0) {
            console.warn("⚠️ Tâche ignorée: titre manquant", taskData);
            continue;
          }

          const task = await taskModel.createTask(journal.id, {
            title: taskData.title.trim(),
            category: taskData.category || "autre",
            tags: taskData.tags || [],
            status: taskData.status || "done",
            duration_minutes: taskData.duration_minutes || null,
            confidence: taskData.confidence || null,
            note: taskData.note || null,
          });
          createdTasks.push(task);
          console.log(`✅ Tâche créée: ${task.title}`);
        } catch (taskError) {
          console.error("❌ Failed to create task:", taskError.message, taskData);
          // Continue avec les autres tâches
        }
      }
      console.log(`✅ ${createdTasks.length}/${extractedTasks.length} tâches créées avec succès`);
    } else {
      console.log("ℹ️ Aucune tâche à créer (extraction IA vide ou échouée)");
    }

    res.status(201).json({
      journal,
      tasks: createdTasks,
      ai_summary: aiOutput.summary || null,
      ai_error: aiErrorOccurred ? aiOutput.error : null,
      ai_warning: aiErrorOccurred ? aiOutput.warning : null,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Traiter un fichier audio (transcription + extraction)
 */
async function processAudioJournal(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Audio file required" });
    }

    const userId = req.user.id;

    // Transcription audio
    let transcribedText = "";
    try {
      console.log("🎤 Début transcription audio...");
      console.log(`📦 Fichier reçu: ${req.file.originalname}, taille: ${req.file.size} bytes, type: ${req.file.mimetype}`);
      
      transcribedText = await transcribeAudio(req.file.buffer, {
        language: "fr", // Détection automatique si non spécifié
      });
      
      console.log(`✅ Transcription réussie: ${transcribedText.length} caractères`);
    } catch (transcribeError) {
      console.error("❌ Erreur transcription:", transcribeError);
      return res.status(400).json({
        message: "Failed to transcribe audio",
        error: transcribeError.message,
        details: process.env.NODE_ENV === "development" ? transcribeError.stack : undefined,
      });
    }

    if (!transcribedText || transcribedText.trim().length === 0) {
      return res.status(400).json({ message: "No text extracted from audio" });
    }

    // Extraction IA
    let aiOutput = null;
    let extractedTasks = [];

    try {
      aiOutput = await extractTasksFromText(transcribedText);
      extractedTasks = aiOutput.tasks || [];
    } catch (aiError) {
      console.error("AI extraction failed:", aiError.message);
      aiOutput = { 
        error: aiError.message, 
        tasks: [],
        warning: "L'extraction IA a échoué. Vous pouvez ajouter les tâches manuellement."
      };
    }

    // Créer le journal avec le texte transcrit
    const journal = await journalModel.createJournal(
      userId,
      transcribedText,
      aiOutput
    );

    // Créer les tâches
    const createdTasks = [];
    for (const taskData of extractedTasks) {
      try {
        const task = await taskModel.createTask(journal.id, {
          title: taskData.title,
          category: taskData.category || "autre",
          tags: taskData.tags || [],
          status: taskData.status || "done",
          duration_minutes: taskData.duration_minutes || null,
          confidence: taskData.confidence || null,
          note: taskData.note || null,
        });
        createdTasks.push(task);
      } catch (taskError) {
        console.error("Failed to create task:", taskError);
      }
    }

    res.status(201).json({
      journal,
      tasks: createdTasks,
      transcribed_text: transcribedText,
      ai_summary: aiOutput.summary || null,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Récupérer tous les journals de l'utilisateur
 */
async function getJournals(req, res, next) {
  try {
    const userId = req.user.id;
    const journals = await journalModel.getJournalByUser(userId);

    // Pour chaque journal, récupérer les tâches
    const journalsWithTasks = await Promise.all(
      journals.map(async (journal) => {
        const tasks = await taskModel.getTasksByJournal(journal.id);
        return {
          ...journal,
          tasks,
        };
      })
    );

    res.json({ journals: journalsWithTasks });
  } catch (error) {
    next(error);
  }
}

/**
 * Récupérer un journal par ID
 */
async function getJournal(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const journal = await journalModel.getJournalById(id);

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    // Vérifier que le journal appartient à l'utilisateur
    if (journal.user_id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const tasks = await taskModel.getTasksByJournal(journal.id);

    res.json({
      journal: {
        ...journal,
        tasks,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Mettre à jour un journal
 */
async function updateJournal(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const journal = await journalModel.getJournalById(id);

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    if (journal.user_id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await journalModel.updateJournal(id, req.body);

    res.json({ journal: updated });
  } catch (error) {
    next(error);
  }
}

/**
 * Supprimer un journal
 */
async function deleteJournal(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const journal = await journalModel.getJournalById(id);

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    if (journal.user_id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await journalModel.deleteJournal(id);

    res.json({ message: "Journal deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createJournal,
  processAudioJournal,
  getJournals,
  getJournal,
  updateJournal,
  deleteJournal,
};

