const express = require("express");
const router = express.Router();
const controller = require("../controllers/puzzleController");

router.post("/", controller.createPuzzle);
router.get("/", controller.getAllPuzzles);
router.get("/:id", controller.getPuzzleById);
router.put("/:id", controller.updatePuzzle);
router.delete("/:id", controller.deletePuzzle);
router.get("/search/:key", controller.findPuzzles);

module.exports = router;
