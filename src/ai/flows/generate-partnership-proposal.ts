'use server';
/**
 * @fileOverview An AI assistant flow that generates customized draft partnership proposals for DIBF.
 *
 * - generatePartnershipProposal - A function that handles the generation of a partnership proposal.
 * - GeneratePartnershipProposalInput - The input type for the generatePartnershipProposal function.
 * - GeneratePartnershipProposalOutput - The return type for the generatePartnershipProposal function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePartnershipProposalInputSchema = z.object({
  organizationName: z.string().describe("The name of the potential partner's organization."),
  organizationFocus: z.string().describe("The primary focus areas and mission of the potential partner's organization."),
  partnershipInterests: z.string().describe("Specific interests, goals, or desired outcomes for partnering with DIBF."),
});
export type GeneratePartnershipProposalInput = z.infer<typeof GeneratePartnershipProposalInputSchema>;

const GeneratePartnershipProposalOutputSchema = z.object({
  proposalContent: z.string().describe("A draft partnership proposal highlighting alignment with DIBF's mission and outlining potential collaboration areas."),
});
export type GeneratePartnershipProposalOutput = z.infer<typeof GeneratePartnershipProposalOutputSchema>;

export async function generatePartnershipProposal(input: GeneratePartnershipProposalInput): Promise<GeneratePartnershipProposalOutput> {
  return generatePartnershipProposalFlow(input);
}

const proposalPrompt = ai.definePrompt({
  name: 'generatePartnershipProposalPrompt',
  input: { schema: GeneratePartnershipProposalInputSchema },
  output: { schema: GeneratePartnershipProposalOutputSchema },
  prompt: `You are an AI assistant tasked with generating a draft partnership proposal for the Doctors in Business Foundation (DIBF). Your goal is to help potential partners see how their organization aligns with DIBF's mission and to prepare a compelling collaboration pitch.

Here is key information about DIBF:
Brand Name: Doctors in Business Foundation | DIBF
Tagline: Advancing Health, Human Dignity, and Sustainable Development Across Africa and the Global Community.
Mission: To create sustainable pathways for people, institutions, and communities to improve lives, improve healthcare, and advance human dignity through service, partnership, innovation, and purposeful giving.
Vision: A world where every person, institution, and community has a meaningful pathway to create lasting impact, and where Africa's challenges inspire global collaboration, innovation, and shared responsibility.

Core Focus Areas:
- Health and Wellbeing
- Community Development
- Youth Leadership and Empowerment
- Mental Health Awareness
- Women and Family Support
- Education and Learning
- Humanitarian Initiatives
- Sustainable Giving
- Research and Knowledge Exchange
- Global Collaboration and Partnerships

Based on the following details from a potential partner, generate a draft partnership proposal. The proposal should clearly state the partner's organization, their focus, and how their interests align with DIBF's mission, vision, and core focus areas. Suggest specific areas of collaboration.

Potential Partner Details:
Organization Name: {{{organizationName}}}
Organization Focus: {{{organizationFocus}}}
Partnership Interests: {{{partnershipInterests}}}

Draft Partnership Proposal:`,
});

const generatePartnershipProposalFlow = ai.defineFlow(
  {
    name: 'generatePartnershipProposalFlow',
    inputSchema: GeneratePartnershipProposalInputSchema,
    outputSchema: GeneratePartnershipProposalOutputSchema,
  },
  async (input) => {
    const { output } = await proposalPrompt(input);
    return output!;
  }
);
