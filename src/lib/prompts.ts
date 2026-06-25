import { GenerateRequest } from '@/types'

const TONE_DESCRIPTIONS: Record<string, string> = {
  professional: 'professional and polished — clear, structured, no fluff',
  confident: 'confident and assertive — strong but not arrogant',
  warm: 'warm and human — conversational, genuine, easy to connect with',
  concise: 'ultra-concise and punchy — every word earns its place',
  storytelling: 'narrative and story-driven — creates a clear career arc',
  bold: 'bold and direct — memorable, sharp, and hard to ignore',
}

export function buildPrompt(input: GenerateRequest): string {
  const {
    jobDescription,
    resumeText,
    linkedinUrl,
    hiringManager,
    angle,
    tone,
  } = input

  const toneDesc = TONE_DESCRIPTIONS[tone] || TONE_DESCRIPTIONS.professional

  const salutationRule = hiringManager
    ? `Use this salutation where needed: "Dear ${hiringManager},".`
    : `Use "Dear Hiring Manager," where a salutation is needed.`

  const angleRule = angle
    ? `Use this candidate angle when relevant: "${angle}". Do not force it if it weakens the writing.`
    : 'Infer the strongest candidate angle from the resume and job description.'

  const linkedinRule = linkedinUrl
    ? `Mention this LinkedIn/portfolio URL once in the cold email only: ${linkedinUrl}`
    : 'Do not invent any LinkedIn, portfolio, GitHub, or website URL.'

  return `
You are an expert career strategist and professional copywriter.

Create two highly personalised job application outputs using the job description and candidate profile.

Tone:
${toneDesc}

Global rules:
- Be specific to this candidate and this job.
- Use only information present in the resume/profile, job description, and optional fields.
- Do not invent employers, metrics, degrees, tools, certifications, or achievements.
- If exact metrics are missing, describe impact qualitatively instead of fabricating numbers.
- Avoid clichés such as "passionate", "team player", "fast learner", and "looking for new challenges".
- ${salutationRule}
- ${angleRule}

Cold email rules:
- Maximum 150 words.
- First line must start with: Subject:
- Do not start with "I am writing to..."
- Connect one specific candidate experience to one specific job requirement.
- End with a clear CTA for a short call or conversation.
- ${linkedinRule}

Cover letter rules:
- 300 to 400 words.
- Exactly 4 paragraphs.
- Paragraph 1: strong opening hook linked to the company/role.
- Paragraph 2: most relevant experience, using concrete details from the resume.
- Paragraph 3: why this company/role, referencing the JD.
- Paragraph 4: confident close.
- Do not mention the LinkedIn/portfolio URL in the cover letter.

Return only valid JSON in this exact shape:
{
  "coldEmail": "Subject: ...\\n\\n...",
  "coverLetter": "..."
}

Job description:
${jobDescription}

Candidate resume/profile:
${resumeText}
`.trim()
}
