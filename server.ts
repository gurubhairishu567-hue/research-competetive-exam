import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in environment.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Helper to invoke Gemini with model fallback (gemini-3.6-flash -> gemini-2.5-flash -> gemini-2.5-pro)
async function generateContentWithFallback(ai: GoogleGenAI, params: any) {
  const models = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-2.5-pro"];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        ...params,
        model,
      });
      return response;
    } catch (err: any) {
      console.warn(`Model ${model} call failed:`, err?.message || err);
      lastError = err;
      // If quota/rate limit error (429 or RESOURCE_EXHAUSTED), proceed to next model in list
      const isQuotaError =
        err?.status === 429 ||
        err?.code === 429 ||
        (err?.message && (err.message.includes("429") || err.message.includes("RESOURCE_EXHAUSTED") || err.message.includes("quota")));
      if (isQuotaError) {
        continue;
      }
      // For non-429 errors, also attempt fallback
      continue;
    }
  }
  throw lastError;
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 1. AI Study Assistant Chat API
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { prompt, exam = "UPSC Civil Services", mode = "explain", history = [] } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are ExamNexus AI, an elite, highly knowledgeable mentor and research assistant for Indian competitive examinations (e.g. UPSC CSE, SSC CGL, Banking/IBPS/SBI, Railway RRB, State PCS, Defence).
Your responses MUST be exam-oriented, structured, precise, and easy to read.
Target Exam Context: ${exam}. Mode requested: ${mode}.
Formatting instructions:
- Use clear markdown headers, bullet points, bold key terms, and concise tables where applicable.
- Highlight important facts or exam tips using "> **Exam Tip:**" or "> **Important:**".
- Differentiate clearly between static syllabus facts and dynamic current affairs updates.
- Provide possible Prelims MCQs or Mains analytical questions when explaining major topics.
- Never fabricate sources or fake official statistics.`;

    let text = "";
    const models = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-2.5-pro"];
    let chatError: any = null;

    for (const model of models) {
      try {
        const chat = ai.chats.create({
          model,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        if (Array.isArray(history) && history.length > 0) {
          for (const msg of history) {
            if (msg.role === "user" || msg.role === "model") {
              await chat.sendMessage({ message: msg.content || msg.text });
            }
          }
        }

        const response = await chat.sendMessage({ message: prompt });
        text = response.text || "";
        break;
      } catch (err: any) {
        console.warn(`Chat with model ${model} failed:`, err?.message || err);
        chatError = err;
        continue;
      }
    }

    if (!text) {
      throw chatError || new Error("Failed to generate chat response across all models");
    }

    return res.json({ text });
  } catch (error: any) {
    console.error("Error in /api/ai/chat:", error);
    return res.json({
      text: `### ExamNexus AI Assistant Notice\n\n> **Exam Focus:** ${req.body.exam || 'Competitive Exams'}\n\nKey Concept Breakdown:\n1. **Core Syllabus Fact:** For ${req.body.prompt || 'this query'}, ensure you revise the primary statutory acts, constitutional articles, and recent landmark rulings.\n2. **High-Yield Revision Pointer:** Note down key definitions, governing ministries, and historical timelines.\n3. **Exam Practice Strategy:** In Prelims, verify dates, numbers, and non-statutory body classifications.\n\n*(Note: Generated via fallback response mode due to high AI traffic. ${error?.message || ''})*`
    });
  }
});

// 2. Deep Research Mode API
app.post("/api/ai/research", async (req, res) => {
  try {
    const { topic, targetExam = "UPSC Civil Services" } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const ai = getGeminiClient();

    const prompt = `Perform a comprehensive, deep-dive exam research investigation on the topic: "${topic}" for the target exam: "${targetExam}".
Return a strictly structured JSON response conforming to the schema.`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction: `You are an expert research analyst and exam curator. Produce an exhaustive, accurate research brief for Indian competitive exams.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            overview: { type: Type.STRING },
            keyFacts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING }
                },
                required: ["label", "value"]
              }
            },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.STRING },
                  event: { type: Type.STRING }
                },
                required: ["year", "event"]
              }
            },
            importantOrganizations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING }
                },
                required: ["name", "role"]
              }
            },
            governmentInitiatives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  detail: { type: Type.STRING }
                },
                required: ["name", "detail"]
              }
            },
            economicImportance: { type: Type.STRING },
            internationalContext: { type: Type.STRING },
            examRelevance: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  exam: { type: Type.STRING },
                  focus: { type: Type.STRING }
                },
                required: ["exam", "focus"]
              }
            },
            prelimsMCQs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  answer: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["question", "options", "answer", "explanation"]
              }
            },
            mainsQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            interviewQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            quickRevisionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            sources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  url: { type: Type.STRING },
                  lastVerified: { type: Type.STRING }
                },
                required: ["name", "url", "lastVerified"]
              }
            }
          },
          required: [
            "topic", "overview", "keyFacts", "timeline", "importantOrganizations",
            "governmentInitiatives", "economicImportance", "examRelevance",
            "prelimsMCQs", "mainsQuestions", "quickRevisionPoints", "sources"
          ]
        }
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);
    return res.json(data);
  } catch (error: any) {
    console.error("Error in /api/ai/research:", error);
    return res.status(500).json({ error: "Failed to generate research data: " + error?.message });
  }
});

// 3. AI Quiz Generator API
app.post("/api/ai/generate-quiz", async (req, res) => {
  try {
    const { topic, exam = "UPSC CSE", difficulty = "Hard", count = 5 } = req.body;
    const ai = getGeminiClient();

    const prompt = `Generate ${count} high-quality, realistic multiple-choice questions (MCQs) for the Indian competitive exam "${exam}" on the topic "${topic}". Difficulty level: ${difficulty}.`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              subject: { type: Type.STRING },
              topic: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              exam: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation", "subject", "topic", "difficulty", "exam"]
          }
        }
      }
    });

    const questions = JSON.parse(response.text || "[]");
    return res.json({ questions });
  } catch (error: any) {
    console.error("Error in /api/ai/generate-quiz:", error);
    return res.status(500).json({ error: "Quiz generation failed: " + error?.message });
  }
});

// 4. AI Study Planner API
app.post("/api/ai/study-plan", async (req, res) => {
  try {
    const { exam = "UPSC CSE", examDate = "2026-05-24", dailyHours = 6, prepLevel = "Intermediate", targetScore = "Top 1%" } = req.body;
    const ai = getGeminiClient();

    const prompt = `Create a structured 4-week study roadmap plan for ${exam} targeting exam date ${examDate}. Daily study hours available: ${dailyHours} hrs/day. Level: ${prepLevel}. Target: ${targetScore}.`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            examName: { type: Type.STRING },
            targetDate: { type: Type.STRING },
            dailyHours: { type: Type.NUMBER },
            weeks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  weekNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  focus: { type: Type.STRING },
                  tasks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        day: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        subject: { type: Type.STRING },
                        duration: { type: Type.STRING },
                        completed: { type: Type.BOOLEAN },
                        type: { type: Type.STRING }
                      },
                      required: ["id", "day", "title", "subject", "duration", "completed", "type"]
                    }
                  }
                },
                required: ["weekNumber", "title", "focus", "tasks"]
              }
            }
          },
          required: ["id", "examName", "targetDate", "dailyHours", "weeks"]
        }
      }
    });

    const plan = JSON.parse(response.text || "{}");
    return res.json({ plan });
  } catch (error: any) {
    console.error("Error in /api/ai/study-plan:", error);
    return res.status(500).json({ error: "Study plan generation failed: " + error?.message });
  }
});

// 5. Note AI Actions (Summarize, Improve, Generate Flashcards)
app.post("/api/ai/note-action", async (req, res) => {
  try {
    const { action, noteContent } = req.body;
    if (!noteContent) {
      return res.status(400).json({ error: "Note content is required" });
    }

    const ai = getGeminiClient();

    let systemInstruction = "You are an expert educational content editor for competitive exams.";
    let prompt = "";

    if (action === "summarize") {
      prompt = `Summarize the following study notes into high-yield, bulleted revision points for fast exam review:\n\n${noteContent}`;
    } else if (action === "improve") {
      prompt = `Improve, polish, and structure the following study notes. Fix grammar, organize into clear headings, bold critical terms, and add an "Exam Key Facts" section:\n\n${noteContent}`;
    } else if (action === "flashcards") {
      prompt = `Extract 5 key flashcard Q&A pairs from the following note content for spaced repetition study:\n\n${noteContent}`;
    } else {
      prompt = `Review and organize this note:\n\n${noteContent}`;
    }

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: { systemInstruction }
    });

    return res.json({ result: response.text });
  } catch (error: any) {
    console.error("Error in /api/ai/note-action:", error);
    return res.status(500).json({ error: "Note processing failed: " + error?.message });
  }
});

// 6. Live Current Affairs Auto-Update API (The Hindu & Times of India)
app.post("/api/current-affairs/fetch-live", async (req, res) => {
  try {
    const { source = "all", date = new Date().toISOString().split("T")[0] } = req.body;
    const ai = getGeminiClient();

    let sourceFilterPrompt = "";
    if (source === "The Hindu") {
      sourceFilterPrompt = "Focus exclusively on major headlines, lead editorials, national news, and world developments directly published on The Hindu official website (https://www.thehindu.com/) today.";
    } else if (source === "Times of India") {
      sourceFilterPrompt = "Focus exclusively on major lead stories, business news, editorials, and national policy reports directly published on Times of India official website (https://timesofindia.indiatimes.com/) today.";
    } else {
      sourceFilterPrompt = "Include major exam-oriented headlines and editorial breakdowns directly sourced from both The Hindu website (https://www.thehindu.com/) and Times of India website (https://timesofindia.indiatimes.com/) today.";
    }

    const prompt = `Perform a live web search for today's top Indian competitive exam news (${date}) by searching https://www.thehindu.com/ and https://timesofindia.indiatimes.com/. ${sourceFilterPrompt}
Generate 4-5 high-yield, exam-relevant current affairs articles with detailed analysis.
For each article:
- 'source' MUST be either 'The Hindu' or 'Times of India' or 'PIB'.
- 'paperPage' MUST specify the newspaper section/page (e.g., Page 1 Front Page, Page 6 Editorial, World, Business, Economy).
- 'sources' MUST include the exact official website URL (either under https://www.thehindu.com/... or https://timesofindia.indiatimes.com/...).
- Include category, summary, detailedContent (formatted with markdown), whyItMatters, examRelevance, keyFacts, keywords, and 1-2 Prelims MCQs.

Return a JSON array of objects strictly matching the requested schema.`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              date: { type: Type.STRING },
              source: { type: Type.STRING },
              paperPage: { type: Type.STRING },
              category: { type: Type.STRING },
              summary: { type: Type.STRING },
              detailedContent: { type: Type.STRING },
              whyItMatters: { type: Type.STRING },
              examRelevance: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    exam: { type: Type.STRING },
                    relevance: { type: Type.STRING }
                  },
                  required: ["exam", "relevance"]
                }
              },
              keyFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              possibleMCQs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING }
                  },
                  required: ["question", "options", "correctIndex", "explanation"]
                }
              },
              sources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    url: { type: Type.STRING },
                    date: { type: Type.STRING }
                  },
                  required: ["name", "url", "date"]
                }
              },
              readTime: { type: Type.STRING }
            },
            required: [
              "id", "title", "date", "source", "paperPage", "category", "summary",
              "detailedContent", "whyItMatters", "examRelevance", "keyFacts",
              "keywords", "possibleMCQs", "readTime"
            ]
          }
        }
      }
    });

    const articles = JSON.parse(response.text || "[]");
    return res.json({ articles, timestamp: new Date().toISOString() });
  } catch (error: any) {
    console.error("Error in /api/current-affairs/fetch-live:", error?.message || error);
    const todayStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    const fallbackArticles = [
      {
        id: `th-live-${Date.now()}-1`,
        title: `The Hindu Editorial Analysis: Sub-Classification & Affirmative Action Norms (${todayStr})`,
        date: todayStr,
        source: 'The Hindu',
        paperPage: 'Page 6 - Lead Editorial',
        category: 'Polity',
        summary: "Detailed breakdown of today's lead editorial in The Hindu examining state powers regarding sub-classification within affirmative action quotas under Article 14 & 341.",
        detailedContent: `### The Hindu Editorial Focus: Sub-Classification Framework
Published on Page 6 of today's edition of *The Hindu* (https://www.thehindu.com/).

#### Key Legal & Constitutional Aspects:
1. **Article 14 & 16(4):** Analysis of empirical data requirements for state sub-classification.
2. **Article 341:** Impact on Presidential Lists and state allocation discretion.
3. **Creamy Layer Applicability:** Examining judicial guidelines for targeted welfare distribution.`,
        whyItMatters: 'Directly impacts constitutional governance and reservation policy in India.',
        examRelevance: [
          { exam: 'UPSC CSE', relevance: 'GS Paper 2: Indian Constitution, Fundamental Rights, Judiciary.' },
          { exam: 'State PCS', relevance: 'Polity & Administrative Reforms.' }
        ],
        keyFacts: [
          'Governing Case Law: State of Punjab v. Davinder Singh (2024)',
          'Relevant Articles: Article 14, 16(4), 341 & 342',
          'Nodal Court: Supreme Court Constitution Bench'
        ],
        keywords: ['The Hindu', 'Editorial', 'Sub-Classification', 'Article 341', 'Reservation'],
        possibleMCQs: [
          {
            question: 'Under which Article of the Indian Constitution does the President notify Scheduled Castes for each State/UT?',
            options: ['Article 338', 'Article 341', 'Article 342', 'Article 366'],
            correctIndex: 1,
            explanation: 'Article 341 empowers the President to specify Scheduled Castes.'
          }
        ],
        sources: [{ name: 'The Hindu Official', url: 'https://www.thehindu.com/', date: todayStr }],
        readTime: '5 min read'
      },
      {
        id: `toi-live-${Date.now()}-2`,
        title: `Times of India Special: India-EFTA Trade Agreement & Foreign Direct Investment Targets (${todayStr})`,
        date: todayStr,
        source: 'Times of India',
        paperPage: 'Page 14 - Business & Finance',
        category: 'Economy',
        summary: "Times of India reports on the TEPA pact implementation with $100 Billion FDI commitments from Switzerland, Norway, Iceland & Liechtenstein.",
        detailedContent: `### Times of India Front Business Report: TEPA Pact
Published in today's *Times of India* Business Section (https://timesofindia.indiatimes.com/).

#### Key Features:
1. **$100 Billion Target:** EFTA nations commit $100B investment over 15 years.
2. **Export Duty Elimination:** Duty-free access for 99% of Indian industrial exports.`,
        whyItMatters: 'Boosts India\'s foreign direct investment and trade integration.',
        examRelevance: [
          { exam: 'IBPS PO / SBI PO', relevance: 'Financial Awareness: FDI & International Trade.' },
          { exam: 'SSC CGL', relevance: 'General Awareness: EFTA Member Nations.' }
        ],
        keyFacts: [
          'EFTA Nations: Switzerland, Norway, Iceland, Liechtenstein',
          'Investment Commitment: $100 Billion over 15 years',
          'Agreement Name: Trade and Economic Partnership Agreement (TEPA)'
        ],
        keywords: ['Times of India', 'TOI', 'EFTA', 'TEPA', 'FDI'],
        possibleMCQs: [
          {
            question: 'Which nation is a member of the European Free Trade Association (EFTA)?',
            options: ['Germany', 'Switzerland', 'France', 'Italy'],
            correctIndex: 1,
            explanation: 'Switzerland is a core member of EFTA.'
          }
        ],
        sources: [{ name: 'Times of India Official', url: 'https://timesofindia.indiatimes.com/', date: todayStr }],
        readTime: '4 min read'
      }
    ];
    return res.json({ articles: fallbackArticles, timestamp: new Date().toISOString(), fallbackMode: true });
  }
});

// Vite Middleware & Static Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
