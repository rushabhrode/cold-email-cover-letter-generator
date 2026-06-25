# 📧 Cold Email & Cover Letter Generator

> A modern, AI-powered web application that generates highly personalized cold emails and cover letters from a job description and your resume. Built with Next.js, Gemini API, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)
![Gemini API](https://img.shields.io/badge/Google_Gemini-API-orange?style=flat&logo=google)

## ✨ Features

- **📄 Intelligent PDF Parsing**: Upload your resume (PDF) and the app automatically extracts and structures your professional background using `pdfreader`, preserving layout and reading order.
- **🤖 Powered by Google Gemini**: Leverages the cutting-edge `@google/genai` API to craft compelling narratives.
- **🎯 Tailored Outputs**: Generates both a punchy, short cold email (under 150 words) and a detailed 4-paragraph cover letter tailored precisely to the provided Job Description.
- **🎨 Modern Glassmorphic UI**: Beautiful, fully responsive dark-mode interface built with Tailwind CSS and `shadcn/ui`.
- **⚡ Real-time Generation**: Instantaneous feedback with loading states and quick-copy functionality for your clipboard.
- **🔒 Secure Architecture**: API keys remain strictly on the server-side, never exposing your credentials to the browser.

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/rushabhrode/cold-email-cover-letter-generator.git
cd cold-email-cover-letter-generator
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory and add your Google Gemini API key. You can get one for free from Google AI Studio.

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai)
- **PDF Extraction**: [pdfreader](https://www.npmjs.com/package/pdfreader)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```text
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/route.ts     # Handles Gemini API communication
│   │   │   └── parse-pdf/route.ts    # Handles PDF extraction (Server-side)
│   │   ├── layout.tsx                # Root layout & global providers
│   │   ├── page.tsx                  # Main interactive UI
│   │   └── globals.css               # Tailwind & base styles
│   ├── components/
│   │   └── ui/                       # Reusable shadcn/ui components
│   └── lib/
│       ├── prompts.ts                # Structured prompt engineering for Gemini
│       └── utils.ts                  # Utility functions (e.g., class merging)
├── public/                           # Static assets
└── next.config.ts                    # Next.js configuration
```

## 💡 How It Works

1. **Input**: You paste a Job Description and upload your Resume as a PDF file. Optionally, you can include your LinkedIn URL, the Hiring Manager's name, and select the desired tone (Professional, Enthusiastic, Confident, etc.).
2. **Extraction**: The `/api/parse-pdf` route securely reads the binary PDF buffer directly in the Node.js runtime, mapping text coordinates to preserve the document's paragraph structure.
3. **Prompt Engineering**: The frontend sends the structured data to the `/api/generate` route, which injects the details into highly engineered prompts designed specifically for modern recruiting standards.
4. **Output**: Google's Gemini model returns a structured JSON payload containing the finalized Cold Email and Cover Letter, which are immediately rendered to the UI.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/cold-email-cover-letter-generator/issues).

---

Made with ❤️ by Rushabh Rode

