import express from "express";
import auth from "../../middleware/auth.js";
import { check, validationResult } from "express-validator";
import Job from "../../models/Job.js";
import jobPostValidater from "../../middleware/jobPostvalidater.js"
const router = express.Router();
import * as handlers from "../jobs/jobshandlers.js"
import checkRole from "../../middleware/checkRole.js";
/*
1- POST/jobs
2- GET/jobs
3- GET/jobs/:jobId
4- DELETE/jobs/:jobId
5- PUT/jobs/:jobId
*/


// @route   POST /api/jobs/postJobs
// @desc    Create new Job
// @access  Private (company only)
router.post(
  "/postJobs",auth,jobPostValidater,handlers.postjob
);


// @route   GET /api/Jobs
// @desc    get all Jobs
// @access  Private (company only)
router.get("/", handlers.showalljobs);


// @route   GET /api/jobs/search?keyword=developer
// @desc    Search jobs by title or company name (case-insensitive)
// @access  Public (for users search)=
router.get("/search", handlers.searchjobbykeyword);


// @route   GET /api/Jobs/:jobId
// @desc    get a job by id
// @access  Private (company only)
router.get("/:jobId", auth, handlers.searchjobbyid);


// @route   DELETE /api/jobs/jobId
// @desc    delete a job by id
// @access  Private (company only)
router.delete("/:jobId", auth,checkRole("company"),handlers.deletejobbyid);


// @route   PUT /api/jobs/jobId
// @desc    edit a job by id
// @access  Private (company only)
router.put("/:jobId", auth,checkRole("company"),handlers.editjobbyid);


// @route   PUT /api/jobs/apply/:jobId
// @desc    edit a job by id
// @access  public
router.post("/apply/:jobId", auth,checkRole("user"), handlers.jobapply);


// @route   PUT /api/jobs/companyJobs/:userId
// @desc    edit a job by id
// @access  Private (company only)
router.get("/companyJobs/:userId",auth,checkRole("company"),handlers.showallmyjobs);

export default router;
