import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import db, {
  createConversation,
  deleteConversation,
  getConversations,
  getMessages,
  saveMessage,
  updateConversationTitle,
} from "./database/database.js";
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
app.get("/api/conversations", async (req, res) => {
  try {
    const conversations = await getConversations();

    res.json(conversations);
  } catch (error) {
    console.error("Unable to load conversations:", error);

    res.status(500).json({
      error: "Unable to load conversations.",
    });
  }
});

app.post("/api/conversations", async (req, res) => {
  try {
    const title =
      req.body.title?.trim() || "New Chat";

    const conversation =
      await createConversation(title);

    res.status(201).json(conversation);
  } catch (error) {
    console.error("Unable to create conversation:", error);

    res.status(500).json({
      error: "Unable to create conversation.",
    });
  }
});

app.get(
  "/api/conversations/:id/messages",
  async (req, res) => {
    try {
      const conversationId = Number(req.params.id);

      if (!Number.isInteger(conversationId)) {
        return res.status(400).json({
          error: "Invalid conversation ID.",
        });
      }

      const messages =
        await getMessages(conversationId);

      res.json(messages);
    } catch (error) {
      console.error("Unable to load messages:", error);

      res.status(500).json({
        error: "Unable to load messages.",
      });
    }
  }
);

app.patch("/api/conversations/:id", async (req, res) => {
  try {
    const conversationId = Number(req.params.id);
    const title = req.body.title?.trim();

    if (!Number.isInteger(conversationId)) {
      return res.status(400).json({
        error: "Invalid conversation ID.",
      });
    }

    if (!title) {
      return res.status(400).json({
        error: "A conversation title is required.",
      });
    }

    const result = await updateConversationTitle(
      conversationId,
      title
    );

    res.json(result);
  } catch (error) {
    console.error("Unable to update conversation:", error);

    res.status(500).json({
      error: "Unable to update conversation.",
    });
  }
});

app.delete(
  "/api/conversations/:id",
  async (req, res) => {
    try {
      const conversationId = Number(req.params.id);

      if (!Number.isInteger(conversationId)) {
        return res.status(400).json({
          error: "Invalid conversation ID.",
        });
      }

      await deleteConversation(conversationId);

      res.status(204).end();
    } catch (error) {
      console.error("Unable to delete conversation:", error);

      res.status(500).json({
        error: "Unable to delete conversation.",
      });
    }
  }
);
app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message?.trim();
const conversationId = Number(req.body.conversationId);
    if (!message) {
      return res.status(400).json({
        error: "Please enter a message.",
      });
    }

    res.setHeader(
      "Content-Type",
      "text/plain; charset=utf-8"
    );
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const stream = await openai.responses.create({
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

      tool_choice: "auto",
      stream: true,

      instructions: `
You are KEN.AI, Kenneth LaVoie's personal AI assistant.

You help Ken with:
- Environmental health and safety
- Workplace reports and professional emails
- Information technology troubleshooting
- Power BI, Microsoft 365, SAP, networking, and Power Apps
- Graduate-school assignments and research
- Career development and project documentation

Use web search whenever the user asks for current or changing information,
including weather, news, sports, prices, laws, regulations, schedules,
software updates, company information, or current events.

Write clear, practical answers using Markdown when helpful.
Never claim an action was completed unless it actually was.
      `,

      input: message,
    });
let completeReply = "";
    for await (const event of stream) {
  if (event.type === "response.output_text.delta") {
    completeReply += event.delta;
    res.write(event.delta);
  }
}

    if (completeReply.trim()) {
  await saveMessage(
    conversationId,
    "KEN.AI",
    completeReply
  );
}

res.end();
  } catch (error) {
    console.error("OpenAI streaming error:", error);

    if (!res.headersSent) {
      const status = error?.status || 500;

      return res.status(status).json({
        error:
          error?.message ||
          "KEN.AI could not generate a response.",
      });
    }

    res.write(
      "\n\nKEN.AI encountered an error while answering."
    );
    res.end();
  }
});

app.listen(port, () => {
  console.log(
    `KEN.AI is running at http://localhost:${port}`
  );
});