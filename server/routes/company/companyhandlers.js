import Company from "../../models/Company.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "config";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../../nodemailer/sendEmail.js";
import { validationResult } from "express-validator";

export async function companyRegister(req, res) {
  try {
    let {
      companyName,
      companyEmail,
      location,
      password,
      companyDescription,
      companyField,
      companyNumbers,
      companyWebsite,
      contactName,
      contactPosition,
      contactPhoneNumber,
    } = req.body;

    companyEmail = companyEmail.toLowerCase();

    if (!companyName || !companyEmail || !location || !password) {
      return res.status(400).json({
        error: "Company name, email, location, and password are required.",
      });
    }

    const existing = await Company.findOne({ companyEmail });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Company with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiresAt = Date.now() + 60 * 60 * 1000;

    const company = new Company({
      companyName,
      companyEmail,
      location,
      password: hashedPass,
      companyDescription,
      companyField,
      companyNumbers,
      companyWebsite,
      contactName,
      contactPosition,
      contactPhoneNumber,
      isVerified: false,
      verificationToken,
      verificationTokenExpiresAt,
      dateOfcreation: Date.now(),
    });

    await company.save();

    const verificationURL = `http://${process.env.FRONTEND_URL}/ConfirmCompanyEmail?token=${verificationToken}`;

    try {
      await sendVerificationEmail(companyName,companyEmail, verificationURL, "company");
    } catch (mailErr) {
      return res.status(500).json({
        errors: [
          {
            msg: "Registration succeeded but sending verification email failed.",
          },
        ],
      });
    }

    return res.status(201).json({
      message:
        "Company registration successful. Please check your email to verify your account.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function loginCompany(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { companyEmail, password } = req.body;
  companyEmail = companyEmail.toLowerCase();

  try {
    const company = await Company.findOne({ companyEmail });

    if (!company) {
      return res.status(404).json({ msg: "Company not found" });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (company.status !== "approved") {
      return res.status(403).json({ msg: "Company not approved yet" });
    }

    const payload = {
      user: {
        id: company._id,
        role: "company",
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "5d" },
      (err, token) => {
        if (err) {
          throw err;
        } else {
          res.json({
            token,
            id: company._id,
            companyName: company.companyName,
            email: company.companyEmail,

            role: "company",
          });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error :" + err.message });
  }
}

export const getCompanyProfile = async (req, res) => {
  try {
    const companyId = req.params.companyId;

    if (!companyId) {
      return res.status(400).json({ msg: "Company ID is required" });
    }

    const company = await Company.findById(companyId).select(
      "companyName companyDescription companyField companyEmail companyNumbers location companyWebsite contactName contactPosition contactPhoneNumber status isVerified dateOfcreation"
    );

    if (!company) {
      return res.status(404).json({ msg: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    console.error("Error fetching company profile:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

export async function verifyCompanyEmail(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Verification token is missing." });
  }

  try {
    const company = await Company.findOne({
      verificationToken: token,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!company) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    company.isVerified = true;
    company.verificationToken = undefined;
    company.verificationTokenExpiresAt = undefined;
    await company.save();

    const payload = {
      user: {
        id: company._id,
        role: "company",
      },
    };

    const tokenJWT = jwt.sign(payload, config.get("jwtSecret"), {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Company email verified successfully.",
      token: tokenJWT,
      userId: company._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function verifyCompany(req, res) {
  const { status } = req.body;

  if (!["approved", "denied"].includes(status)) {
    return res
      .status(400)
      .json({ error: "Status must be 'approved' or 'denied'." });
  }

  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ error: "Company not found." });
    }

    if (company.status === status) {
      return res.status(400).json({ error: `Company is already ${status}.` });
    }

    company.status = status;
    await company.save();

    res.json({ message: `Company has been ${status}.`, company });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAllCompanies(req, res) {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const editCompanyProfile = async (req, res) => {
  const { companyId } = req.params;

  if (req.user.id !== companyId && req.user.role !== "admin") {
    return res.status(403).json({ msg: "Unauthorized" });
  }

  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ msg: "Company not found" });
    }

    res.json(updatedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
