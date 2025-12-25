/**
 * Service AI pour extraction de tâches depuis texte
 * Utilise Groq API (gratuit, rapide, basé sur Llama 3.3 70B)
 * Alternative: OpenAI Whisper pour transcription audio
 */

const Groq = require("groq-sdk");

// Initialisation lazy de Groq (seulement si API key présente)
let groq = null;

function getGroqClient() {
  if (!groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GROQ_API_KEY is not configured. Please set it in your .env file. " +
        "Get your free API key at https://console.groq.com"
      );
    }
    groq = new Groq({
      apiKey: apiKey,
    });
  }
  return groq;
}

/**
 * Extrait les tâches depuis un texte libre
 * @param {string} text - Texte libre de l'utilisateur
 * @returns {Promise<Object>} - JSON structuré avec les tâches
 */
async function extractTasksFromText(text) {
  if (!text || text.trim().length === 0) {
    throw new Error("Text is required");
  }

  const systemPrompt = `Tu es un assistant qui extrait des tâches et habitudes depuis un texte libre décrivant une journée.
Analyse le texte et retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "tasks": [
    {
      "title": "Titre de la tâche",
      "category": "sport|travail|santé|apprentissage|social|loisir|autre",
      "tags": ["tag1", "tag2"],
      "status": "done|in_progress|todo",
      "duration_minutes": 30,
      "confidence": 0.9,
      "note": "Note optionnelle"
    }
  ],
  "summary": "Résumé court de la journée",
  "date": "YYYY-MM-DD" (si mentionné, sinon null)
}

Règles:
- Extrait TOUTES les activités mentionnées
- Catégorise intelligemment (sport, travail, santé, etc.)
- Si une durée est mentionnée, l'inclure
- Status: "done" si c'est fait, "in_progress" si en cours, "todo" si prévu
- Confidence: 0.0 à 1.0 selon la certitude
- Retourne UNIQUEMENT le JSON, sans markdown, sans explication`;

  try {
    const groqClient = getGroqClient();
    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: text,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse JSON
    const parsed = JSON.parse(content);
    
    // Validation basique
    if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
      throw new Error("Invalid AI response format");
    }

    return parsed;
  } catch (error) {
    console.error("AI Service Error:", error.message);
    
    // Messages d'erreur plus clairs
    if (error.message.includes("GROQ_API_KEY") || error.message.includes("API key") || error.message.includes("authentication")) {
      throw new Error(
        "GROQ_API_KEY n'est pas configurée. " +
        "Obtenez une clé gratuite sur https://console.groq.com et ajoutez-la dans votre .env"
      );
    }
    
    throw new Error(`Échec de l'extraction IA: ${error.message}`);
  }
}

/**
 * Transcription audio vers texte
 * Utilise le provider configuré dans TRANSCRIPTION_PROVIDER
 * 
 * Providers disponibles:
 * - assemblyai: Gratuit (5h/mois), puis $0.00025/min (recommandé)
 * - openai: $0.006/min, meilleure qualité
 * 
 * Configuration dans .env:
 * TRANSCRIPTION_PROVIDER=assemblyai
 * ASSEMBLYAI_API_KEY=your_key_here
 */
async function transcribeAudio(audioBuffer, options = {}) {
  if (!audioBuffer || audioBuffer.length === 0) {
    throw new Error("Audio buffer is required");
  }

  console.log(`📊 Taille du buffer audio: ${audioBuffer.length} bytes`);

  try {
    const { createTranscriptionProvider } = require("./providers/transcription");
    
    let provider;
    try {
      provider = createTranscriptionProvider();
      console.log(`✅ Provider créé: ${provider.getName()}`);
    } catch (providerError) {
      console.error("❌ Erreur création provider:", providerError.message);
      throw new Error(
        `Transcription provider error: ${providerError.message}. ` +
        `Please check your .env configuration. See SETUP_TRANSCRIPTION.md for instructions.`
      );
    }
    
    console.log(`🎤 Début transcription avec ${provider.getName()}...`);
    const transcribedText = await provider.transcribe(audioBuffer, options);
    
    if (!transcribedText || transcribedText.trim().length === 0) {
      throw new Error("Transcription returned empty text");
    }
    
    console.log(`✅ Transcription réussie: ${transcribedText.length} caractères`);
    console.log(`📝 Aperçu: ${transcribedText.substring(0, 100)}...`);
    
    return transcribedText;
  } catch (error) {
    console.error("❌ Transcription Error:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    
    // Messages d'erreur plus clairs selon le provider
    if (error.message.includes("not configured") || error.message.includes("API key")) {
      throw new Error(
        `Transcription provider not configured. ` +
        `Please set TRANSCRIPTION_PROVIDER and the corresponding API key in your .env file. ` +
        `Current provider: ${process.env.TRANSCRIPTION_PROVIDER || "not set"}. ` +
        `See SETUP_TRANSCRIPTION.md for setup instructions.`
      );
    }
    
    throw error;
  }
}

module.exports = {
  extractTasksFromText,
  transcribeAudio,
};

