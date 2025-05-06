
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
    role: z.enum(['user', 'assistant']), // 'system_error' handled internally, not passed to AI history
    content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;


// --- Input Schema ---
const BiologyChatInputSchema = z.object({
  query: z.string().describe('The user\'s biology-related question or statement.'),
  history: z.array(ChatMessageSchema).optional().describe('Previous messages in the conversation for context. Exclude system error messages.'),
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

    {{#if history.length}}
    Previous conversation:
    {{#each history}}
    {{#if (eq this.role "user")}}User: {{this.content}}{{/if}}
    {{#if (eq this.role "assistant")}}AI: {{this.content}}{{/if}}
    {{/each}}
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
export async function biologyChat(input: BiologyChatInput): Promise<BiologyChatOutput> {
  return biologyChatFlow(input);
}
