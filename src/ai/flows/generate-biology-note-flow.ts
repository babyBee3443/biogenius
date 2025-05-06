'use server';
/**
 * @fileOverview AI flow for generating biology note suggestions.
 * This flow now provides structured suggestions for various fields of a biology note,
 * and considers existing form data and block structure provided by the user.
 * It's designed to act as an expert biology educator, prioritizing accuracy.
 *
 * - generateBiologyNoteSuggestion - A function that handles biology note suggestion generation.
 * - GenerateBiologyNoteSuggestionInput - The input type for the function.
 * - GenerateBiologyNoteSuggestionOutput - The return type for the function, containing suggested fields.
 */

import {ai} from '@/ai/ai-instance'; // Use the existing ai instance
import {z}  from 'genkit'; // Use from genkit for schema definition

// --- Simplified Block Structure for AI Input ---
const AiBlockStructureSchema = z.object({
    type: z.string().describe("The type of the block (e.g., 'text', 'heading', 'image')."),
    contentPreview: z.string().optional().describe("A short preview of the block's content (e.g., first 50 chars of text, heading text, image alt text)."),
});
export type AiBlockStructure = z.infer<typeof AiBlockStructureSchema>;


// --- Input Schema ---
const GenerateBiologyNoteSuggestionInputSchema = z.object({
  topic: z.string().describe('The main topic for the biology note (e.g., "Fotosentez", "Hücre Yapısı").'),
  level: z.enum(['Lise 9', 'Lise 10', 'Lise 11', 'Lise 12', 'Genel']).describe('Target audience level for the note. This is provided by the user, not for AI to guess.'),
  keywords: z.string().optional().describe('Comma-separated keywords to focus on (e.g., "ATP, kloroplast, ışık reaksiyonları").'),
  outline: z.string().optional().describe('A brief outline or specific sections the user wants to include (e.g., "Tanım, Aşamaları, Önemi"). This helps structure the note.'),
  currentFormData: z.object({
    currentTitle: z.string().optional().describe("User's current title for the note."),
    currentSummary: z.string().optional().describe("User's current summary for the note."),
    currentTags: z.array(z.string()).optional().describe("User's current tags for the note."),
    currentCategory: z.string().optional().describe("User's current category for the note."),
    currentLevel: z.string().optional().describe("User's current level selection for the note (for context)."),
    currentBlocksStructure: z.array(AiBlockStructureSchema).optional().describe("A simplified structure of the blocks currently in the editor, for AI to understand the existing layout and content flow.")
  }).optional().describe("Current values from the user's form and block structure, if any, for the AI to consider."),
});
export type GenerateBiologyNoteSuggestionInput = z.infer<typeof GenerateBiologyNoteSuggestionInputSchema>;


// --- Updated Output Schema for Structured Suggestions ---
const GenerateBiologyNoteSuggestionOutputSchema = z.object({
  suggestedTitle: z.string().describe("AI's suggestion for the note's title based on the topic and existing title (if any)."),
  suggestedSummary: z.string().optional().describe("AI's suggestion for a brief summary of the note, considering existing summary."),
  suggestedTags: z.array(z.string()).optional().describe("AI's suggestion for relevant tags or keywords, considering existing tags."),
  suggestedContentIdeas: z.string().describe("AI's suggestion for main content points, outline, or key information for the note. This should be a coherent text, possibly using Markdown for basic formatting like headings and lists. It should consider the `currentBlocksStructure` if provided, offering ideas to enhance or fill in that structure."),
});
export type GenerateBiologyNoteSuggestionOutput = z.infer<typeof GenerateBiologyNoteSuggestionOutputSchema>;


// --- Genkit Prompt Definition (Updated for Expert Persona and Accuracy) ---
const biologyNoteSuggestionPrompt = ai.definePrompt({
  name: 'generateBiologyNoteSuggestionPrompt',
  input: { schema: GenerateBiologyNoteSuggestionInputSchema },
  output: { schema: GenerateBiologyNoteSuggestionOutputSchema },
  prompt: `
    You are an **expert biology educator and a highly knowledgeable biology assistant.**
    Your primary goal is to provide **accurate, scientifically sound, and helpful** suggestions for creating biology study notes.
    **Accuracy is paramount.** If you are unsure about a specific piece of information, if there isn't a clear scientific consensus, or if the user's request is outside the scope of biology, you **must clearly state that** instead of providing potentially incorrect or misleading information. **Do not make up answers or guess.** Your suggestions should be based on established biological principles.

    Your task is to provide suggestions for creating a biology study note.
    The user will provide a topic, a target audience level, optional keywords, an optional outline, and potentially some already filled-in form data and the current structure of their note (blocks).

    Based on ALL this input, generate suggestions for the following fields. If the user has already provided a value for a field (like title, summary, tags), try to improve or build upon it rather than completely replacing it, unless the user's input is very minimal or clearly a placeholder.

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
        {{#if currentFormData.currentBlocksStructure.length}}
        - The user already has some blocks in their note. Here's a summary of the current structure:
          {{#each currentFormData.currentBlocksStructure}}
          - Block Type: {{this.type}}, Content Preview: "{{this.contentPreview}}"
          {{/each}}
          Your 'suggestedContentIdeas' should aim to complement, expand upon, or fill in the gaps of this existing structure. You might suggest new blocks or ways to enhance the existing ones.
        {{else}}
        - If no blocks currently exist, provide a comprehensive set of content ideas that could form the basis of a new note.
        {{/if}}

    User Input for Context:
    Note Topic: {{{topic}}}
    Target Level (for context): {{{level}}}
    {{#if keywords}}Keywords to include/focus on: {{{keywords}}}{{/if}}
    {{#if outline}}User-provided outline/sections: {{{outline}}}{{/if}}

    {{#if currentFormData}}
    Current User Form Data & Note Structure (Consider these inputs for your suggestions):
    {{#if currentFormData.currentTitle}}- Current Title: "{{currentFormData.currentTitle}}"{{/if}}
    {{#if currentFormData.currentSummary}}- Current Summary: "{{currentFormData.currentSummary}}"{{/if}}
    {{#if currentFormData.currentTags}}- Current Tags: {{#each currentFormData.currentTags}}"{{this}}" {{/each}}{{/if}}
    {{#if currentFormData.currentCategory}}- Current Category: "{{currentFormData.currentCategory}}" (You don't need to suggest this, just for context){{/if}}
    {{#if currentFormData.currentLevel}}- Current Level: "{{currentFormData.currentLevel}}" (You don't need to suggest this, just for context){{/if}}
      {{#if currentFormData.currentBlocksStructure.length}}
      - Current Blocks in Editor ({{currentFormData.currentBlocksStructure.length}} total):
        {{#each currentFormData.currentBlocksStructure}}
        - Type: {{this.type}}, Preview: "{{this.contentPreview}}"
        {{/each}}
      {{/if}}
    {{/if}}

    Your entire output must be a JSON object matching the 'GenerateBiologyNoteSuggestionOutputSchema'.
    Focus on providing informative and structured textual suggestions for each field. The 'suggestedContentIdeas' should be textual content, NOT a list of block objects.
    **Remember to be an expert, accurate, and cautious biology assistant. If unsure, state it.**
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
