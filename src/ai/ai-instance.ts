import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const googleApiKey = process.env.GOOGLE_GENAI_API_KEY;

if (!googleApiKey) {
  // This warning will appear in the server console when the application starts
  // or when this module is first loaded.
  console.warn(
    `\n\n=============================================================================================\n` +
    `⚠️  AI FEATURE WARNING: GOOGLE_GENAI_API_KEY is not set!\n` +
    `=============================================================================================\n` +
    `The GOOGLE_GENAI_API_KEY environment variable is missing. This key is required for AI\n` +
    `features relying on the Google AI plugin (like Gemini models) to function.\n\n` +
    `To resolve this:\n` +
    `1. Obtain an API key from Google AI Studio: https://aistudio.google.com/app/apikey\n` +
    `2. Create a file named '.env' in the root of your project (if it doesn't exist).\n` +
    `3. Add the following line to your .env file, replacing <Your API Key> with your actual key:\n` +
    `   GOOGLE_GENAI_API_KEY=<Your API Key>\n` +
    `4. Restart your development server for the changes to take effect.\n\n` +
    `Without this key, attempts to use AI features will result in an error from the Genkit plugin.\n` +
    `For more details, see: https://firebase.google.com/docs/genkit/plugins/google-genai\n` +
    `=============================================================================================\n\n`
  );
  // Note: We still proceed to initialize Genkit with the googleAI plugin.
  // The plugin itself will throw a more specific runtime error if an AI call is attempted
  // without a valid API key (which is the error the user is currently observing).
  // This console warning serves as an earlier, application-level heads-up.
}

export const ai = genkit({
  promptDir: './prompts', // Assuming this is the intended directory or it's not critical for this specific issue
  plugins: [
    googleAI({
      apiKey: googleApiKey, // Pass the (potentially undefined) API key to the plugin
    }),
  ],
  model: 'googleai/gemini-2.0-flash', // Default model for the AI instance
});
