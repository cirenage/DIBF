
'use server';

/**
 * @fileOverview AI flow to generate a professional newsletter draft for DIBF.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateNewsletterInputSchema = z.object({
  topic: z.string().describe("The primary focus or theme of this newsletter edition."),
  recentHighlights: z.string().describe("Key updates or successes to include."),
});
export type GenerateNewsletterInput = z.infer<typeof GenerateNewsletterInputSchema>;

const GenerateNewsletterOutputSchema = z.object({
  subjectLine: z.string().describe("A compelling subject line for the email."),
  body: z.string().describe("The full HTML/Markdown body of the newsletter draft."),
});
export type GenerateNewsletterOutput = z.infer<typeof GenerateNewsletterOutputSchema>;

export async function generateNewsletterDraft(input: GenerateNewsletterInput): Promise<GenerateNewsletterOutput> {
  return generateNewsletterDraftFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNewsletterDraftPrompt',
  input: { schema: GenerateNewsletterInputSchema },
  output: { schema: GenerateNewsletterOutputSchema },
  prompt: `You are a professional communications expert for the Doctors in Business Foundation (DIBF).
Your goal is to write a warm, inspiring, and informative newsletter draft for our community of supporters.

**DIBF Identity**:
- Mission: Advancing health equity, human dignity, and sustainable development.
- Tone: Empathetic, credible, and forward-looking.

**Newsletter Requirements**:
1. Start with a warm greeting.
2. Focus on the main topic: {{{topic}}}
3. Incorporate these specific highlights: {{{recentHighlights}}}
4. Include a clear call-to-action (e.g., visit the store, donate, or volunteer).
5. End with a message of gratitude from the DIBF team.

Keep the formatting clean and professional. Use markdown for the body.`,
});

const generateNewsletterDraftFlow = ai.defineFlow(
  {
    name: 'generateNewsletterDraftFlow',
    inputSchema: GenerateNewsletterInputSchema,
    outputSchema: GenerateNewsletterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
