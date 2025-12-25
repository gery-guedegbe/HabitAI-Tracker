/**
 * Provider de transcription utilisant AssemblyAI
 * Gratuit : 5h/mois, puis $0.00025/min
 * Qualité excellente, pas de limite de durée
 */

const TranscriptionProvider = require("./base");

class AssemblyAIProvider extends TranscriptionProvider {
  constructor() {
    super();
    this.apiKey = process.env.ASSEMBLYAI_API_KEY;
    this.apiUrl = "https://api.assemblyai.com/v2/transcript";
  }

  getName() {
    return "assemblyai";
  }

  async isConfigured() {
    return !!this.apiKey;
  }

  async transcribe(audioBuffer, options = {}) {
    if (!this.apiKey) {
      throw new Error(
        "ASSEMBLYAI_API_KEY is not configured. " +
          "Get your free API key at https://www.assemblyai.com/app/account"
      );
    }

    try {
      // Étape 1 : Upload du fichier audio
      const uploadResponse = await fetch(
        "https://api.assemblyai.com/v2/upload",
        {
          method: "POST",
          headers: {
            authorization: this.apiKey,
          },
          body: audioBuffer,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload audio: ${uploadResponse.statusText}`);
      }

      const { upload_url } = await uploadResponse.json();

      // Étape 2 : Démarrer la transcription
      const transcriptResponse = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          authorization: this.apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          audio_url: upload_url,
          language_code: options.language || "fr", // fr ou en
        }),
      });

      if (!transcriptResponse.ok) {
        throw new Error(
          `Failed to start transcription: ${transcriptResponse.statusText}`
        );
      }

      const { id } = await transcriptResponse.json();

      // Étape 3 : Polling pour récupérer le résultat
      let transcript = null;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max

      while (!transcript && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Attendre 2s

        const statusResponse = await fetch(`${this.apiUrl}/${id}`, {
          headers: {
            authorization: this.apiKey,
          },
        });

        const statusData = await statusResponse.json();

        if (statusData.status === "completed") {
          transcript = statusData.text;
          break;
        } else if (statusData.status === "error") {
          throw new Error(`Transcription failed: ${statusData.error}`);
        }

        attempts++;
      }

      if (!transcript) {
        throw new Error("Transcription timeout");
      }

      return transcript.trim();
    } catch (error) {
      console.error("AssemblyAI Transcription Error:", error);
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    }
  }
}

module.exports = AssemblyAIProvider;
