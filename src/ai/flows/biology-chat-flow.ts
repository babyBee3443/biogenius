
'use server';
/**
 * @fileOverview AI flow for direct biology chat.
 * This flow allows users to ask biology-related questions and receive answers
 * from an AI acting as an expert biology educator.
 * Accuracy and cautiousness are prioritized.
 *
 * - biologyChat - A function that handles the biology chat interaction.
 * - BiologyChatInput - The input type for the function.
 * - BiologyChatOutput - The return type for the function.
 */

import {ai} from '@/ai/ai-instance';
import {z}  from 'genkit';

// --- Chat Message Schema for History ---
const ChatMessageSchema = z.object({
    role: z.enum(['user', 'assistant', 'system_error']), // Added system_error for internal handling
    content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;


// --- Input Schema ---
// For the AI prompt, we will filter out system_error messages from history.
const AiChatMessageSchema = z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
});
const BiologyChatInputSchema = z.object({
  query: z.string().describe('The user\'s biology-related question or statement.'),
  history: z.array(AiChatMessageSchema).optional().describe('Previous messages in the conversation for context. Exclude system error messages.'),
});
export type BiologyChatInput = z.infer<typeof BiologyChatInputSchema>;


// --- Output Schema ---
const BiologyChatOutputSchema = z.object({
  answer: z.string().describe("AI's answer to the user's query."),
});
export type BiologyChatOutput = z.infer<typeof BiologyChatOutputSchema>;


// --- Genkit Prompt Definition ---
const biologyChatPrompt = ai.definePrompt({
  name: 'biologyChatPrompt',
  input: { schema: BiologyChatInputSchema },
  output: { schema: BiologyChatOutputSchema },
  prompt: `
    You are an **expert biology educator and a highly knowledgeable biology assistant.**
    Your primary goal is to provide **accurate, scientifically sound, and helpful** answers to biology-related questions.
    **Accuracy is paramount.** If you are unsure about a specific piece of information, if there isn't a clear scientific consensus, or if the user's request is outside the scope of biology, you **must clearly state that** instead of providing potentially incorrect or misleading information. **Do not make up answers or guess.** Your responses should be based on established biological principles.

    The user will ask you a question. If a chat history is provided, consider it for context.
    Provide a clear, concise, and informative answer.
    **IMPORTANT: Your entire response MUST be in Turkish.**

    {{#if history}}
    {{#if history.length}}
    Previous conversation:
    {{#each history}}
    {{this.role}}: {{this.content}}
    {{/each}}
    {{/if}}
    {{/if}}

    User's current query: {{{query}}}

    Your entire output must be a JSON object matching the 'BiologyChatOutputSchema'.
  `,
});


// --- Genkit Flow Definition ---
const biologyChatFlow = ai.defineFlow(
  {
    name: 'biologyChatFlow',
    inputSchema: BiologyChatInputSchema,
    outputSchema: BiologyChatOutputSchema,
  },
  async (input) => {
    const { output } = await biologyChatPrompt(input);
    if (!output) {
      throw new Error("AI did not return an output for biology chat.");
    }
    return output;
  }
);

// --- Exported Wrapper Function ---
// This function now accepts the ChatMessage type (which includes system_error)
// and filters it before passing to the AI flow.
export async function biologyChat(
    input: { query: string; history?: ChatMessage[] }
): Promise<BiologyChatOutput> {
  const historyForAI = input.history
    ? input.history
        .filter(m => m.role === 'user' || m.role === 'assistant') // Filter out system_error for the AI
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })) // Ensure correct type for AI
    : undefined;

  return biologyChatFlow({ query: input.query, history: historyForAI });
}

