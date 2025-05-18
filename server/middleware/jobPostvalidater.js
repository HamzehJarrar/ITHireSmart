import { check } from "express-validator";
import checkRole from "../middleware/checkRole.js";

 const jobPostValidater = [
  checkRole("company"),
  check("jobTitle", "Title is required").notEmpty(),
  check("company", "Company is required").notEmpty(),
  check("location", "Location is required").notEmpty(),
  check("salary", "Salary is required").notEmpty(),
  check("from", "From date is required and needs to be from the past")
    .notEmpty()
    .custom((value, { req }) => {
      if (new Date(value) > new Date()) {
        throw new Error("From date must be in the past");
      }
      return true;
    }),

  check("jobDescription")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Job description must be less than 1000 characters"),
  check("salaryPeriod")
    .optional()
    .isIn(["hourly", "monthly", "yearly"])
    .withMessage("Salary period must be one of: hourly, monthly, yearly"),
  check("jobType")
    .optional()
    .isIn(["full-time", "part-time", "internship", "freelance"])
    .withMessage("Job type must be one of: full-time, part-time"),
  check("workType")
    .isIn(["Remote", "onsite", "Hybrid"])
    .withMessage("Work type must be one of: Remote, onsite, Hybrid"),
  check("experienceLevel")
    .optional()
    .isIn(["entry", "mid", "senior"])
    .withMessage("Experience level must be one of: entry, mid, senior"),
  check("Requirements")
    .optional()
    .isArray()
    .withMessage("Requirements should be an array"),
  check("Responsibilities")
    .optional()
    .isArray()
    .withMessage("Responsibilities should be an array"),
];
export default jobPostValidater;