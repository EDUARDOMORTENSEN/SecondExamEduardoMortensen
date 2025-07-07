const Puzzle = require("../models/Puzzle");

exports.createPuzzle = async (req, res) => {
  try {
    const puzzle = new Puzzle(req.body);
    await puzzle.save();
    res.status(201).json({ message: "Puzzle created", puzzle });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPuzzles = async (req, res) => {
  try {
    const puzzles = await Puzzle.find();
    res.json(puzzles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPuzzleById = async (req, res) => {
  try {
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) return res.status(404).json({ message: "Not found" });
    res.json(puzzle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePuzzle = async (req, res) => {
  try {
    const updated = await Puzzle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePuzzle = async (req, res) => {
  try {
    await Puzzle.findByIdAndDelete(req.params.id);
    res.json({ message: "Puzzle deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findPuzzles = async (req, res) => {
  try {
    const key = req.params.key;
    const results = await Puzzle.find({
      $or: [
        { brand: { $regex: key, $options: "i" } },
        { model: { $regex: key, $options: "i" } },
        { category: { $regex: key, $options: "i" } },
      ],
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
