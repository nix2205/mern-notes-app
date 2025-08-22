import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

// ✅ City Schema + Model
const CitySchema = new mongoose.Schema({
  city: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // ✅ Add timestamp
});

const City = mongoose.model("City", CitySchema);

// ✅ Routes

// Get all cities
app.get("/api/cities", async (req, res) => {
  try {
    const cities = await City.find().sort({ createdAt: -1 }); // latest first
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
});

// Add a new city
app.post("/api/cities", async (req, res) => {
  try {
    const { city } = req.body;
    if (!city || city.trim() === "") {
      return res.status(400).json({ error: "City is required" });
    }

    const newCity = await City.create({ city });
    res.status(201).json(newCity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add city" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
