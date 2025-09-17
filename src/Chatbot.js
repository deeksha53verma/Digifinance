import { useState } from "react";
import { Box, TextField, Button, Card, Typography } from "@mui/material";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function Chatbot({ expenses }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! I'm your multilingual finance assistant. Ask me anything!" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    let reply = null;
    const lower = input.toLowerCase();

    // ✅ Rule-based answers
    if (lower.includes("total")) {
      const total = expenses.reduce((sum, e) => sum + e.amount, 0);
      reply = `💰 Your total spending is ₹${total}`;
    } else if (lower.includes("highest")) {
      const highest = expenses.reduce(
        (max, e) => (e.amount > max.amount ? e : max),
        { amount: 0 }
      );
      reply = highest.amount
        ? `📈 Highest expense: ${highest.item} — ₹${highest.amount}`
        : "No expenses yet.";
    } else if (lower.includes("average")) {
      const avg = expenses.length
        ? (expenses.reduce((s, e) => s + e.amount, 0) / expenses.length).toFixed(2)
        : 0;
      reply = `📊 Your average expense is ₹${avg}`;
    } else if (lower.includes("food")) {
      const totalFood = expenses
        .filter((e) => e.category === "Food")
        .reduce((sum, e) => sum + e.amount, 0);
      reply = `🍔 You spent ₹${totalFood} on Food.`;
    }

    // ✅ If no rule matched → use AI
    if (!reply) {
      try {
        const result = await model.generateContent(
          `You are a multilingual financial assistant. 
           Answer the following user query in the same language: "${input}". 
           The user’s expenses are: ${JSON.stringify(expenses)}`
        );
        reply = result.response.text();
      } catch (err) {
        console.error("❌ Gemini error:", err);
        reply = "⚠️ Sorry, I couldn’t process that right now.";
      }
    }

    setMessages([...messages, { from: "user", text: input }, { from: "bot", text: reply }]);
    setInput("");
  };

  return (
    <Card
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 320,
        p: 2,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6">🤖 Smart Chatbot</Typography>
      <Box sx={{ maxHeight: 250, overflowY: "auto", mb: 1 }}>
        {messages.map((m, i) => (
          <Typography
            key={i}
            align={m.from === "user" ? "right" : "left"}
            sx={{ mt: 1 }}
          >
            <b>{m.from === "user" ? "You: " : "Bot: "}</b>
            {m.text}
          </Typography>
        ))}
      </Box>
      <Box display="flex" gap={1}>
        <TextField
          size="small"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask in any language..."
        />
        <Button variant="contained" onClick={handleSend}>
          Send
        </Button>
      </Box>
    </Card>
  );
}

export default Chatbot;
