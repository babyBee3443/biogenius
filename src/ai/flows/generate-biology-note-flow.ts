'use server';
/**
 * @fileOverview AI flow for generating biology note suggestions.
 * This flow now provides structured suggestions for various fields of a biology note,
 * and considers existing form data provided by the user.
 *
 * - generateBiologyNoteSuggestion - A function that handles biology note suggestion generation.
 * - GenerateBiologyNoteSuggestionInput - The input type for the function.
 * - GenerateBiologyNoteSuggestionOutput - The return type for the function, containing suggested fields.
 */

import {ai} from '@/ai/ai-instance'; // Use the existing ai instance
import {z}  from 'genkit'; // Use from genkit for schema definition

// --- Input Schema ---
const GenerateBiologyNoteSuggestionInputSchema = z.object({
  topic: z.string().describe('The main topic for the biology note (e.g., "Fotosentez", "Hücre Yapısı").'),
  level: z.enum(['Lise 9', 'Lise 10', 'Lise 11', 'Lise 12', 'Genel']).describe('Target audience level for the note. This is provided by the user, not for AI to guess.'),
  keywords: z.string().optional().describe('Comma-separated keywords to focus on (e.g., "ATP, kloroplast, ışık reaksiyonları").'),
  outline: z.string().optional().describe('A brief outline or specific sections the user wants to include (e.g., "Tanım, Aşamaları, Önemi"). This helps structure the note.'),
  currentFormData: z.object({ // Object to hold current form data
    currentTitle: z.string().optional().describe("User's current title for the note."),
    currentSummary: z.string().optional().describe("User's current summary for the note."),
    currentTags: z.array(z.string()).optional().describe("User's current tags for the note."),
    currentCategory: z.string().optional().describe("User's current category for the note."),
    currentLevel: z.string().optional().describe("User's current level selection for the note (for context)."),
  }).optional().describe("Current values from the user's form, if any, for the AI to consider."),
});
export type GenerateBiologyNoteSuggestionInput = z.infer<typeof GenerateBiologyNoteSuggestionInputSchema>;


// --- Updated Output Schema for Structured Suggestions ---
const GenerateBiologyNoteSuggestionOutputSchema = z.object({
  suggestedTitle: z.string().describe("AI's suggestion for the note's title based on the topic and existing title (if any)."),
  suggestedSummary: z.string().optional().describe("AI's suggestion for a brief summary of the note, considering existing summary."),
  suggestedTags: z.array(z.string()).optional().describe("AI's suggestion for relevant tags or keywords, considering existing tags."),
  suggestedContentIdeas: z.string().describe("AI's suggestion for the main content points, outline, or key information for the note. This should be a coherent text, possibly using Markdown for basic formatting like headings and lists to help the user structure their note content."),
  // No longer outputting suggestedCategory or suggestedLevel as these are user inputs
});
export type GenerateBiologyNoteSuggestionOutput = z.infer<typeof GenerateBiologyNoteSuggestionOutputSchema>;


// --- Genkit Prompt Definition (Updated) ---
const biologyNoteSuggestionPrompt = ai.definePrompt({
  name: 'generateBiologyNoteSuggestionPrompt',
  input: { schema: GenerateBiologyNoteSuggestionInputSchema },
  output: { schema: GenerateBiologyNoteSuggestionOutputSchema }, // Use the new output schema
  prompt: `
    You are an expert biology educator. Your task is to provide suggestions for creating a biology study note.
    The user will provide a topic, a target audience level, optional keywords, an optional outline, and potentially some already filled-in form data.
    
    Based on ALL this input, generate suggestions for the following fields. If the user has already provided a value for a field, try to improve or build upon it rather than completely replacing it, unless the user's input is very minimal or clearly a placeholder.

    1.  **suggestedTitle**: A clear and concise title for the note.
        {{#if currentFormData.currentTitle}}Current user title (consider this): "{{currentFormData.currentTitle}}"{{/if}}
    2.  **suggestedSummary**: (Optional) A brief summary (2-3 sentences) of the note.
        {{#if currentFormData.currentSummary}}Current user summary (consider this): "{{currentFormData.currentSummary}}"{{/if}}
    3.  **suggestedTags**: (Optional) An array of relevant keywords or tags for the note.
        {{#if currentFormData.currentTags}}Current user tags (consider this): {{#each currentFormData.currentTags}}"{{this}}" {{/each}}{{/if}}
    4.  **suggestedContentIdeas**: Key concepts, explanations, definitions, important details, or a structured outline related to the topic.
        - If an outline is provided by the user ({{{outline}}}), try to expand on it or integrate it.
        - If keywords are provided ({{{keywords}}}), ensure they are reflected in the content ideas.
        - Use clear, understandable language appropriate for the specified 'level' ({{{level}}}).
        - You can use simple Markdown for formatting the 'suggestedContentIdeas' (e.g., ## for headings, * for lists).

    User Input for Context:
    Note Topic: {{{topic}}}
    Target Level (for context): {{{level}}}
    {{#if keywords}}Keywords to include/focus on: {{{keywords}}}{{/if}}
    {{#if outline}}User-provided outline/sections: {{{outline}}}{{/if}}

    {{#if currentFormData}}
    Current User Form Data (Consider these inputs for your suggestions):
    {{#if currentFormData.currentTitle}}- Current Title: "{{currentFormData.currentTitle}}"{{/if}}
    {{#if currentFormData.currentSummary}}- Current Summary: "{{currentFormData.currentSummary}}"{{/if}}
    {{#if currentFormData.currentTags}}- Current Tags: {{#each currentFormData.currentTags}}"{{this}}" {{/each}}{{/if}}
    {{#if currentFormData.currentCategory}}- Current Category: "{{currentFormData.currentCategory}}" (You don't need to suggest this, just for context){{/if}}
    {{#if currentFormData.currentLevel}}- Current Level: "{{currentFormData.currentLevel}}" (You don't need to suggest this, just for context){{/if}}
    {{/if}}

    Your entire output must be a JSON object matching the 'GenerateBiologyNoteSuggestionOutputSchema'.
    Focus on providing informative and structured textual suggestions for each field.
    Do not attempt to create complex UI elements or directly fill a form. The 'suggestedContentIdeas' should be textual content.
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
      throw new Error("AI did not return an output for biology note suggestions.");
    }
    return output;
  }
);

// --- Exported Wrapper Function ---
export async function generateBiologyNoteSuggestion(input: GenerateBiologyNoteSuggestionInput): Promise<GenerateBiologyNoteSuggestionOutput> {
  return generateBiologyNoteSuggestionFlow(input);
}
