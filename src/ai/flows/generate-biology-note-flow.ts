
'use server';
/**
 * @fileOverview AI flow for generating biology note suggestions, including block structure.
 * This flow provides structured suggestions for various fields of a biology note,
 * and considers existing form data and block structure provided by the user.
 * It's designed to act as an expert biology educator, prioritizing accuracy.
 *
 * - generateBiologyNoteSuggestion - A function that handles biology note suggestion generation.
 * - GenerateBiologyNoteSuggestionInput - The input type for the function.
 * - GenerateBiologyNoteSuggestionOutput - The return type for the function, containing suggested fields and blocks.
 */

import {ai} from '@/ai/ai-instance'; // Use the existing ai instance
import {z}  from 'genkit'; // Use from genkit/zod for schema definition

// --- Block Schemas ---
// Base block with common fields
const BaseBlockSchema = z.object({
  id: z.string().describe("A unique identifier for the block, can be a placeholder like 'temp-id-1' as frontend will generate new ones."),
  type: z.enum(['text', 'heading', 'image', 'video', 'quote', 'divider', 'section', 'gallery', 'code'])
            .describe("The type of the content block."),
});

const TextBlockSchema = BaseBlockSchema.extend({
  type: z.literal('text'),
  content: z.string().describe("The textual content of the paragraph."),
});

const HeadingBlockSchema = BaseBlockSchema.extend({
  type: z.literal('heading'),
  level: z.number().min(1).max(6).describe("The heading level (1-6). Prefer H2 or H3 for subheadings within a note."),
  content: z.string().describe("The text content of the heading."),
});

const ImageBlockSchema = BaseBlockSchema.extend({
  type: z.literal('image'),
  url: z.string().describe("URL of the image. Use a placeholder like 'https://placehold.co/800x400.png?text=Relevant+Image' if a specific image is not known."),
  alt: z.string().describe("Alternative text for the image, describing its content for accessibility and SEO."),
  caption: z.string().optional().describe("Optional caption for the image."),
});

const VideoBlockSchema = BaseBlockSchema.extend({
  type: z.literal('video'),
  url: z.string().describe("URL of the video (e.g., YouTube, Vimeo). Example: https://www.youtube.com/watch?v=VIDEO_ID"),
  youtubeId: z.string().optional().describe("If a YouTube video, its ID (e.g., dQw4w9WgXcQ). This will be extracted from URL if not provided, but providing it is helpful."),
});

const QuoteBlockSchema = BaseBlockSchema.extend({
  type: z.literal('quote'),
  content: z.string().describe("The text content of the quote."),
  citation: z.string().optional().describe("Optional citation or source of the quote."),
});

const DividerBlockSchema = BaseBlockSchema.extend({
  type: z.literal('divider'),
});

// For Section, Gallery, Code blocks, we'll keep them simpler for now, as their settings can be complex.
// AI can suggest their presence, and user can configure them.
const SectionBlockSchema = BaseBlockSchema.extend({
    type: z.literal('section'),
    sectionType: z.string().describe("Type of section, e.g., 'custom-text', 'featured-articles'. For generic content, suggest 'custom-text'."),
    settings: z.object({
        title: z.string().optional().describe("Optional title for the section."),
        content: z.string().optional().describe("If sectionType is 'custom-text', the HTML content can go here.")
    }).describe("Basic settings for the section. Complex settings should be configured by the user."),
});

const GalleryBlockSchema = BaseBlockSchema.extend({
  type: z.literal('gallery'),
  images: z.array(z.object({
    url: z.string().describe("URL of an image in the gallery."),
    alt: z.string().describe("Alt text for the image.")
  })).optional().describe("A list of images for the gallery. AI can suggest a few placeholder images.")
});

const CodeBlockSchema = BaseBlockSchema.extend({
  type: z.literal('code'),
  language: z.string().optional().describe("Programming language for syntax highlighting (e.g., 'javascript', 'python'). Default to 'plaintext' if unsure."),
  content: z.string().describe("The code snippet.")
});


const SuggestedBlockSchema = z.discriminatedUnion("type", [
  TextBlockSchema,
  HeadingBlockSchema,
  ImageBlockSchema,
  VideoBlockSchema,
  QuoteBlockSchema,
  DividerBlockSchema,
  SectionBlockSchema,
  GalleryBlockSchema,
  CodeBlockSchema
]);
export type SuggestedBlock = z.infer<typeof SuggestedBlockSchema>;


// Simplified Block Structure for AI Input (from existing content)
const AiBlockStructureInputSchema = z.object({
    type: z.string().describe("The type of the block (e.g., 'text', 'heading', 'image')."),
    contentPreview: z.string().optional().describe("A short preview of the block's content (e.g., first 50 chars of text, heading text, image alt text)."),
});
export type AiBlockStructureInput = z.infer<typeof AiBlockStructureInputSchema>;


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
    currentBlocksStructure: z.array(AiBlockStructureInputSchema).optional().describe("A simplified structure of the blocks currently in the editor, for AI to understand the existing layout and content flow.")
  }).optional().describe("Current values from the user's form and block structure, if any, for the AI to consider."),
});
export type GenerateBiologyNoteSuggestionInput = z.infer<typeof GenerateBiologyNoteSuggestionInputSchema>;


// --- Updated Output Schema for Structured Suggestions ---
const GenerateBiologyNoteSuggestionOutputSchema = z.object({
  suggestedTitle: z.string().describe("AI's suggestion for the note's title based on the topic and existing title (if any)."),
  suggestedSummary: z.string().optional().describe("AI's suggestion for a brief summary of the note, considering existing summary."),
  suggestedTags: z.array(z.string()).optional().describe("AI's suggestion for relevant tags or keywords, considering existing tags."),
  suggestedContentIdeas: z.string().optional().describe("AI's suggestion for main content points, outline, or key information for the note. This should be a coherent text, possibly using Markdown for basic formatting like headings and lists. This is a general text field if structured blocks are not suitable for the AI's response or if the user wants free-form ideas."),
  suggestedBlocks: z.array(SuggestedBlockSchema).optional().describe("AI's suggestion for a structured block-based content for the note. This is the preferred way to suggest content structure. If the AI cannot generate a full block structure, it can leave this field empty and use 'suggestedContentIdeas' instead."),
});
export type GenerateBiologyNoteSuggestionOutput = z.infer<typeof GenerateBiologyNoteSuggestionOutputSchema>;


// --- Exported Wrapper Function ---
export async function generateBiologyNoteSuggestion(input: GenerateBiologyNoteSuggestionInput): Promise<GenerateBiologyNoteSuggestionOutput> {
  return generateBiologyNoteSuggestionFlow(input);
}


// --- Genkit Prompt Definition ---
const biologyNotePrompt = ai.definePrompt({
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
    4.  **suggestedBlocks**: (Preferred Output) A structured array of content blocks for the note.
        - Each block must have an 'id' (you can use placeholders like 'temp-id-1', 'temp-id-2') and a 'type' (text, heading, image, video, quote, divider, section).
        - **Text Blocks:** Use clear, concise language. For 'text' blocks, use the 'content' field for the text.
        - **Heading Blocks:** Use 'content' for text and 'level' (2-6, prefer H2/H3 for subheadings) for the heading level.
        - **Image Blocks:**
            - For 'image' blocks, provide a relevant 'url'. If a specific image isn't known, use a placeholder like "https://placehold.co/800x400.png?text=[Descriptive+Image+Placeholder+About+Topic]" (e.g., "https://placehold.co/800x400.png?text=Photosynthesis+Diagram"). The placeholder text should be URL-encoded.
            - Provide descriptive 'alt' text.
            - Optionally, add a 'caption'.
        - **Video Blocks:** For 'video' blocks, provide a 'url' (e.g., a relevant YouTube search URL or a specific video URL if known). If a specific YouTube video is known, you can also suggest its 'youtubeId'.
        - **Quote Blocks:** Use 'content' for the quote and 'citation' for the source (optional).
        - **Divider Blocks:** Use these to separate sections.
        - **Section Blocks:** If you suggest a 'section' block, for 'sectionType', use 'custom-text' for general textual content within a section. The 'settings' object can include a 'title' and 'content' (HTML is allowed for custom-text content).
        - If an outline is provided by the user ({{{outline}}}), try to structure the blocks based on it.
        - If keywords are provided ({{{keywords}}}), ensure they are reflected in the block content.
        - Use clear, understandable language appropriate for the specified 'level' ({{{level}}}).
        {{#if currentFormData.currentBlocksStructure.length}}
        - The user already has some blocks in their note. Here's a summary:
          {{#each currentFormData.currentBlocksStructure}}
          - Block Type: {{this.type}}, Content Preview: "{{this.contentPreview}}"
          {{/each}}
          Your 'suggestedBlocks' should complement, expand upon, or fill in the gaps of this existing structure. You might suggest new blocks or ways to enhance existing ones.
        {{else}}
        - If no blocks currently exist, provide a comprehensive set of blocks that could form the basis of a new note.
        {{/if}}
    5.  **suggestedContentIdeas**: (Fallback if structured blocks are not feasible) If you cannot generate a structured block list, or as supplementary information, provide key concepts, explanations, or a structured outline here. Use simple Markdown for formatting (e.g., ## for headings, * for lists).

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
    **Prioritize generating a 'suggestedBlocks' array.** Use 'suggestedContentIdeas' as a fallback or for additional free-form ideas.
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
    const { output } = await biologyNotePrompt(input);
    if (!output) {
      throw new Error("AI did not return an output for biology note generation.");
    }
    // Ensure IDs for suggested blocks are placeholders if AI doesn't provide them
    if (output.suggestedBlocks) {
        output.suggestedBlocks = output.suggestedBlocks.map((block, index) => ({
            ...block,
            id: block.id || `temp-ai-id-${index}`
        }));
    }
    return output;
  }
);

    