import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    companyDescription: { type: String, required: false, default: "" },
    companyField: { type: String, required: false, default: "" },
    companyEmail: { type: String, required: true, unique: true },
    companyNumbers: { type: String, required: false, default: "" },
    location: { type: String, required: true, default: "" },
    companyWebsite: { type: String, required: false, default: "" },
    contactName: { type: String, required: false, default: "" },
    contactPosition: { type: String, required: false, default: "" },
    contactPhoneNumber: { type: String, required: false, default: "" },
    password: { type: String, required: true },
    profilepic: { type: String, default: "" },
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
    profilepic: {
  type: {
    url: { type: String, default: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" },
    publicid: { type: String, default: null }
  },
  default: undefined
}

  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
