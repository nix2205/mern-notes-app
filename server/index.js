import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// Schema + Model
const MessageSchema = new mongoose.Schema({ text: String });
const Message = mongoose.model("Message", MessageSchema);

// Routes
app.get("/api/messages", async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

app.post("/api/messages", async (req, res) => {
  const { text } = req.body;
  const newMsg = new Message({ text });
  await newMsg.save();
  res.json(newMsg);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
