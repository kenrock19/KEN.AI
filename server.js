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
      model: "gpt-5.6",

      tools: [
        {
          type: "web_search",
          search_context_size: "low",
          user_location: {
            type: "approximate",
            country: "US",
            region: "New York",
            city: "Fultonville",
          },
        },
      ],

      tool_choice: "required",

      instructions: `
You are KEN.AI, Kenneth LaVoie's personal AI assistant.

You help Ken with environmental health and safety, professional emails,
IT troubleshooting, Power BI, Microsoft 365, SAP, networking, Power Apps,
graduate-school assignments, career development, and project documentation.

Use web search for current information such as weather, news, sports,
prices, laws, regulations, schedules, software updates, and current events.

When web search is used, provide a clear, current answer and do not claim
that you lack internet access.

Write clearly and practically.
      `,

      input: message,
    });

    console.log(
      response.output.map((item) => item.type)
    );

    return res.json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error("OpenAI error:", error);

    const status = error?.status || 500;

    if (status === 401) {
      return res.status(401).json({
        error:
          "The OpenAI API key was rejected. Check the key in your .env file.",
      });
    }

    if (status === 429) {
      return res.status(429).json({
        error:
          "Your OpenAI API account has reached a usage or billing limit.",
      });
    }

    return res.status(500).json({
      error:
        error?.message ||
        "KEN.AI could not generate a response.",
    });
  }
});

app.listen(port, () => {
  console.log(
    `KEN.AI is running at http://localhost:${port}`
  );
});