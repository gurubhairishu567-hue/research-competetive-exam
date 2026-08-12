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

// Health Check API
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

    const chat = ai.chats.create({
      model: "gemini-3.6-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Replay conversation history if present
    if (Array.isArray(history) && history.length > 0) {
      for (const msg of history) {
        if (msg.role === "user" || msg.role === "model") {
          await chat.sendMessage({ message: msg.content || msg.text });
        }
      }
    }

    const response = await chat.sendMessage({ message: prompt });
    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in /api/ai/chat:", error);
    return res.status(500).json({
      error: "Failed to generate AI response. " + (error?.message || ""),
      fallbackText: "I encountered an error processing your request. Please verify your connection or try again shortly."
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

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
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

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
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

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
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

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: { systemInstruction }
    });

    return res.json({ result: response.text });
  } catch (error: any) {
    console.error("Error in /api/ai/note-action:", error);
    return res.status(500).json({ error: "Note processing failed: " + error?.message });
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
