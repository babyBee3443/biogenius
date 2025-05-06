'use server';
/**
 * @fileOverview AI flow for generating biology note suggestions.
 * This flow now provides structured suggestions for various fields of a biology note.
 *
 * - generateBiologyNoteSuggestion - A function that handles biology note suggestion generation.
 * - GenerateBiologyNoteSuggestionInput - The input type for the function.
 * - GenerateBiologyNoteSuggestionOutput - The return type for the function, containing suggested fields.
 */

import {ai} from '@/ai/ai-instance'; // Use the existing ai instance
import {z}  from 'genkit'; // Use from genkit for schema definition

// --- Input Schema (remains the same) ---
const GenerateBiologyNoteSuggestionInputSchema = z.object({
  topic: z.string().describe('The main topic for the biology note (e.g., "Fotosentez", "Hücre Yapısı").'),
  level: z.enum(['Lise 9', 'Lise 10', 'Lise 11', 'Lise 12', 'Genel']).describe('Target audience level for the note. This is provided by the user, not for AI to guess.'),
  keywords: z.string().optional().describe('Comma-separated keywords to focus on (e.g., "ATP, kloroplast, ışık reaksiyonları").'),
  outline: z.string().optional().describe('A brief outline or specific sections the user wants to include (e.g., "Tanım, Aşamaları, Önemi"). This helps structure the note.'),
});
export type GenerateBiologyNoteSuggestionInput = z.infer<typeof GenerateBiologyNoteSuggestionInputSchema>;


// --- Updated Output Schema for Structured Suggestions ---
const GenerateBiologyNoteSuggestionOutputSchema = z.object({
  suggestedTitle: z.string().describe("AI's suggestion for the note's title based on the topic."),
  suggestedSummary: z.string().optional().describe("AI's suggestion for a brief summary of the note, if applicable."),
  suggestedTags: z.array(z.string()).optional().describe("AI's suggestion for relevant tags or keywords for the note, provided as an array of strings."),
  suggestedContentIdeas: z.string().describe("AI's suggestion for the main content points, outline, or key information for the note. This should be a coherent text, possibly using Markdown for basic formatting like headings and lists to help the user structure their note content."),
});
export type GenerateBiologyNoteSuggestionOutput = z.infer<typeof GenerateBiologyNoteSuggestionOutputSchema>;


// --- Genkit Prompt Definition (Updated) ---
const biologyNoteSuggestionPrompt = ai.definePrompt({
  name: 'generateBiologyNoteSuggestionPrompt',
  input: { schema: GenerateBiologyNoteSuggestionInputSchema },
  output: { schema: GenerateBiologyNoteSuggestionOutputSchema }, // Use the new output schema
  prompt: `
    You are an expert biology educator. Your task is to provide suggestions for creating a biology study note.
    The user will provide a topic, a target audience level (for context, but you don't need to suggest this), optional keywords, and an optional outline.
    Based on this input, generate suggestions for the following fields:
    1.  **suggestedTitle**: A clear and concise title for the note.
    2.  **suggestedSummary**: (Optional) A brief summary (2-3 sentences) of the note.
    3.  **suggestedTags**: (Optional) An array of relevant keywords or tags for the note.
    4.  **suggestedContentIdeas**: Key concepts, explanations, definitions, important details, or a structured outline related to the topic.
        - If an outline is provided by the user, try to expand on it or integrate it into your content ideas.
        - If keywords are provided, ensure they are reflected in the content ideas.
        - Use clear, understandable language appropriate for the specified 'level' (provided for your context).
        - You can use simple Markdown for formatting the 'suggestedContentIdeas' if it enhances readability (e.g., ## for headings, * for lists).

    User Input for Context:
    Note Topic: {{{topic}}}
    Target Level (for context): {{{level}}}
    {{#if keywords}}Keywords to include/focus on: {{{keywords}}}{{/if}}
    {{#if outline}}User-provided outline/sections to include: {{{outline}}}{{/if}}

    Your entire output must be a JSON object matching the 'GenerateBiologyNoteSuggestionOutputSchema'.
    Focus on providing informative and structured textual suggestions for each field.
    Do not attempt to create complex UI elements or directly fill a form.
  `,
});

// --- Genkit Flow Definition (remains largely the same, but uses new output) ---
const generateBiologyNoteSuggestionFlow = ai.defineFlow(
  {
    name: 'generateBiologyNoteSuggestionFlow',
    inputSchema: GenerateBiologyNoteSuggestionInputSchema,
    outputSchema: GenerateBiologyNoteSuggestionOutputSchema, // Use the new output schema
  },
  async (input) => {
    const { output } = await biologyNoteSuggestionPrompt(input);
    if (!output) {
      throw new Error("AI did not return an output for biology note suggestions.");
    }
    // The output is now expected to be an object matching GenerateBiologyNoteSuggestionOutputSchema
    return output;
  }
);

// --- Exported Wrapper Function (remains the same signature, but returns new output type) ---
export async function generateBiologyNoteSuggestion(input: GenerateBiologyNoteSuggestionInput): Promise<GenerateBiologyNoteSuggestionOutput> {
  return generateBiologyNoteSuggestionFlow(input);
}
