import checkRole from "../middleware/checkRole.js";
import { check} from "express-validator";


const trainingpostvalidater = [

  checkRole("company"),
  check("trainingTitle", "Title is required").notEmpty(),
  check("location", "Location is required").notEmpty(),
  check("startAt", "Start date is required")
    .notEmpty(),
    
  check("endAt", "End date is required").notEmpty().custom((value) => {
    if (new Date(value) < new Date()) {
      throw new Error("End date must be after the start date");
    }
    return true;
  }),
  check("trainingDescription", "Description is required").notEmpty().isLength({ max: 1000 }),
  check("topicsCovered", "Topics covered is required").isArray(),
  check("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive number"),
]
export default trainingpostvalidater;