/**
 * Provider de transcription utilisant OpenAI Whisper API
 * Coût : $0.006/min (excellent rapport qualité/prix)
 * Qualité : La meilleure disponible
 * 
 * Note: Nécessite Node.js 18+ pour FormData natif
 */

const TranscriptionProvider = require("./base");

class OpenAIProvider extends TranscriptionProvider {
  constructor() {
    super();
    this.apiKey = process.env.OPENAI_API_KEY;
    this.apiUrl = "https://api.openai.com/v1/audio/transcriptions";
  }

  getName() {
    return "openai";
  }

  async isConfigured() {
    return !!this.apiKey;
  }

  async transcribe(audioBuffer, options = {}) {
    if (!this.apiKey) {
      throw new Error(
        "OPENAI_API_KEY is not configured. " +
        "Get your API key at https://platform.openai.com/api-keys"
      );
    }

    try {
      // Utiliser FormData natif (Node.js 18+)
      // Pour Node.js < 18, installer: npm install form-data
      const FormData = globalThis.FormData;
      
      if (!FormData) {
        throw new Error(
          "FormData is not available. Please use Node.js 18+ or install form-data package."
        );
      }
      
      const formData = new FormData();
      const blob = new Blob([audioBuffer], { type: "audio/webm" });
      formData.append("file", blob, "audio.webm");
      formData.append("model", "whisper-1");
      
      if (options.language) {
        formData.append("language", options.language);
      }

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const result = await response.json();
      return result.text.trim();
    } catch (error) {
      console.error("OpenAI Transcription Error:", error);
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    }
  }
}

module.exports = OpenAIProvider;

