import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    companyDescription: { type: String, required: false },
    companyField: { type: String, required: false },
    companyEmail: { type: String, required: true, unique: true },
    companyNumbers: { type: String, required: false },
    location: { type: String, required: true },
    companyWebsite: { type: String, required: false },
    contactName: { type: String, required: false },
    contactPosition: { type: String, required: false },
    contactPhoneNumber: { type: String, required: false },
    password: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiresAt: {
      type: Date,
    },
    dateOfcreation: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
