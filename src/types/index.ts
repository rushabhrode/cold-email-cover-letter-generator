export type Tone =
  | 'professional'
  | 'confident'
  | 'warm'
  | 'concise'
  | 'storytelling'
  | 'bold'

export interface GenerateRequest {
  jobDescription: string
  resumeText: string
  linkedinUrl?: string
  hiringManager?: string
  angle?: string
  tone: Tone
}

export interface GenerateResponse {
  coldEmail: string
  coverLetter: string
}
