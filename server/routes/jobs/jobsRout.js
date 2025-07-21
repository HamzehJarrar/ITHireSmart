import express from "express";
import auth from "../../middleware/auth.js";
import { check, validationResult } from "express-validator";
import jobPostValidater from "../../middleware/jobPostvalidater.js";
import * as handlers from "../jobs/jobshandlers.js";
import checkRole from "../../middleware/checkRole.js";

const router = express.Router();

// ====================================================================
// Job Management Routes (Company Specific)
// ====================================================================

// @route   POST /api/jobs/postJobs
// @desc    Create a new job
// @access  Private (company only)
router.post("/postJobs", auth, jobPostValidater, handlers.postjob);

// @route   PUT /api/jobs/:jobId/edit
// @desc    Edit a job by its ID
// @access  Private (company only)
router.put("/:jobId/edit", auth, checkRole("company"), handlers.editjobbyid);

// @route   DELETE /api/jobs/:jobId
// @desc    Delete a job by its ID
// @access  Private (company only)
router.delete("/:jobId", auth, checkRole("company"), handlers.deletejobbyid);

// @route   PATCH /api/jobs/:id/hide
// @desc    Hide a job by its ID
// @access  Private (company only)
router.patch("/:id/hide", auth, checkRole("company"), handlers.hidejob);

// @route   PATCH /api/jobs/:id/unhide
// @desc    Unhide a job by its ID
// @access  Private (company only)
router.patch("/:id/unhide", auth, checkRole("company"), handlers.unhidejob);

// ====================================================================
// Job Viewing and Search Routes
// ====================================================================

// @route   GET /api/Jobs
// @desc    Get all jobs
// @access  Private (company only)
router.get("/", auth, handlers.showalljobs);

// @route   GET /api/jobs/search?keyword=developer
// @desc    Search jobs by title or company name (case-insensitive)
// @access  Public (for user search)
router.get("/search", auth, handlers.searchjobbykeyword);

// @route   GET /api/Jobs/:jobId
// @desc    Get a job by its ID
// @access  Private (company only)
router.get("/:jobId", auth, handlers.searchjobbyid);

// @route   GET /api/jobs/companyJobs/:userId
// @desc    Get all jobs posted by a specific company
// @access  Private (company only)
router.get(
  "/companyJobs/:userId",
  auth,
  checkRole("company"),
  handlers.showallmyjobs
);


// ====================================================================
// Application and Applicant Routes
// ====================================================================

// @route   POST /api/jobs/apply/:jobId
// @desc    Apply for a job
// @access  Public (for users)
router.post("/apply/:jobId", auth ,handlers.jobapply);

// @route   GET /api/jobs/:jobId/applicants
// @desc    Get all applicants for a specific job
// @access  Private (company only)
router.get(
  "/:jobId/applicants",
  auth,
  checkRole("company"),
  handlers.viewApplicants
);

// @route   GET /api/jobs/:jobId/recommendations
// @desc    Get recommended applicants for a specific job
// @access  Private (company only)
router.get(
  "/:jobId/recommendations",
  auth,
  checkRole("company"),
  handlers.getRecommendedApplicants
);

export default router;
