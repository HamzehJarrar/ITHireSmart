import { check } from "express-validator";

 const postCourseValidators = [
  check("courseTitle", "Course title is required").notEmpty(),
  check("location", "Location is required").notEmpty(),
  check("startAt", "Start date is required")
    .notEmpty()
    .custom((value, { req }) => {
      const startAt = new Date(value);
      const now = new Date();
      const endAt = new Date(req.body.endAt);

      if (startAt <= now) {
        throw new Error("Start date must be more than the current date");
      }

      if (endAt && startAt >= endAt) {
        throw new Error("Start date must be before the end date");
      }

      return true;
    }),
  check("endAt", "End date is required")
    .notEmpty()
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startAt)) {
        throw new Error("End date must be after the start date");
      }
      return true;
    }),
  check("description", "Description is required").notEmpty().isLength({ max: 1000 }),
  check("topics", "Topics are required").isArray(),
  check("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive number"),
  check("studentsEnrolled")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Number of students must be a positive number or zero"),
];
export default postCourseValidators;