require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend dev URL
    methods: ["GET", "POST"],
  },
});

const PORT = 8080;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// In-memory storage for players per game room
// Format: { [gameCode]: [{ id: socketId, name: playerName }, ...] }
const gameRooms = {};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Handle player joining a game room
  socket.on("join-game", ({ gameCode, name }) => {
    socket.join(gameCode);

    if (!gameRooms[gameCode]) {
      gameRooms[gameCode] = [];
    }

    // Add player if not already in the room
    if (!gameRooms[gameCode].some((player) => player.id === socket.id)) {
      gameRooms[gameCode].push({ id: socket.id, name });
      console.log(`${name} joined game ${gameCode}`);
    }

    // Emit updated player list to all clients in the room
    io.to(gameCode).emit("players-updated", gameRooms[gameCode]);
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    // Remove player from any game room they were part of
    for (const gameCode in gameRooms) {
      const players = gameRooms[gameCode];
      const index = players.findIndex((player) => player.id === socket.id);
      if (index !== -1) {
        const [removed] = players.splice(index, 1);
        console.log(`${removed.name} left game ${gameCode}`);
        // Update all clients in this room
        io.to(gameCode).emit("players-updated", players);

        // Clean up empty rooms
        if (players.length === 0) {
          delete gameRooms[gameCode];
        }
        break; // A socket can only be in one game room here
      }
    }
  });
});

// API route for quiz generation
app.post("/api/generate-quiz", async (req, res) => {
  const { prompt, numQuestions } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `Generate ${numQuestions} multiple-choice quiz questions about "${prompt}". Format each question as:
{
  "question": "What year did WW2 begin?",
  "options": ["1939", "1941", "1914", "1945"],
  "correctAnswerIndex": 0
}
Return a JSON array of these questions.`,
        },
      ],
    });

    const raw = completion.choices[0].message.content;
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const firstBraceIndex = cleaned.indexOf("[");
    const jsonText = cleaned.slice(firstBraceIndex);

    const quiz = JSON.parse(jsonText);
    res.status(200).json({ quiz });
  } catch (error) {
    console.error("Error in /api/generate-quiz:", error);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

server.listen(PORT, () => {
  console.log(`Backend listening at http://localhost:${PORT}`);
});
