import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is missing from the .env file.");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message?.trim();

    if (!message) {
      return res.status(400).json({
        error: "Please enter a message.",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions: `
You are KEN.AI, Kenneth LaVoie's personal AI assistant.

You help Ken with:
- Environmental health and safety
- Workplace reports and professional emails
- Information technology troubleshooting
- Power BI, Microsoft 365, SAP, networking, and Power Apps
- Graduate-school assignments and research
- Career development and project documentation

Write clearly and practically. Ask questions only when information is genuinely
missing. Do not claim an action was completed unless it actually was.
      `,
      input: message,
    });

    res.json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error("OpenAI error:", error);

    const status = error?.status || 500;

    if (status === 401) {
      return res.status(401).json({
        error: "The OpenAI API key was rejected. Check the key in your .env file.",
      });
    }

    if (status === 429) {
      return res.status(429).json({
        error:
          "Your OpenAI API account has reached a usage or billing limit. Check your API billing settings.",
      });
    }

    res.status(500).json({
      error: "KEN.AI could not generate a response. Check the terminal for details.",
    });
  }
});

app.listen(port, () => {
  console.log(`KEN.AI is running at http://localhost:${port}`);
});
