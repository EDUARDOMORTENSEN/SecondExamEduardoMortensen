const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const puzzleRoutes = require("./routes/puzzleRoutes");

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error(err));

app.use("/api/puzzles", puzzleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Puzzle backend on port ${PORT}`));
