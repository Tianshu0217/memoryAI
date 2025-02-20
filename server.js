const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { nickname, message } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.azure.com/v1/completions",
      {
        model: "gpt-4",
        prompt: `${nickname}: ${message}\nBot:`,
        max_tokens: 100,
      },
      {
        headers: { "Authorization": `Bearer ${process.env.AZURE_OPENAI_KEY}` },
      }
    );

    const reply = response.data.choices[0].text.trim();
    res.json({ reply });

  } catch (error) {
    res.status(500).json({ error: "Error fetching response from OpenAI" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));

const fs = require("fs");
const path = require("path");

app.post("/api/chat", async (req, res) => {
  const { nickname, message } = req.body;

  const logPath = path.join(__dirname, "utbox_chat_logs.json");
  const logs = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, "utf-8")) : [];
  
  logs.push({ nickname, message, timestamp: new Date().toISOString() });

  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
  
  res.json({ success: true });
});