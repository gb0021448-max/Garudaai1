import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    let apiKey = (process.env.OPENROUTER_API_KEY || "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").trim();
    let requestedModel = (process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash").trim();

    apiKey = apiKey.replace(/^["']|["']$/g, "");
    requestedModel = requestedModel.replace(/^["']|["']$/g, "");

    const isApiKey = (str: string) => str.startsWith("sk-or-") || str.startsWith("sk-");
    const isModelName = (str: string) => str.includes("/") || str.includes("-") || str.includes("meta") || str.includes("anthropic") || str.includes("openai") || str.includes("deepseek");

    if (isApiKey(requestedModel) && !isApiKey(apiKey)) {
      const temp = apiKey;
      apiKey = requestedModel;
      requestedModel = temp;
    } else if (isApiKey(requestedModel) && isApiKey(apiKey)) {
      requestedModel = "google/gemini-2.5-flash";
    }

    if (isApiKey(requestedModel)) {
      requestedModel = "google/gemini-2.5-flash";
    }

    if (!isApiKey(apiKey) && isModelName(apiKey)) {
      apiKey = "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";
    }

    if (requestedModel === "google/gemini-1.5-flash" || requestedModel === "google/gemini-flash-1.5") {
      requestedModel = "google/gemini-2.5-flash";
    } else if (requestedModel === "google/gemini-1.5-pro" || requestedModel === "google/gemini-pro-1.5") {
      requestedModel = "google/gemini-2.5-pro";
    }

    const formattedMessages = messages.map((m: any) => {
      if (m.attachments && m.attachments.length > 0) {
        const textContent = { type: "text", text: m.content || "Analyze this media file" };
        const mediaBlocks = m.attachments.map((att: any) => {
          if (att.url.startsWith("data:")) {
            const parts = att.url.split(",");
            const mimeType = parts[0].split(";")[0].split(":")[1];
            const base64Data = parts[1];
            return {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Data}`
              }
            };
          }
          return null;
        }).filter(Boolean);

        return {
          role: m.role,
          content: [textContent, ...mediaBlocks]
        };
      }

      return {
        role: m.role,
        content: m.content
      };
    });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.APP_URL || "https://ai.studio/build",
        "X-Title": "Garuda AI Assistant"
      },
      body: JSON.stringify({
        model: requestedModel,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: "OpenRouter returned an error", 
        details: errorText,
        status: response.status
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
});

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
    console.log(`Garuda AI server running on http://localhost:${PORT}`);
  });
}

startServer();
