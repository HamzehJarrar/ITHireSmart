import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 100,
    },
    location: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    role: {
      type: String,
      enum: ["user", "admin", "company"],
      default: "user",
    },
    /* Using AI to get This Info  */
    education: [
      {
        school: { type: String, required: true },
        degree: { type: String },
        fieldOfStudy: { type: String },
        from: { type: Date },
        to: { type: Date },
        description: { type: String },
      },
    ],
    experience: [
      {
        title: { type: String, required: true },
        company: { type: String, required: true },
        from: { type: Date, required: true },
        to: { type: Date },
        current: { type: Boolean, default: false },
        description: { type: String },
      },
    ],

    trainingCourses: [String],
    skills: [String],
    languages: [String],

    profilepic: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
        publicid: null,
      },
    },
    bio: String,
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("User", userSchema);
