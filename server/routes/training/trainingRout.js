import express from "express";
import auth from "../../middleware/auth.js";
import checkRole from "../../middleware/checkRole.js";
import trainingpostvalidater from "../../middleware/trainingpostvalidater.js"
import * as handlers from "../training/trainingHandlers.js"
const router = express.Router();

// @route   POST /api/trainings
// @desc    Create new training
// @access  Private (company only)
router.post(
  "/postTraining",
  auth,checkRole("company"),trainingpostvalidater,handlers.Posttrain
);


// @route   GET /api/trainings
// @desc    Get all trainings
// @access  Private
router.get("/", auth,handlers.getalltrain);

// @route   GET /api/trainings/:trainingId
// @desc    Get training by ID
// @access  Private

router.get("/:trainingId", auth,handlers.gettrainbyid);

// @route   DELETE /api/trainings/:trainingId
// @desc    Delete training
// @access  Private

router.delete("/:trainingId", auth,checkRole("company"),handlers.deletetrain);

// @route   PUT /api/trainings/:trainingId
// @desc    Update training
// @access  Private
router.put("/:trainingId", auth,checkRole("company"),handlers.updatetrain );

export default router;
