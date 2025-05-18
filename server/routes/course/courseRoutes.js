import express from "express";
import { check, validationResult } from "express-validator";
import auth from "../../middleware/auth.js";
import checkRole from "../../middleware/checkRole.js";
import Course from "../../models/Course.js";
import * as handlers from "./coursehandler.js"
const router = express.Router();
import postCourseValidators from "../../middleware/coursepostvalidater.js"


router.use(auth);



// @route   GET /api/courses
// @desc    Get all courses
// @access  Private
router.route("/")
.get(handlers.getallcourses)


// @route   POST /api/courses
// @desc    Create new course
// @access  Private (company only)
router.route("/postCourse")
.post(checkRole("company"),postCourseValidators,handlers.postCourse)


// @route   GET /api/courses/:courseId
// @desc    Get course by ID
// @access  Private

// @route   DELETE /api/courses/:courseId
// @desc    Delete course
// @access  Private

// @route   PUT /api/courses/:courseId
// @desc    Update course
// @access  Private
router.route("/:courseId")
.get(handlers.coursesearchbyid)
.delete(handlers.deletecourse)
.put(handlers.updatecourse)



export default router;
