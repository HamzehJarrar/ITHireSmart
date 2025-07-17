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
      await sendVerificationEmail(companyEmail, verificationURL);
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
