/**
 * Script de vérification de la configuration AssemblyAI
 * Usage: node scripts/verify-assemblyai.js
 */

require('dotenv').config();
const { createTranscriptionProvider } = require('../src/services/providers/transcription');

console.log('🔍 Vérification de la configuration AssemblyAI...\n');

try {
  // Vérifier les variables d'environnement
  const provider = process.env.TRANSCRIPTION_PROVIDER;
  const apiKey = process.env.ASSEMBLYAI_API_KEY;

  console.log('📋 Variables d\'environnement:');
  console.log(`   TRANSCRIPTION_PROVIDER: ${provider || '❌ NON DÉFINI'}`);
  console.log(`   ASSEMBLYAI_API_KEY: ${apiKey ? '✅ DÉFINI' : '❌ NON DÉFINI'}`);
  
  if (apiKey) {
    console.log(`   Longueur clé: ${apiKey.length} caractères`);
  }

  console.log('\n🔧 Test de création du provider...');

  if (provider !== 'assemblyai') {
    console.log('⚠️  ATTENTION: TRANSCRIPTION_PROVIDER n\'est pas "assemblyai"');
    console.log(`   Valeur actuelle: "${provider}"`);
    console.log('   Pour utiliser AssemblyAI, mettre: TRANSCRIPTION_PROVIDER=assemblyai\n');
  }

  const transcriptionProvider = createTranscriptionProvider();
  
  console.log(`✅ Provider créé avec succès: ${transcriptionProvider.getName()}`);
  console.log(`✅ Configuration valide !\n`);
  
  console.log('🎉 Tout est prêt ! Vous pouvez maintenant utiliser AssemblyAI pour la transcription.\n');

} catch (error) {
  console.error('❌ Erreur de configuration:\n');
  console.error(`   ${error.message}\n`);
  
  if (error.message.includes('not configured')) {
    console.log('💡 Solution:');
    console.log('   1. Créer un compte sur https://www.assemblyai.com');
    console.log('   2. Aller dans Account → API Key');
    console.log('   3. Copier la clé API');
    console.log('   4. Ajouter dans .env:');
    console.log('      TRANSCRIPTION_PROVIDER=assemblyai');
    console.log('      ASSEMBLYAI_API_KEY=votre_cle_ici\n');
  } else if (error.message.includes('Unknown transcription provider')) {
    console.log('💡 Solution:');
    console.log('   Ajouter dans .env: TRANSCRIPTION_PROVIDER=assemblyai\n');
  }
  
  process.exit(1);
}

