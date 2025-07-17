import express from "express";
import * as handlers from "../company/companyhandlers.js";
import auth from "../../middleware/auth.js";
import checkRole from "../../middleware/checkRole.js";

const router = express.Router();

// POST - Register
router.post("/register", handlers.companyRegister);

// GET - Email verification
router.get("/verify-email", handlers.verifyCompanyEmail);

// PUT - Approve or Deny company by admin
router.put("/verify/:id", auth, checkRole("admin"), handlers.verifyCompany);

// GET - All Companies
router.get("/", auth, checkRole("admin"), handlers.getAllCompanies);

export default router;
