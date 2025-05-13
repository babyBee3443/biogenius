'use server';
/**
 * @fileOverview AI flow for generating a daily biology fact.
 * This flow provides a single, accurate, and verifiable biology fact in Turkish.
 * Accuracy is paramount.
 *
 * - getDailyBiologyFact - A function that handles fetching the daily biology fact.
 * - DailyBiologyFactOutput - The return type for the function.
 */

import {ai} from '@/ai/ai-instance';
import {z}  from 'genkit';

// --- Output Schema ---
const DailyBiologyFactOutputSchema = z.object({
  factTitle: z.string().describe("Kısa, dikkat çekici bir başlık veya konunun özeti (örneğin, 'Mitokondriyal DNA', 'Hücrenin Enerji Santrali')."),
  factDetail: z.string().describe("Günlük biyoloji bilgisi. Doğrulanabilir, ilginç ve genel kitle/öğrenciler için uygun olmalı. Cevap Türkçe olmalı."),
  sourceHint: z.string().optional().describe("İsteğe bağlı: Bu bilginin doğrulanabileceği bir arama terimi veya kaynak ipucu (örneğin, 'Araştır: mitokondriyal kalıtım')."),
});
export type DailyBiologyFactOutput = z.infer<typeof DailyBiologyFactOutputSchema>;


// --- Genkit Prompt Definition ---
const dailyFactPrompt = ai.definePrompt({
  name: 'dailyBiologyFactPrompt',
  output: { schema: DailyBiologyFactOutputSchema },
  prompt: `
    You are an **expert biology educator and a highly knowledgeable biology assistant.**
    Your primary goal is to provide a **single, accurate, scientifically sound, and verifiable** daily biology fact.
    **Accuracy is paramount.** The fact should be interesting and suitable for a general audience, including high school students.
    **If you are unsure about a specific piece of information, if there isn't a clear scientific consensus, or if the request is too broad to provide a single verifiable fact, you MUST state that you cannot provide a fact at this time instead of providing potentially incorrect or misleading information. Do not make up answers or guess.**
    Your response should be based on established biological principles.

    Provide one (1) daily biology fact.
    **IMPORTANT: Your entire response MUST be in Turkish.**
    The output must be a JSON object matching the 'DailyBiologyFactOutputSchema'.

    Example of a good fact:
    {
      "factTitle": "Hücrenin Güç Kaynağı",
      "factDetail": "Mitokondri, hücrenin enerji santrali olarak bilinir ve kendi DNA'sına sahiptir. Bu DNA sadece anneden çocuğa geçer.",
      "sourceHint": "Araştır: Mitokondriyal DNA kalıtımı"
    }
  `,
  config: {
    temperature: 0.7, // Allow for some creativity but maintain accuracy
    safetySettings: [ // Stricter safety settings for factual content
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  }
});


// --- Genkit Flow Definition ---
const getDailyBiologyFactFlow = ai.defineFlow(
  {
    name: 'getDailyBiologyFactFlow',
    outputSchema: DailyBiologyFactOutputSchema,
  },
  async () => {
    const { output } = await dailyFactPrompt({}); // No specific input needed for a daily random fact
    if (!output) {
      // This case should ideally be handled by the AI stating it cannot provide a fact.
      // If AI returns nothing, it's an unexpected error.
      throw new Error("AI did not return an output for the daily biology fact.");
    }
    // Validate if the AI explicitly stated it couldn't provide a fact
    if (output.factDetail.toLowerCase().includes("bilgi sağlayamıyorum") || output.factDetail.toLowerCase().includes("cannot provide a fact")) {
        return {
            factTitle: "Bilgi Yok",
            factDetail: "Bugün için doğrulanabilir bir biyoloji bilgisi bulunamadı. Lütfen daha sonra tekrar deneyin.",
            sourceHint: ""
        };
    }
    return output;
  }
);

// --- Exported Wrapper Function ---
export async function getDailyBiologyFact(): Promise<DailyBiologyFactOutput> {
  return getDailyBiologyFactFlow();
}
