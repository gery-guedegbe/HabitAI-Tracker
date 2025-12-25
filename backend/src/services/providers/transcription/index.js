/**
 * Factory pour créer le provider de transcription approprié
 * Basé sur la variable d'environnement TRANSCRIPTION_PROVIDER
 */

const AssemblyAIProvider = require("./assemblyai");
const OpenAIProvider = require("./openai");

const PROVIDERS = {
  assemblyai: AssemblyAIProvider,
  openai: OpenAIProvider,
};

/**
 * Crée et retourne le provider de transcription configuré
 * @returns {TranscriptionProvider}
 */
function createTranscriptionProvider() {
  const providerName = (process.env.TRANSCRIPTION_PROVIDER || "assemblyai").toLowerCase();

  const ProviderClass = PROVIDERS[providerName];

  if (!ProviderClass) {
    throw new Error(
      `Unknown transcription provider: ${providerName}. ` +
      `Available providers: ${Object.keys(PROVIDERS).join(", ")}`
    );
  }

  const provider = new ProviderClass();

  if (!provider.isConfigured()) {
    throw new Error(
      `${providerName} provider is not configured. ` +
      `Please set the required API key in your .env file.`
    );
  }

  return provider;
}

module.exports = {
  createTranscriptionProvider,
  PROVIDERS,
};

