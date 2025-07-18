import express from "express";
import auth from "../../middleware/auth.js";
import { check, validationResult } from "express-validator";
import Job from "../../models/Job.js";
import jobPostValidater from "../../middleware/jobPostvalidater.js";
const router = express.Router();
import * as handlers from "../jobs/jobshandlers.js";
import checkRole from "../../middleware/checkRole.js";

// @route   POST /api/jobs/postJobs
// @desc    Create new Job
// @access  Private (company only)
router.post("/postJobs", auth, jobPostValidater, handlers.postjob);

// @route   GET /api/Jobs
// @desc    get all Jobs
// @access  Private (company only)
router.get("/", auth, handlers.showalljobs);

// @route   GET /api/jobs/search?keyword=developer
// @desc    Search jobs by title or company name (case-insensitive)
// @access  Public (for users search)=
router.get("/search", auth, handlers.searchjobbykeyword);

// @route   GET /api/Jobs/:jobId
// @desc    get a job by id
// @access  Private (company only)
router.get("/:jobId", auth, handlers.searchjobbyid);

// @route   DELETE /api/jobs/jobId
// @desc    delete a job by id
// @access  Private (company only)
router.delete("/:jobId", auth, checkRole("company"), handlers.deletejobbyid);

// @route   PUT /api/jobs/jobId
// @desc    edit a job by id
// @access  Private (company only)
router.put("/:jobId/edit", auth, checkRole("company"), handlers.editjobbyid);

// @route   PUT /api/jobs/apply/:jobId
// @desc    edit a job by id
// @access  public
router.post("/apply/:jobId", auth, handlers.jobapply);
// checkRole("user"),

// @route   PUT /api/jobs/companyJobs/:userId
// @desc    get all jobs by company id
// @access  Private (company only)
router.get(
  "/companyJobs/:userId",
  auth,
  checkRole("company"),
  handlers.showallmyjobs
);

// @route   PUT /api/jobs/:id/hide
// @desc    edit a job by id
// @access  Private (company only)
router.patch("/:id/hide", auth, checkRole("company"), handlers.hidejob);

// @route   PUT /api/jobs/:id/unhide
// @desc    edit a job by id
// @access  Private (company only)
router.patch("/:id/unhide", auth, checkRole("company"), handlers.unhidejob);

// @route   GET /api/jobs/:id/applicants
// @desc    Get all applicants for a job
// @access  Private (company only)
router.get(
  "/:jobId/applicants",
  auth,
  checkRole("company"),
  handlers.viewApplicants
);

// @route GET /api/jobs/getRecommendedApplicants
router.get(
  "/:jobId/recommendations",
  auth,
  checkRole("company"),
  handlers.getRecommendedApplicants
);

export default router;
