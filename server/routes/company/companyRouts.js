import express from "express";
import * as handlers from "../company/companyhandlers.js"
const router = express.Router();

// Register a new company (open to all)
router.post("/register",handlers.companyRegister);


// Admin approves or denies a company
router.put("/verify/:id",handlers.verrifycompany);

// get all companies for admin dashboard
router.get("/showcompanies",handlers.getallcompanies);


export default router;
