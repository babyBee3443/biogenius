'use server';
/**
 * @fileOverview AI flow for generating biology note suggestions.
 *
 * - generateBiologyNoteSuggestion - A function that handles biology note suggestion generation.
 * - GenerateBiologyNoteSuggestionInput - The input type for the function.
 * - GenerateBiologyNoteSuggestionOutput - The return type for the function.
 */

import {ai} from '@/ai/ai-instance';
import {z}  from 'genkit';

// --- Input and Output Schemas for the Flow ---
const GenerateBiologyNoteSuggestionInputSchema = z.object({
  topic: z.string().describe('The main topic for the biology note (e.g., "Fotosentez", "Hücre Yapısı").'),
  level: z.enum(['Lise 9', 'Lise 10', 'Lise 11', 'Lise 12', 'Genel']).describe('Target audience level for the note.'),
  keywords: z.string().optional().describe('Comma-separated keywords to focus on (e.g., "ATP, kloroplast, ışık reaksiyonları").'),
  outline: z.string().optional().describe('A brief outline or specific sections the user wants to include (e.g., "Tanım, Aşamaları, Önemi"). This helps structure the note.'),
});
export type GenerateBiologyNoteSuggestionInput = z.infer<typeof GenerateBiologyNoteSuggestionInputSchema>;

const GenerateBiologyNoteSuggestionOutputSchema = z.object({
  suggestionText: z.string().describe("A textual suggestion for the biology note content, including a title, summary, and main points. The AI should format this as a coherent text, possibly using Markdown for basic formatting like headings and lists if it helps clarity."),
});
export type GenerateBiologyNoteSuggestionOutput = z.infer<typeof GenerateBiologyNoteSuggestionOutputSchema>;


// --- Genkit Prompt Definition ---
const biologyNoteSuggestionPrompt = ai.definePrompt({
  name: 'generateBiologyNoteSuggestionPrompt',
  input: { schema: GenerateBiologyNoteSuggestionInputSchema },
  output: { schema: GenerateBiologyNoteSuggestionOutputSchema },
  prompt: `
    You are an expert biology educator. Your task is to generate a textual suggestion for a biology study note.
    The user will provide a topic, target level, optional keywords, and an optional outline.
    Based on this input, create a comprehensive and informative text suggestion for the note.

    The suggestion should include:
    1.  A clear and concise **Title**.
    2.  A brief **Summary** (2-3 sentences).
    3.  **Main Content**: Key concepts, explanations, definitions, and important details related to the topic.
        - If an outline is provided, try to follow it.
        - If keywords are provided, ensure they are incorporated naturally within the text.
        - Use clear, understandable language appropriate for the specified 'level'.
        - You can use simple Markdown for formatting if it enhances readability (e.g., ## for headings, * for lists).

    Note Topic: {{{topic}}}
    Target Level: {{{level}}}
    {{#if keywords}}Keywords to include/focus on: {{{keywords}}}{{/if}}
    {{#if outline}}User-provided outline/sections to include: {{{outline}}}{{/if}}

    Your entire output should be a single string under the 'suggestionText' field, representing the complete note suggestion.
    Do not try to create complex JSON or structured blocks. Just provide a well-written text.
  `,
});

// --- Genkit Flow Definition ---
const generateBiologyNoteSuggestionFlow = ai.defineFlow(
  {
    name: 'generateBiologyNoteSuggestionFlow',
    inputSchema: GenerateBiologyNoteSuggestionInputSchema,
    outputSchema: GenerateBiologyNoteSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await biologyNoteSuggestionPrompt(input);
    if (!output) {
      throw new Error("AI did not return an output for biology note suggestion.");
    }
    return output;
  }
);

// --- Exported Wrapper Function ---
export async function generateBiologyNoteSuggestion(input: GenerateBiologyNoteSuggestionInput): Promise<GenerateBiologyNoteSuggestionOutput> {
  return generateBiologyNoteSuggestionFlow(input);
}
