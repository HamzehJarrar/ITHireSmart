import express from "express";
import auth from "../../middleware/auth.js";
import checkRole from "../../middleware/checkRole.js";
import trainingpostvalidater from "../../middleware/trainingpostvalidater.js";
import * as handlers from "../training/trainingHandlers.js";
const router = express.Router();



// @route   GET /api/trainings
// @desc    Get all trainings
// @access  Private
router.get("/", auth, handlers.getalltrain);

// @route   GET /api/trainings/:trainingId
// @desc    Get training by ID
// @access  Private

router.get("/:trainingId", auth, handlers.gettrainbyid);

// @route   DELETE /api/trainings/:trainingId
// @desc    Delete training
// @access  Private

router.delete("/:trainingId", auth, checkRole("company"), handlers.deletetrain);

// @route   PUT /api/trainings/:trainingId
// @desc    Update training
// @access  Private
router.put("/:trainingId", auth, checkRole("company"), handlers.updatetrain);

// @route   POST /api/trainings/:trainingId/enroll
// @desc    Enroll in training
router.post("/:trainingId/enroll", auth, handlers.enrollInTraining);


router.get("/company/:companyId", auth, handlers.getCompanyTrainings);

router.put("/:trainingId/hide", auth, checkRole("company"), handlers.hideTraining);

router.put("/:trainingId/unhide", auth, checkRole("company"), handlers.unhideTraining);

router.post("/postTraining",auth,checkRole("company"),trainingpostvalidater,handlers.postTraing);



// Get all participants (pending)
router.get("/:trainingId/participants", auth, handlers.getEnrolledTrainings);

// Get accepted participants
router.get("/:trainingId/participants/accepted", auth, handlers.getAcceptedParticipants);

// Get rejected participants
router.get("/:trainingId/participants/rejected", auth, handlers.getRejectedParticipants);

// Accept a participant
router.put("/:trainingId/participants/:participantId/accept", auth, handlers.acceptParticipant);

// Reject a participant
router.put("/:trainingId/participants/:participantId/reject", auth, handlers.rejectParticipant);

// Set participant back to pending
router.put("/:trainingId/participants/:participantId/pending", auth, handlers.setPendingParticipant);


export default router;
