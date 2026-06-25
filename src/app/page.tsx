"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tone, GenerateResponse } from "@/types"
import { Loader2, Copy, Check, UploadCloud, Sparkles } from "lucide-react"

export default function Home() {
  const [jobDescription, setJobDescription] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [hiringManager, setHiringManager] = useState("")
  const [angle, setAngle] = useState("")
  const [tone, setTone] = useState<Tone>("professional")

  const [isParsingPdf, setIsParsingPdf] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [error, setError] = useState("")
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedLetter, setCopiedLetter] = useState(false)

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsParsingPdf(true)
    setError("")
    
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to parse PDF")
      }

      const data = await res.json()
      setResumeText(data.text)
    } catch (err: any) {
      setError(err.message || "An error occurred parsing the PDF.")
    } finally {
      setIsParsingPdf(false)
      // Reset input
      e.target.value = ''
    }
  }

  const handleGenerate = async () => {
    setError("")
    setResult(null)
    setIsGenerating(true)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          resumeText,
          linkedinUrl,
          hiringManager,
          angle,
          tone,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Generation failed")
      }

      const data = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || "An error occurred generating the content.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string, type: "email" | "letter") => {
    await navigator.clipboard.writeText(text)
    if (type === "email") {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } else {
      setCopiedLetter(true)
      setTimeout(() => setCopiedLetter(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans relative overflow-hidden flex flex-col">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="max-w-6xl mx-auto w-full space-y-12 relative z-10 flex-1 flex flex-col">
        <header className="text-center space-y-4 pt-12 pb-6">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Gemini Free Tier Powered
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-400">
            Smart Outreach Generator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl">
            Upload your resume, paste the job description, and instantly receive highly personalised cold emails and cover letters.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 items-start flex-1">
          {/* Input Form Section */}
          <Card className="bg-card/50 border-border backdrop-blur-sm shadow-xl flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">Application Details</CardTitle>
              <CardDescription>Provide context for your job application to tailor the outreach.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-1">
              
              <div className="space-y-2">
                <Label htmlFor="jd" className="text-foreground">Job Description *</Label>
                <Textarea 
                  id="jd" 
                  placeholder="Paste the full job description here..." 
                  className="h-32 bg-background/50 focus-visible:ring-indigo-500 transition-shadow resize-none"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume" className="text-foreground">Resume / Profile *</Label>
                <div className="flex gap-4 items-stretch">
                  <div className="flex-1">
                    <Textarea 
                      id="resume" 
                      placeholder="Paste your resume text here, or upload a PDF..." 
                      className="h-32 bg-background/50 focus-visible:ring-indigo-500 transition-shadow resize-none"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label 
                      htmlFor="pdf-upload" 
                      className={`flex-1 flex flex-col items-center justify-center px-6 py-4 border border-dashed border-border rounded-md hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group ${isParsingPdf ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      {isParsingPdf ? (
                        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin mb-2" />
                      ) : (
                        <UploadCloud className="w-6 h-6 text-muted-foreground group-hover:text-indigo-400 transition-colors mb-2" />
                      )}
                      <span className="text-xs text-muted-foreground text-center">Upload PDF</span>
                    </Label>
                    <input 
                      id="pdf-upload" 
                      type="file" 
                      accept=".pdf" 
                      className="hidden" 
                      onChange={handlePdfUpload}
                      disabled={isParsingPdf}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-foreground">LinkedIn/Portfolio URL</Label>
                  <Input 
                    id="linkedin" 
                    placeholder="https://linkedin.com/in/..." 
                    className="bg-background/50 focus-visible:ring-indigo-500 transition-shadow"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hiringManager" className="text-foreground">Hiring Manager Name</Label>
                  <Input 
                    id="hiringManager" 
                    placeholder="e.g. Jane Doe" 
                    className="bg-background/50 focus-visible:ring-indigo-500 transition-shadow"
                    value={hiringManager}
                    onChange={(e) => setHiringManager(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="angle" className="text-foreground">Candidate Angle (Optional)</Label>
                  <Input 
                    id="angle" 
                    placeholder="e.g. Transitioning to tech" 
                    className="bg-background/50 focus-visible:ring-indigo-500 transition-shadow"
                    value={angle}
                    onChange={(e) => setAngle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tone" className="text-foreground">Tone</Label>
                  <Select value={tone} onValueChange={(val) => setTone(val as Tone)}>
                    <SelectTrigger className="bg-background/50 focus:ring-indigo-500 transition-shadow">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="confident">Confident</SelectItem>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="concise">Concise</SelectItem>
                      <SelectItem value="storytelling">Storytelling</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
                  {error}
                </div>
              )}

            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
                onClick={handleGenerate}
                disabled={isGenerating || !jobDescription || !resumeText}
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Crafting perfection...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Outreach
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Results Section */}
          <Card className={`bg-card/50 border-border backdrop-blur-sm shadow-xl flex flex-col transition-all duration-500 ease-out ${result ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none translate-y-4'}`}>
            <CardHeader>
              <CardTitle className="text-2xl">Generated Assets</CardTitle>
              <CardDescription>Review, refine, and copy your tailored application copy.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-[400px]">
              <Tabs defaultValue="email" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 bg-background/50 p-1 rounded-lg">
                  <TabsTrigger value="email" className="data-[state=active]:bg-card data-[state=active]:text-indigo-400 rounded-md transition-all shadow-sm">Cold Email</TabsTrigger>
                  <TabsTrigger value="letter" className="data-[state=active]:bg-card data-[state=active]:text-cyan-400 rounded-md transition-all shadow-sm">Cover Letter</TabsTrigger>
                </TabsList>
                
                <div className="flex-1 mt-4 relative bg-background/50 border border-border rounded-lg p-5 font-mono text-sm text-foreground/80 leading-relaxed overflow-y-auto max-h-[500px]">
                  <TabsContent value="email" className="m-0 h-full">
                    {result ? (
                      <div className="whitespace-pre-wrap animate-in fade-in duration-500">{result.coldEmail}</div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground/50 italic">
                        Pending generation...
                      </div>
                    )}
                    {result && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-3 right-3 bg-card hover:bg-card/80 border border-border shadow-sm transition-colors"
                        onClick={() => copyToClipboard(result.coldEmail, "email")}
                      >
                        {copiedEmail ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-foreground/70" />}
                      </Button>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="letter" className="m-0 h-full">
                    {result ? (
                      <div className="whitespace-pre-wrap animate-in fade-in duration-500">{result.coverLetter}</div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground/50 italic">
                        Pending generation...
                      </div>
                    )}
                    {result && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-3 right-3 bg-card hover:bg-card/80 border border-border shadow-sm transition-colors"
                        onClick={() => copyToClipboard(result.coverLetter, "letter")}
                      >
                        {copiedLetter ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-foreground/70" />}
                      </Button>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}
